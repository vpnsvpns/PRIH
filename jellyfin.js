(function () {
    'use strict';

    Lampa.Platform.tv();

    const CONFIG = {
        host: 'https://ru.mir-kino.pp.ru',
        username: 'rrrrrrrggsloooo@gmail.com',
        password: 'DimaPolina2905',
        clientName: 'Lampa Client',
        deviceId: 'lampa_jellyfin_device',
        version: '1.0.0'
    };

    let authData = { token: null, userId: null };

    function getAuthHeader() {
        let header = `MediaBrowser Client="${CONFIG.clientName}", Device="Lampa", DeviceId="${CONFIG.deviceId}", Version="${CONFIG.version}"`;
        if (authData.token) header += `, Token="${authData.token}"`;
        return header;
    }

    function authenticate(callback) {
        if (authData.token && authData.userId) return callback(true);

        $.ajax({
            url: `${CONFIG.host}/Users/AuthenticateByName`,
            type: 'POST',
            contentType: 'application/json',
            headers: { 'X-Emby-Authorization': getAuthHeader() },
            data: JSON.stringify({ Username: CONFIG.username, Pw: CONFIG.password }),
            success: function (res) {
                if (res && res.AccessToken) {
                    authData.token = res.AccessToken;
                    authData.userId = res.User.Id;
                    callback(true);
                } else {
                    callback(false);
                }
            },
            error: function () { callback(false); }
        });
    }

    function requestItems(query, callback) {
        authenticate(function (ok) {
            if (!ok) return callback([]);

            const url = `${CONFIG.host}/Users/${authData.userId}/Items?SearchTerm=${encodeURIComponent(query)}&Recursive=true&IncludeItemTypes=Movie,Series,Episode&Fields=MediaSources,Path`;

            $.ajax({
                url: url,
                type: 'GET',
                headers: { 'X-Emby-Authorization': getAuthHeader() },
                success: function (data) { callback(data.Items || []); },
                error: function () { callback([]); }
            });
        });
    }

    // Каскадный поиск: русское название -> оригинальное название -> очищенный запрос
    function smartSearch(movie, callback) {
        const titleRu = movie.title || movie.name || '';
        const titleEn = movie.original_title || movie.original_name || '';

        requestItems(titleRu, function (items) {
            if (items && items.length) return callback(items);

            if (titleEn && titleEn !== titleRu) {
                requestItems(titleEn, function (itemsEn) {
                    if (itemsEn && itemsEn.length) return callback(itemsEn);

                    // Убираем цифры и спецсимволы, ищем по базовому слову
                    const cleanTitle = titleRu.replace(/[^\w\sа-яА-ЯёЁ]/gi, '').trim();
                    requestItems(cleanTitle, callback);
                });
            } else {
                const cleanTitle = titleRu.replace(/[^\w\sа-яА-ЯёЁ]/gi, '').trim();
                requestItems(cleanTitle, callback);
            }
        });
    }

    // Прямая отдача файла для поддержки 4K и 5.1 без тупящего HLS-транскодинга
    function buildStreamUrl(item) {
        return `${CONFIG.host}/Items/${item.Id}/Download?api_key=${authData.token}`;
    }

    function openMirKino(movie) {
        Lampa.Loading.start(function () { Lampa.Loading.stop(); });

        smartSearch(movie, function (items) {
            Lampa.Loading.stop();

            if (!items || !items.length) {
                Lampa.Noty.show('На Мир Кино ничего не найдено');
                return;
            }

            const playlist = items.map(item => ({
                title: `${item.Name} [4K / 5.1]`,
                url: buildStreamUrl(item)
            }));

            if (playlist.length === 1) {
                Lampa.Player.play(playlist[0]);
            } else {
                Lampa.Select.show({
                    title: 'Мир Кино: Выберите файл',
                    items: playlist,
                    onSelect: function (selected) {
                        Lampa.Player.play(selected);
                    }
                });
            }
        });
    }

    function startPlugin() {
        if (window.jellyfin_mirkino_smart_v3) return;
        window.jellyfin_mirkino_smart_v3 = true;

        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'complite') {
                const render = e.object.activity.render();
                const movie = e.data.movie;

                let target = render.find('.full-start__buttons');
                if (!target.length) target = render.find('.full-start-new__buttons');

                if (target.length && !target.find('.button--mirkino').length) {
                    const btn = $(`
                        <div class="full-start__button selector button--mirkino" style="background: rgba(255,255,255,0.1); margin-right: 10px;">
                            <svg height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
                                <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5h-13L12 6.5z"/>
                            </svg>
                            <span>Мир Кино</span>
                        </div>
                    `);

                    btn.on('hover:enter click', function () {
                        openMirKino(movie);
                    });

                    target.prepend(btn);
                }
            }
        });
    }

    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') startPlugin();
        });
    }
})();
