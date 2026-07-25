(function () {
    'use strict';

    Lampa.Platform.tv();

    const CONFIG = {
        host: 'https://ru.mir-kino.pp.ru',
        apiKey: '411d231778854557b3e5c45da78ec5e8',
        userId: '29cc619b39014b1aa477d4f90eda9f0d'
    };

    function searchMedia(query, callback) {
        const cleanQuery = query.trim();
        const url = `${CONFIG.host}/Users/${CONFIG.userId}/Items?SearchTerm=${encodeURIComponent(cleanQuery)}&Recursive=true&IncludeItemTypes=Movie,Series,Episode&Fields=MediaSources,Path&api_key=${CONFIG.apiKey}`;

        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                const results = (data && data.Items) ? data.Items : [];
                callback(results);
            },
            error: function () {
                callback([]);
            }
        });
    }

    function smartSearch(movie, callback) {
        const titleRu = movie.title || movie.name || '';
        const titleEn = movie.original_title || movie.original_name || '';

        searchMedia(titleRu, function (items) {
            if (items && items.length) return callback(items);

            if (titleEn && titleEn !== titleRu) {
                searchMedia(titleEn, function (itemsEn) {
                    if (itemsEn && itemsEn.length) return callback(itemsEn);

                    const firstWord = titleRu.split(' ')[0];
                    searchMedia(firstWord, callback);
                });
            } else {
                const firstWord = titleRu.split(' ')[0];
                searchMedia(firstWord, callback);
            }
        });
    }

    function buildStreamUrl(item) {
        const mediaSourceId = (item.MediaSources && item.MediaSources[0]) ? item.MediaSources[0].Id : item.Id;
        const container = (item.MediaSources && item.MediaSources[0] && item.MediaSources[0].Container) ? item.MediaSources[0].Container : 'mkv';
        
        return `${CONFIG.host}/Videos/${item.Id}/stream.${container}?static=true&mediaSourceId=${mediaSourceId}&api_key=${CONFIG.apiKey}`;
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

            // Автоматически берем первый лучший файл из результатов
            const targetItem = items[0];
            let name = targetItem.Name;

            if (targetItem.MediaSources && targetItem.MediaSources[0] && targetItem.MediaSources[0].Path) {
                const path = targetItem.MediaSources[0].Path;
                const fileName = path.split('\\').pop().split('/').pop();
                if (fileName) name = fileName;
            }

            const streamData = {
                title: name,
                url: buildStreamUrl(targetItem)
            };

            // Запуск сразу без показа диалоговых окон
            Lampa.Player.play(streamData);
        });
    }

    function startPlugin() {
        if (window.jellyfin_mirkino_auto_v12) return;
        window.jellyfin_mirkino_auto_v12 = true;

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
