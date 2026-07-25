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
        return `MediaBrowser Client="${CONFIG.clientName}", Device="Lampa", DeviceId="${CONFIG.deviceId}", Version="${CONFIG.version}"`;
    }

    function authenticate(callback) {
        if (authData.token && authData.userId) return callback(true);

        const url = `${CONFIG.host}/Users/AuthenticateByName`;
        
        $.ajax({
            url: url,
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
                    Lampa.Noty.show('Ошибка авторизации на Мир Кино');
                    callback(false);
                }
            },
            error: function (xhr) {
                Lampa.Noty.show('Ошибка подключения к Мир Кино: ' + xhr.status);
                callback(false);
            }
        });
    }

    // Использование родного эндпоинта Jellyfin Search Hints
    function searchHints(query, callback) {
        authenticate(function (ok) {
            if (!ok) return callback([]);

            const cleanQuery = query.trim();
            const url = `${CONFIG.host}/Search/Hints?searchTerm=${encodeURIComponent(cleanQuery)}&userId=${authData.userId}&limit=10&api_key=${authData.token}`;

            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
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

        // 1. Поисковый запрос по русскому названию
        searchHints(titleRu, function (items) {
            if (items && items.length) return callback(items);

            // 2. Поисковый запрос по английскому/оригинальному названию
            if (titleEn && titleEn !== titleRu) {
                searchHints(titleEn, function (itemsEn) {
                    if (itemsEn && itemsEn.length) return callback(itemsEn);

                    // 3. Поиск по первому слову (например, просто "Моана")
                    const firstWord = titleRu.split(' ')[0];
                    searchHints(firstWord, callback);
                });
            } else {
                const firstWord = titleRu.split(' ')[0];
                searchHints(firstWord, callback);
            }
        });
    }

    // Прямая отдача файла в 4K с многоканальным звуком
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
        if (window.jellyfin_mirkino_hints_v5) return;
        window.jellyfin_mirkino_hints_v5 = true;

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
