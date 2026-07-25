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
        if (authData.token && authData.userId) {
            return callback(true);
        }

        $.ajax({
            url: `${CONFIG.host}/Users/AuthenticateByName`,
            type: 'POST',
            contentType: 'application/json',
            headers: {
                'X-Emby-Authorization': getAuthHeader()
            },
            data: JSON.stringify({
                Username: CONFIG.username,
                Pw: CONFIG.password
            }),
            success: function (response) {
                if (response && response.AccessToken) {
                    authData.token = response.AccessToken;
                    authData.userId = response.User.Id;
                    callback(true);
                } else {
                    callback(false);
                }
            },
            error: function () {
                callback(false);
            }
        });
    }

    function searchMedia(title, callback) {
        authenticate(function (ok) {
            if (!ok) return callback([]);

            const url = `${CONFIG.host}/Users/${authData.userId}/Items?SearchTerm=${encodeURIComponent(title)}&Recursive=true&IncludeItemTypes=Movie,Series,Episode`;

            $.ajax({
                url: url,
                type: 'GET',
                headers: {
                    'X-Emby-Authorization': getAuthHeader()
                },
                success: function (data) {
                    callback(data.Items || []);
                },
                error: function () {
                    callback([]);
                }
            });
        });
    }

    function startPlugin() {
        if (window.jellyfin_mirkino_loaded) return;
        window.jellyfin_mirkino_loaded = true;

        // Встраивание кнопки в панель источников карточки фильма
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'complite') {
                const render = e.object.activity.render();
                const container = render.find('.full-start__buttons');

                // Проверяем, чтобы не дублировать кнопку
                if (container.find('.button--mirkino').length === 0) {
                    const btn = $(`
                        <div class="full-start__button selector button--mirkino">
                            <svg height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
                                <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5h-13L12 6.5z"/>
                            </svg>
                            <span>Мир Кино</span>
                        </div>
                    `);

                    btn.on('hover:enter', function () {
                        const movieTitle = e.data.movie.title || e.data.movie.name;
                        
                        Lampa.Loading.start(function () {
                            Lampa.Loading.stop();
                        });

                        searchMedia(movieTitle, function (items) {
                            Lampa.Loading.stop();

                            if (!items.length) {
                                Lampa.Noty.show('Ничего не найдено на Мир Кино');
                                return;
                            }

                            // Если найден один файл — запускаем, если несколько — выводим список
                            const playlist = items.map(item => ({
                                title: item.Name,
                                url: `${CONFIG.host}/Videos/${item.Id}/stream.m3u8?static=true&api_key=${authData.token}`
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
                    });

                    container.append(btn);
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
