(function () {
    'use strict';

    const CONFIG = {
        host: 'https://ru.mir-kino.pp.ru',
        username: 'rrrrrrrggsloooo@gmail.com',
        password: 'DimaPolina2905',
        clientName: 'Lampa Client',
        deviceId: 'lampa_jellyfin_device',
        version: '1.0.0'
    };

    let authData = {
        token: null,
        userId: null
    };

    function getAuthHeader() {
        let header = `MediaBrowser Client="${CONFIG.clientName}", Device="Lampa", DeviceId="${CONFIG.deviceId}", Version="${CONFIG.version}"`;
        if (authData.token) {
            header += `, Token="${authData.token}"`;
        }
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

    function initPlugin() {
        if (window.jellyfin_mirkino_injected) return;
        window.jellyfin_mirkino_injected = true;

        // Всплывашка при загрузке Lampa для проверки работы
        if (window.Lampa && Lampa.Noty) {
            Lampa.Noty.show('Мир Кино: Плагин подключен!');
        }

        // Слушатель открытия карточки фильма
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'complite' || e.type === 'build') {
                const render = e.object.activity.render();
                const targetContainer = render.find('.full-start__buttons');

                if (targetContainer.length && !targetContainer.find('.button--mirkino').length) {
                    const btn = $(`
                        <div class="full-start__button selector button--mirkino">
                            <svg height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
                                <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5h-13L12 6.5z"/>
                            </svg>
                            <span>Мир Кино</span>
                        </div>
                    `);

                    btn.on('hover:enter click', function () {
                        const movieTitle = e.data.movie.title || e.data.movie.name;
                        Lampa.Loading.start(function () { Lampa.Loading.stop(); });

                        searchMedia(movieTitle, function (items) {
                            Lampa.Loading.stop();

                            if (!items || !items.length) {
                                Lampa.Noty.show('Не найдено на Мир Кино');
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
                                    title: 'Мир Кино: Серии / Файлы',
                                    items: playlist,
                                    onSelect: function (selected) {
                                        Lampa.Player.play(selected);
                                    }
                                });
                            }
                        });
                    });

                    targetContainer.append(btn);
                }
            }
        });
    }

    if (window.appready) {
        initPlugin();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') initPlugin();
        });
    }
})();
