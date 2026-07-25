(function () {
    'use strict';

    const CONFIG = {
        host: 'https://mir-kino.pp.ru',
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

    // Формирование обязательного заголовка Jellyfin API
    function getAuthHeader() {
        let header = `MediaBrowser Client="${CONFIG.clientName}", Device="Lampa", DeviceId="${CONFIG.deviceId}", Version="${CONFIG.version}"`;
        if (authData.token) {
            header += `, Token="${authData.token}"`;
        }
        return header;
    }

    // Авторизация на сервере Jellyfin
    function authenticate(callback) {
        if (authData.token && authData.userId) {
            return callback(true);
        }

        const url = `${CONFIG.host}/Users/AuthenticateByName`;
        const body = JSON.stringify({
            Username: CONFIG.username,
            Pw: CONFIG.password
        });

        $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            headers: {
                'X-Emby-Authorization': getAuthHeader()
            },
            data: body,
            success: function (response) {
                if (response && response.AccessToken) {
                    authData.token = response.AccessToken;
                    authData.userId = response.User.Id;
                    callback(true);
                } else {
                    callback(false);
                }
            },
            error: function (err) {
                console.error('Jellyfin Auth Error:', err);
                callback(false);
            }
        });
    }

    // Поиск элементов на сервере
    function searchItems(query, callback) {
        authenticate(function (success) {
            if (!success) return callback([]);

            const url = `${CONFIG.host}/Users/${authData.userId}/Items?SearchTerm=${encodeURIComponent(query)}&Recursive=true&IncludeItemTypes=Movie,Series,Episode`;

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

    // Получение прямых ссылок на воспроизведение
    function getStreamUrl(itemId) {
        return `${CONFIG.host}/Videos/${itemId}/stream.m3u8?static=true&api_key=${authData.token}`;
    }

    // Регистрация источника в Lampa
    function JellyfinSource() {
        this.search = function (object, callback) {
            const query = object.search || object.title;
            searchItems(query, function (items) {
                const results = items.map(function (item) {
                    return {
                        name: item.Name,
                        title: item.Name,
                        original_title: item.OriginalTitle || item.Name,
                        year: item.ProductionYear || '',
                        quality: item.Container || 'HD',
                        url: getStreamUrl(item.Id),
                        timeline: item.UserData ? item.UserData.PlaybackPositionTicks : 0
                    };
                });
                callback(results);
            });
        };
    }

    // Инициализация модуля в интерфейсе Lampa
    function startPlugin() {
        if (window.jellyfin_mirkino_plugin) return;
        window.jellyfin_mirkino_plugin = true;

        // Добавляем новый источник во вкладку онлайн-просмотра
        Lampa.Component.add('jellyfin_mirkino', JellyfinSource);

        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'start') {
                const button = `<div class="full-start__button selector button--jellyfin">
                    <svg height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
                        <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5h-13L12 6.5z"/>
                    </svg>
                    <span>Мир Кино (Jellyfin)</span>
                </div>`;

                e.object.activity.render().find('.full-start__buttons').append(button);
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