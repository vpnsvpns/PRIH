(function () {
    'use strict';

    Lampa.Platform.tv();

    var CONFIG = {
        host: 'https://ru.mir-kino.pp.ru',
        username: 'rrrrrrrggsloooo@gmail.com',
        password: 'DimaPolina2905',
        clientName: 'Lampa Client',
        deviceId: 'lampa_jellyfin_device',
        version: '1.0.0'
    };

    var authData = { token: null, userId: null };

    function getAuthHeader() {
        var header = 'MediaBrowser Client="' + CONFIG.clientName + '", Device="Lampa", DeviceId="' + CONFIG.deviceId + '", Version="' + CONFIG.version + '"';
        if (authData.token) header += ', Token="' + authData.token + '"';
        return header;
    }

    function authenticate(callback) {
        if (authData.token && authData.userId) return callback(true);

        $.ajax({
            url: CONFIG.host + '/Users/AuthenticateByName',
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

            var url = CONFIG.host + '/Users/' + authData.userId + '/Items?SearchTerm=' + encodeURIComponent(query) + '&Recursive=true&IncludeItemTypes=Movie,Series,Episode';

            $.ajax({
                url: url,
                type: 'GET',
                headers: { 'X-Emby-Authorization': getAuthHeader() },
                success: function (data) { callback(data.Items || []); },
                error: function () { callback([]); }
            });
        });
    }

    // Главный компонент отображения содержимого Мир Кино
    function MirKinoComponent(object) {
        var comp = this;
        var network = new Lampa.Reguest();
        var scroll = new Lampa.Scroll({ mask: true, over: true });
        var files = new Lampa.Explorer(object);
        var filter = new Lampa.Filter(object);

        this.start = function () {
            var title = object.search || object.movie.title || object.movie.name;
            
            Lampa.Activity.toggle();
            Lampa.Loading.start(function () {
                network.clear();
                Lampa.Activity.backward();
            });

            searchMedia(title, function (items) {
                Lampa.Loading.stop();
                
                if (!items || !items.length) {
                    var empty = Lampa.Template.get('empty', { title: 'Ничего не найдено', text: 'На Мир Кино нет данного тайтла' });
                    scroll.append(empty);
                } else {
                    items.forEach(function (item) {
                        var item_html = Lampa.Template.get('button', {
                            title: item.Name,
                            subtitle: item.ProductionYear || 'Jellyfin'
                        });

                        item_html.on('hover:enter', function () {
                            var streamUrl = CONFIG.host + '/Videos/' + item.Id + '/stream.m3u8?static=true&api_key=' + authData.token;
                            Lampa.Player.play({
                                title: item.Name,
                                url: streamUrl
                            });
                        });

                        scroll.append(item_html);
                    });
                }

                files.appendFiles(scroll.render());
                files.appendHead(filter.render());
                Lampa.Controller.enable('content');
            });
        };

        this.render = function () {
            return files.render();
        };

        this.destroy = function () {
            network.clear();
            scroll.destroy();
            files.destroy();
        };
    }

    function startPlugin() {
        if (window.mirkino_jellyfin_plugin) return;
        window.mirkino_jellyfin_plugin = true;

        // Регистрируем новый компонент в Lampa
        Lampa.Component.add('mirkino_online', MirKinoComponent);

        // Перевод интерфейса
        Lampa.Lang.add({
            mirkino_title: {
                ru: "Мир Кино (Jellyfin)",
                en: "Mir Kino (Jellyfin)",
                uk: "Мір Кіно (Jellyfin)"
            }
        });

        // 1. Интеграция кнопки в карточку фильма (full-start__buttons)
        function addSourceButton(args) {
            var render = args.render;
            var movie = args.movie;

            if (render.find('.button--mirkino').length) return;

            var button = $(
                '<div class="full-start__button selector button--mirkino">' +
                    '<svg height="24" viewBox="0 0 24 24" width="24" fill="currentColor">' +
                        '<path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5h-13L12 6.5z"/>' +
                    '</svg>' +
                    '<span>Мир Кино</span>' +
                '</div>'
            );

            button.on('hover:enter click', function () {
                Lampa.Activity.push({
                    title: Lampa.Lang.translate('mirkino_title'),
                    component: 'mirkino_online',
                    movie: movie,
                    search: movie.title || movie.name,
                    page: 1
                });
            });

            render.find('.full-start__buttons').append(button);
        }

        // Подписываемся на события карточки фильма
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'complite') {
                addSourceButton({
                    render: e.object.activity.render(),
                    movie: e.data.movie
                });
            }
        });

        // 2. Интеграция в системный поиск источников (Search API Lampa)
        Lampa.Search.addSource({
            title: 'Мир Кино',
            search: function (object, callback) {
                searchMedia(object.query, function (items) {
                    var results = items.map(function (item) {
                        return {
                            title: item.Name,
                            release_date: item.ProductionYear || '',
                            url: CONFIG.host + '/Videos/' + item.Id + '/stream.m3u8?static=true&api_key=' + authData.token
                        };
                    });
                    callback([{ title: 'Мир Кино', results: results }]);
                });
            },
            onSelect: function (object, resolve) {
                resolve();
                Lampa.Player.play({
                    title: object.element.title,
                    url: object.element.url
                });
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
