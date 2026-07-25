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

    function searchMedia(query, callback) {
        authenticate(function (ok) {
            if (!ok) return callback([]);

            const url = `${CONFIG.host}/Users/${authData.userId}/Items?SearchTerm=${encodeURIComponent(query)}&Recursive=true&IncludeItemTypes=Movie,Series,Episode`;

            $.ajax({
                url: url,
                type: 'GET',
                headers: { 'X-Emby-Authorization': getAuthHeader() },
                success: function (data) { callback(data.Items || []); },
                error: function () { callback([]); }
            });
        });
    }

    function openMirKino(movie) {
        const title = movie.title || movie.name;
        Lampa.Loading.start(function () { Lampa.Loading.stop(); });

        searchMedia(title, function (items) {
            Lampa.Loading.stop();

            if (!items || !items.length) {
                Lampa.Noty.show('На Мир Кино ничего не найдено');
                return;
            }

            const playlist = items.map(item => ({
                title: item.Name,
                url: `${CONFIG.host}/Videos/${item.Id}/stream.m3u8?static=true&api_key=${authData.token}`
            }));

            if (playlist.length === 1) {
                Lampa.Player.play(playlist[0]);
            } else {
                Lampa.Select.show({
                    title: 'Мир Кино: Выбор серии / файла',
                    items: playlist,
                    onSelect: function (selected) {
                        Lampa.Player.play(selected);
                    }
                });
            }
        });
    }

    function startPlugin() {
        if (window.jellyfin_mirkino_installed) return;
        window.jellyfin_mirkino_installed = true;

        // 1. Встраивание кнопки во все возможные блоки карточки
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'complite') {
                const render = e.object.activity.render();
                const movie = e.data.movie;

                // Вставляем кнопку под торренты/онлайн или рядом со "Смотреть"
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

        // 2. Регистрация в меню "Источник" (если вызвана штатная кнопка "Онлайн")
        Lampa.Component.add('mirkino_view', function (object) {
            this.start = function () {
                openMirKino(object.movie);
            };
            this.render = function () { return $('<div></div>'); };
            this.destroy = function () {};
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
