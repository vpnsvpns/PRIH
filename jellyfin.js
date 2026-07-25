(function () {
    'use strict';

    Lampa.Platform.tv();

    const CONFIG = {
        host: 'https://ru.mir-kino.pp.ru',
        username: 'rrrrrrrggsloooo@gmail.com',
        password: 'DimaPolina2905',
        clientName: 'Lampa',
        deviceId: 'lampa_device_id_1337',
        version: '1.0.0'
    };

    let authData = { token: null, userId: null };

    // Исправленный заголовок Jellyfin (без лишних кавычек в значениях!)
    function getEmbyHeader() {
        let header = `MediaBrowser Client=${CONFIG.clientName}, Device=${CONFIG.clientName}, DeviceId=${CONFIG.deviceId}, Version=${CONFIG.version}`;
        if (authData.token) header += `, Token=${authData.token}`;
        return header;
    }

    function authenticate(callback) {
        if (authData.token && authData.userId) return callback(true);

        const url = `${CONFIG.host}/Users/AuthenticateByName`;
        const headerValue = getEmbyHeader();

        $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            headers: {
                'X-Emby-Authorization': headerValue,
                'Authorization': headerValue
            },
            data: JSON.stringify({
                Username: CONFIG.username,
                Pw: CONFIG.password
            }),
            success: function (res) {
                if (res && res.AccessToken) {
                    authData.token = res.AccessToken;
                    authData.userId = res.User ? res.User.Id : (res.SessionInfo ? res.SessionInfo.UserId : null);
                    callback(true);
                } else {
                    Lampa.Noty.show('Мир Кино: Нет токена в ответе');
                    callback(false);
                }
            },
            error: function (xhr) {
                // Если 401/400 — пробуем альтернативный метод передачи данных
                if (xhr.status === 401 || xhr.status === 400) {
                    $.ajax({
                        url: url,
                        type: 'POST',
                        contentType: 'application/json',
                        headers: {
                            'X-Emby-Authorization': headerValue
                        },
                        data: JSON.stringify({
                            Username: CONFIG.username,
                            Password: CONFIG.password
                        }),
                        success: function (res2) {
                            if (res2 && res2.AccessToken) {
                                authData.token = res2.AccessToken;
                                authData.userId = res2.User ? res2.User.Id : null;
                                callback(true);
                            } else {
                                Lampa.Noty.show('Ошибка авторизации 401');
                                callback(false);
                            }
                        },
                        error: function () {
                            Lampa.Noty.show('Мир Кино: 401 Неверный логин/пароль');
                            callback(false);
                        }
                    });
                } else {
                    Lampa.Noty.show('Ошибка соединения: ' + xhr.status);
                    callback(false);
                }
            }
        });
    }

    function searchHints(query, callback) {
        authenticate(function (ok) {
            if (!ok) return callback([]);

            const cleanQuery = query.trim();
            const url = `${CONFIG.host}/Search/Hints?searchTerm=${encodeURIComponent(cleanQuery)}&userId=${authData.userId}&limit=10&api_key=${authData.token}`;

            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                headers: {
                    'X-Emby-Authorization': getEmbyHeader()
                },
                success: function (data) {
                    const results = (data && data.SearchHints) ? data.SearchHints : [];
                    callback(results);
                },
                error: function () {
                    callback([]);
                }
            });
        });
    }

    function smartSearch(movie, callback) {
        const titleRu = movie.title || movie.name || '';
        const titleEn = movie.original_title || movie.original_name || '';

        searchHints(titleRu, function (items) {
            if (items && items.length) return callback(items);

            if (titleEn && titleEn !== titleRu) {
                searchHints(titleEn, function (itemsEn) {
                    if (itemsEn && itemsEn.length) return callback(itemsEn);

                    const firstWord = titleRu.split(' ')[0];
                    searchHints(firstWord, callback);
                });
            } else {
                const firstWord = titleRu.split(' ')[0];
                searchHints(firstWord, callback);
            }
        });
    }

    function buildStreamUrl(itemId) {
        return `${CONFIG.host}/Items/${itemId}/Download?api_key=${authData.token}`;
    }

    function openMirKino(movie) {
        Lampa.Loading.start(function () {
            Lampa.Loading.stop();
        });

        smartSearch(movie, function (items) {
            Lampa.Loading.stop();

            if (!items || !items.length) {
                Lampa.Noty.show('На Мир Кино ничего не найдено');
                return;
            }

            const playlist = items.map(item => {
                const id = item.ItemId || item.Id;
                return {
                    title: `${item.Name} [4K / 5.1]`,
                    url: buildStreamUrl(id)
                };
            });

            if (playlist.length === 1) {
                Lampa.Player.play(playlist[0]);
            } else {
                Lampa.Select.show({
                    title: 'Мир Кино: Результаты',
                    items: playlist,
                    onSelect: function (selected) {
                        Lampa.Player.play(selected);
                    }
                });
            }
        });
    }

    function startPlugin() {
        if (window.jellyfin_mirkino_v7) return;
        window.jellyfin_mirkino_v7 = true;

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
