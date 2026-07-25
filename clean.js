(function () {
  'use strict';

  Lampa.Platform.tv();
  (function () {
    "use strict";

    var MIR_KINO_CONFIG = {
      host: 'https://ru.mir-kino.pp.ru',
      apiKey: '411d231778854557b3e5c45da78ec5e8',
      userId: '29cc619b39014b1aa477d4f90eda9f0d'
    };

    function mkExtractYear(movie) {
      if (movie.year) return parseInt(movie.year, 10);
      var dateStr = movie.release_date || movie.first_air_date || '';
      if (dateStr && dateStr.length >= 4) {
        var parsed = parseInt(dateStr.substring(0, 4), 10);
        if (!isNaN(parsed)) return parsed;
      }
      return null;
    }

    function mkSearchMedia(query, callback) {
      var cleanQuery = query.trim();
      var url = MIR_KINO_CONFIG.host + '/Users/' + MIR_KINO_CONFIG.userId + '/Items?SearchTerm=' + encodeURIComponent(cleanQuery) + '&Recursive=true&IncludeItemTypes=Movie,Series,Episode&Fields=MediaSources,Path,ProductionYear&api_key=' + MIR_KINO_CONFIG.apiKey;

      $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
          var results = (data && data.Items) ? data.Items : [];
          callback(results);
        },
        error: function () {
          callback([]);
        }
      });
    }

    function mkSmartSearch(movie, callback) {
      var titleRu = movie.title || movie.name || '';
      var titleEn = movie.original_title || movie.original_name || '';

      mkSearchMedia(titleRu, function (items) {
        if (items && items.length) return callback(items);

        if (titleEn && titleEn !== titleRu) {
          mkSearchMedia(titleEn, function (itemsEn) {
            if (itemsEn && itemsEn.length) return callback(itemsEn);

            var firstWord = titleRu.split(' ')[0];
            mkSearchMedia(firstWord, callback);
          });
        } else {
          var firstWord = titleRu.split(' ')[0];
          mkSearchMedia(firstWord, callback);
        }
      });
    }

    function mkBuildStreamUrl(item) {
      var mediaSourceId = (item.MediaSources && item.MediaSources[0]) ? item.MediaSources[0].Id : item.Id;
      var container = (item.MediaSources && item.MediaSources[0] && item.MediaSources[0].Container) ? item.MediaSources[0].Container : 'mkv';
      return MIR_KINO_CONFIG.host + '/Videos/' + item.Id + '/stream.' + container + '?static=true&mediaSourceId=' + mediaSourceId + '&api_key=' + MIR_KINO_CONFIG.apiKey;
    }

    var _0x348cec = "https://ab2024.ru",
      _0x55d122 = {
        "api": "lampac",
        "localhost": _0x348cec + "/",
        "apn": ""
      },
      _0x4155ab,
      _0x585067 = Lampa.Storage.get("lampac_unic_id", "");
    !_0x585067 && (_0x585067 = Lampa.Utils.uid(8).toLowerCase(), Lampa.Storage.set("lampac_unic_id", _0x585067));

    function _0x14ef12() {
      if (Lampa.Platform.is("android")) try {
        var _0x26656e = AndroidJS.appVersion().split("-");
        return parseInt(_0x26656e.pop());
      } catch (_0x2998d6) {
        return 0;
      } else return 0;
    }

    var _0x17917c = _0x348cec.replace("http://", "").replace("https://", "");
    if (!window.rch_nws || !window.rch_nws[_0x17917c]) {
      if (!window.rch_nws) window.rch_nws = {};
      window.rch_nws[_0x17917c] = {
        "type": Lampa.Platform.is("android") ? "apk" : Lampa.Platform.is("tizen") ? "cors" : undefined,
        "startTypeInvoke": false,
        "rchRegistry": false,
        "apkVersion": _0x14ef12()
      };
    }

    window.rch_nws[_0x17917c].typeInvoke = function _0x481341(_0x4bb707, _0x28c2d2) {
      if (!window.rch_nws[_0x17917c].startTypeInvoke) {
        window.rch_nws[_0x17917c].startTypeInvoke = true;
        var _0x1da95e = function _0x567392(_0x205fb9) {
          window.rch_nws[_0x17917c].type = Lampa.Platform.is("android") ? "apk" : _0x205fb9 ? "cors" : "web", _0x28c2d2();
        };
        if (Lampa.Platform.is("android") || Lampa.Platform.is("tizen")) _0x1da95e(true); else {
          var _0x563b1a = new Lampa.Reguest();
          _0x563b1a.silent(_0x348cec.indexOf(location.host) >= 0 ? "https://github.com/" : _0x4bb707 + "/cors/check", function () {
            _0x1da95e(true);
          }, function () {
            _0x1da95e(false);
          }, false, {
            "dataType": "text"
          });
        }
      } else _0x28c2d2();
    };

    window.rch_nws[_0x17917c].Registry = function _0x9bb873(_0x328fe6, _0x2482ed) {
      window.rch_nws[_0x17917c].typeInvoke(_0x348cec, function () {
        _0x328fe6.invoke("RchRegistry", {
          "host": location.host,
          "rchtype": Lampa.Platform.is("android") ? "apk" : Lampa.Platform.is("tizen") ? "cors" : window.rch_nws[_0x17917c].type || "web",
          "apkVersion": Lampa.Platform.is("android") ? window.rch_nws[_0x17917c].apkVersion || 0 : 0,
          "player": Lampa.Storage.field("player")
        });
        if (window.rch_nws[_0x17917c].rchRegistry) return;
        window.rch_nws[_0x17917c].rchRegistry = true;
        var _0x39678f = false;
        _0x328fe6.on("RchRegistry", function (_0x309a73, _0x2b3465, _0x5391b6) {
          _0x2482ed && !_0x39678f && (_0x39678f = true, _0x2482ed());
        });
        _0x328fe6.on("RchClient", function (_0x41023c, _0x39993c, _0x5f360c, _0x2d42c7, _0x1b6468) {
          var _0x4c0463 = new Lampa.Reguest();

          function _0x10d6a6(_0x2c6c79, _0x4213bb) {
            $.ajax({
              "url": _0x348cec + "/rch/" + _0x2c6c79 + "?id=" + _0x41023c,
              "type": "POST",
              "data": _0x4213bb,
              "async": true,
              "cache": false,
              "contentType": false,
              "processData": false,
              "success": function (_0x36d01e) {},
              "error": function () {
                _0x328fe6.invoke("RchResult", _0x41023c, "");
              }
            });
          }

          function _0x30bcaf(_0x501f9e) {
            (Lampa.Arrays.isObject(_0x501f9e) || Lampa.Arrays.isArray(_0x501f9e)) && (_0x501f9e = JSON.stringify(_0x501f9e));
            if (typeof CompressionStream !== "undefined" && _0x501f9e && _0x501f9e.length > 1000) {
              var _0x17cebd = new CompressionStream("gzip"),
                _0x209f1a = new TextEncoder(),
                _0x118191 = new ReadableStream({
                  "start": function (_0x1bd0ee) {
                    _0x1bd0ee.enqueue(_0x209f1a.encode(_0x501f9e)), _0x1bd0ee.close();
                  }
                }),
                _0x22d760 = _0x118191.pipeThrough(_0x17cebd);
              new Response(_0x22d760).arrayBuffer().then(function (_0x15d45d) {
                var _0x570895 = new Uint8Array(_0x15d45d);
                _0x570895.length > _0x501f9e.length ? _0x10d6a6("result", _0x501f9e) : _0x10d6a6("gzresult", _0x570895);
              })["catch"](function () {
                _0x10d6a6("result", _0x501f9e);
              });
            } else _0x10d6a6("result", _0x501f9e);
          }

          if (_0x39993c == "eval") console.log("RCH", _0x39993c, _0x5f360c), _0x30bcaf(eval(_0x5f360c)); else {
            if (_0x39993c == "evalrun") console.log("RCH", _0x39993c, _0x5f360c), eval(_0x5f360c); else _0x39993c == "ping" ? _0x30bcaf("pong") : (console.log("RCH", _0x39993c), _0x4c0463.native(_0x39993c, _0x30bcaf, function (_0x9c432d) {
              console.log("RCH", "result empty, " + _0x9c432d.status), _0x30bcaf("");
            }, _0x5f360c, {
              "dataType": "text",
              "timeout": 1000 * 8,
              "headers": _0x2d42c7,
              "returnHeaders": _0x1b6468
            }));
          }
        });
        _0x328fe6.on("Connected", function (_0x554eeb) {
          console.log("RCH", "ConnectionId: " + _0x554eeb), window.rch_nws[_0x17917c].connectionId = _0x554eeb;
        });
        _0x328fe6.on("Closed", function () {
          console.log("RCH", "Connection closed");
        });
        _0x328fe6.on("Error", function (_0x463ad1) {
          console.log("RCH", "error:", _0x463ad1);
        });
      });
    };

    window.rch_nws[_0x17917c].typeInvoke(_0x348cec, function () {});

    function _0x5b9bf0(_0x57f620, _0x527cb2) {
      if (!window.nwsClient) window.nwsClient = {};
      var _0x179cc8 = window.nwsClient[_0x17917c];
      if (_0x179cc8 && _0x179cc8.connectionId != null) _0x527cb2(); else _0x179cc8 ? (console.log("RCH", "Reconnecting..."), _0x179cc8.reconnect(function () {
        _0x527cb2();
      })) : (window.nwsClient[_0x17917c] = new NativeWsClient(_0x57f620.nws, {
        "autoReconnect": true
      }), window.nwsClient[_0x17917c].on("Connected", function () {
        window.rch_nws[_0x17917c].Registry(window.nwsClient[_0x17917c], function () {
          _0x527cb2();
        });
      }), window.nwsClient[_0x17917c].connect());
    }

    function _0x204321(_0x4a0387, _0x36d15b) {
      typeof NativeWsClient == "undefined" ? Lampa.Utils.putScript([_0x348cec + "/js/nws-client-es5.js?v21042026"], function () {}, false, function () {
        _0x5b9bf0(_0x4a0387, _0x36d15b);
      }, true) : _0x5b9bf0(_0x4a0387, _0x36d15b);
    }

    function _0x251c58(_0xaaff0d) {
      _0xaaff0d = _0xaaff0d + "";
      if (_0xaaff0d.indexOf("account_email=") == -1) {
        var _0x1264c3 = Lampa.Storage.get("account_email");
        if (_0x1264c3) _0xaaff0d = Lampa.Utils.addUrlComponent(_0xaaff0d, "account_email=" + encodeURIComponent(_0x1264c3));
      }
      if (_0xaaff0d.indexOf("uid=") == -1) {
        var _0xe260ef = Lampa.Storage.get("lampac_unic_id", "");
        if (_0xe260ef) _0xaaff0d = Lampa.Utils.addUrlComponent(_0xaaff0d, "uid=" + encodeURIComponent(_0xe260ef));
      }
      if (_0xaaff0d.indexOf("token=") == -1) {
        var _0x52c679 = "";
        if (_0x52c679 != "") _0xaaff0d = Lampa.Utils.addUrlComponent(_0xaaff0d, "token=");
      }
      if (_0xaaff0d.indexOf("nws_id=") == -1) {
        var _0x2448d5 = Lampa.Storage.get("lampac_nws_id", "");
        if (_0x2448d5) _0xaaff0d = Lampa.Utils.addUrlComponent(_0xaaff0d, "nws_id=" + encodeURIComponent(_0x2448d5));
      }
      return _0xaaff0d;
    }

    function _0x5b044d() {
      var _0x178dda = Lampa.Storage.get("kit_aesgcmkey", "");
      if (_0x178dda) return {
        "X-Kit-AesGcm": Lampa.Storage.get("kit_aesgcmkey", "")
      };
      return {};
    }

    function _0x5b38c2(_0x152436) {
      return (_0x152436 < 10 ? "0" : "") + _0x152436;
    }

    var _0x5eedae = Lampa.Reguest;

    function _0x4cd5d3(_0x1140bc) {
      var _0x3c7a6b = new _0x5eedae(),
        _0x256cfd = new Lampa.Scroll({
          "mask": true,
          "over": true
        }),
        _0x90b156 = new Lampa.Explorer(_0x1140bc),
        _0x17b61f = new Lampa.Filter(_0x1140bc),
        _0x4bfca2 = {},
        _0x42f0ab,
        _0x1929d0,
        _0x4c45f6 = 'mirkino',
        _0x1f70e9,
        _0x32b57b,
        _0x3706f7 = [],
        _0x95222e = 0,
        _0x38bdfc,
        _0x1b2f9f = 0,
        _0x3440ea,
        _0x4ae3ee = ['mirkino'],
        _0x29f83b = {
          "season": Lampa.Lang.translate("torrent_serial_season"),
          "voice": Lampa.Lang.translate("torrent_parser_voice"),
          "source": Lampa.Lang.translate("settings_rest_source")
        },
        _0x4047f4 = {
          "season": [],
          "voice": []
        };

      _0x4155ab == undefined && (_0x3c7a6b.timeout(10000), _0x3c7a6b.silent(_0x251c58(_0x348cec + "/lite/withsearch"), function (_0x27e9b7) {
        _0x4155ab = _0x27e9b7;
      }, function () {
        _0x4155ab = [];
      }));

      function _0x32e739(_0x583b5a) {
        var _0x1fd57f = Lampa.Utils.hash(_0x1140bc.movie.number_of_seasons ? _0x1140bc.movie.original_name : _0x1140bc.movie.original_title),
          _0x51d36a = Lampa.Storage.get("clarification_search", "{}");
        _0x51d36a[_0x1fd57f] = _0x583b5a, Lampa.Storage.set("clarification_search", _0x51d36a);
      }

      function _0x23b5f4() {
        var _0x1c3e55 = Lampa.Utils.hash(_0x1140bc.movie.number_of_seasons ? _0x1140bc.movie.original_name : _0x1140bc.movie.original_title),
          _0x58fd40 = Lampa.Storage.get("clarification_search", "{}");
        delete _0x58fd40[_0x1c3e55], Lampa.Storage.set("clarification_search", _0x58fd40);
      }

      this.initialize = function () {
        var _0x3e0c45 = this;
        this.loading(true);
        _0x17b61f.onSearch = function (_0x2cd898) {
          _0x32e739(_0x2cd898);
          Lampa.Activity.replace({
            "search": _0x2cd898,
            "clarification": true,
            "similar": true
          });
        };
        _0x17b61f.onBack = function () {
          _0x3e0c45.start();
        };
        _0x17b61f.render().find(".selector").on("hover:enter", function () {
          clearInterval(_0x32b57b);
        });
        _0x17b61f.render().find(".filter--search").appendTo(_0x17b61f.render().find(".torrent-filter"));
        _0x17b61f.onSelect = function (_0x564258, _0x79b6b9, _0x4a0e07) {
          if (_0x564258 == "filter") {
            if (_0x79b6b9.reset) {
              _0x23b5f4();
              _0x3e0c45.replaceChoice({
                "season": 0,
                "voice": 0,
                "voice_url": "",
                "voice_name": ""
              });
              setTimeout(function () {
                Lampa.Select.close();
                Lampa.Activity.replace({
                  "clarification": 0,
                  "similar": 0
                });
              }, 10);
            }
          }
        };

        if (_0x17b61f.addButtonBack) _0x17b61f.addButtonBack();
        _0x17b61f.render().find(".filter--sort span").text(Lampa.Lang.translate("lampac_balanser"));
        _0x256cfd.body().addClass("torrent-list");
        _0x90b156.appendFiles(_0x256cfd.render());
        _0x90b156.appendHead(_0x17b61f.render());
        _0x256cfd.minus(_0x90b156.render().find(".explorer__files-head"));
        _0x256cfd.body().append(Lampa.Template.get("lampac_content_loading"));
        Lampa.Controller.enable("content");
        this.loading(false);

        _0x4bfca2 = {
          'mirkino': { "url": "mirkino_local", "name": "Мир Кино ~ 4K / 5.1", "show": true }
        };
        _0x4c45f6 = 'mirkino';
        _0x4ae3ee = ['mirkino'];

        return this.findMirKino();
      };

      this.rch = function (_0x5923b6, _0xf9815d) {
        var _0x26489a = this;
        _0x204321(_0x5923b6, function () {
          if (!_0xf9815d) _0x26489a.find(); else _0xf9815d();
        });
      };

      this.externalids = function () {
        return Promise.resolve();
      };

      this.updateBalanser = function (_0x3c5662) {
        var _0x5c2e34 = Lampa.Storage.cache("online_last_balanser", 3000, {});
        _0x5c2e34[_0x1140bc.movie.id] = 'mirkino';
        Lampa.Storage.set("online_last_balanser", _0x5c2e34);
      };

      this.changeBalanser = function (_0x304414) {
        this.findMirKino();
      };

      this.requestParams = function (_0x249958) {
        return _0x249958;
      };

      this.getLastChoiceBalanser = function () {
        return 'mirkino';
      };

      this.startSource = function (_0x5c5db0) {
        return Promise.resolve(_0x5c5db0);
      };

      this.lifeSource = function () {
        return Promise.resolve([{ show: true, name: "mirkino" }]);
      };

      this.createSource = function () {
        return Promise.resolve();
      };

      this.create = function () {
        return this.render();
      };

      this.search = function () {
        this.findMirKino();
      };

      this.findMirKino = function () {
        var _0x1d6940 = this;
        _0x1d6940.activity.loader(true);

        mkSmartSearch(_0x1140bc.movie, function (items) {
          _0x1d6940.activity.loader(false);

          if (!items || !items.length) {
            return _0x1d6940.empty();
          }

          var targetYear = mkExtractYear(_0x1140bc.movie);
          if (targetYear && items.length > 1) {
            items.sort(function (a, b) {
              var diffA = a.ProductionYear ? Math.abs(a.ProductionYear - targetYear) : 999;
              var diffB = b.ProductionYear ? Math.abs(b.ProductionYear - targetYear) : 999;
              return diffA - diffB;
            });
          }

          // Оставляем только ЕДИНСТВЕННЫЙ лучший элемент
          var bestItem = items[0];

          var fileName = bestItem.Name;
          if (bestItem.MediaSources && bestItem.MediaSources[0] && bestItem.MediaSources[0].Path) {
            var path = bestItem.MediaSources[0].Path;
            var extracted = path.split('\\').pop().split('/').pop();
            if (extracted) fileName = extracted;
          }

          var streamUrl = mkBuildStreamUrl(bestItem);
          var qMap = {};
          qMap["4K 5.1"] = streamUrl;

          var singleResult = [{
            method: 'play',
            title: fileName,
            text: fileName,
            url: streamUrl,
            qualitys: qMap,
            voice_name: "Мир Кино"
          }];

          _0x1d6940.display(singleResult);
        });
      };

      this.find = function () {
        this.findMirKino();
      };

      this.request = function (_0x2a81a4) {
        this.findMirKino();
      };

      this.parseJsonDate = function () {
        return [];
      };

      this.getFileUrl = function (_0x4e8f31, _0x420144) {
        return _0x420144(_0x4e8f31, {});
      };

      this.toPlayElement = function (_0x1aaeab) {
        return {
          "title": _0x1aaeab.title,
          "url": _0x1aaeab.url,
          "quality": _0x1aaeab.qualitys,
          "timeline": _0x1aaeab.timeline,
          "subtitles": _0x1aaeab.subtitles,
          "segments": _0x1aaeab.segments,
          "callback": _0x1aaeab.mark,
          "season": _0x1aaeab.season,
          "episode": _0x1aaeab.episode,
          "voice_name": _0x1aaeab.voice_name,
          "thumbnail": _0x1aaeab.thumbnail
        };
      };

      this.orUrlReserve = function () {};

      this.setDefaultQuality = function () {};

      this.display = function (_0x5792cb) {
        var _0x1d6940 = this;
        this.draw(_0x5792cb, {
          "onEnter": function _0x46a7f5(_0x399b01) {
            _0x1d6940.getFileUrl(_0x399b01, function (_0x4c30dc, _0x2c7c13) {
              if (_0x4c30dc && _0x4c30dc.url) {
                var _0x2c15bd = _0x1d6940.toPlayElement(_0x399b01);
                _0x2c15bd.url = _0x4c30dc.url;
                _0x2c15bd.quality = _0x399b01.qualitys;
                _0x2c15bd.isonline = true;

                Lampa.Player.play(_0x2c15bd);
                Lampa.Player.playlist([_0x2c15bd]);
                _0x399b01.mark();
              } else {
                Lampa.Noty.show(Lampa.Lang.translate("lampac_nolink"));
              }
            }, true);
          },
          "onContextMenu": function _0x170bf6(_0x5e690a, _0x3cd0cc, _0x3204c2, _0x508fc2) {
            _0x508fc2({
              "file": _0x5e690a.url,
              "quality": _0x5e690a.qualitys
            });
          }
        });
      };

      this.loadSubtitles = function () {};

      this.parse = function () {};

      this.similars = function () {};

      this.getChoice = function () {
        return {
          "season": 0,
          "voice": 0,
          "voice_name": "Мир Кино",
          "voice_id": 0,
          "episodes_view": {},
          "movie_view": ""
        };
      };

      this.saveChoice = function () {};

      this.replaceChoice = function () {};

      this.clearImages = function () {
        _0x3706f7.forEach(function (_0x4c4260) {
          _0x4c4260.onerror = function () {};
          _0x4c4260.onload = function () {};
          _0x4c4260.src = "";
        });
        _0x3706f7 = [];
      };

      this.reset = function () {
        _0x42f0ab = false;
        clearInterval(_0x32b57b);
        _0x3c7a6b.clear();
        this.clearImages();
        _0x256cfd.render().find(".empty").remove();
        _0x256cfd.clear();
        _0x256cfd.reset();
        _0x256cfd.body().append(Lampa.Template.get("lampac_content_loading"));
      };

      this.loading = function (_0x47e6fa) {
        if (_0x47e6fa) this.activity.loader(true); else this.activity.loader(false), this.activity.toggle();
      };

      this.filter = function () {
        _0x17b61f.set("sort", [{
          "title": "Мир Кино ~ 4K / 5.1",
          "source": "mirkino",
          "selected": true,
          "ghost": false
        }]);
        _0x17b61f.chosen("sort", ["Мир Кино ~ 4K / 5.1"]);
      };

      this.selected = function () {
        _0x17b61f.chosen("sort", ["Мир Кино ~ 4K / 5.1"]);
      };

      this.getEpisodes = function (_0x4a25d4, _0x15c15a) {
        _0x15c15a([]);
      };

      this.watched = function (_0x1e0eea) {
        var _0x134c81 = Lampa.Utils.hash(_0x1140bc.movie.number_of_seasons ? _0x1140bc.movie.original_name : _0x1140bc.movie.original_title),
          _0x2afbdc = Lampa.Storage.cache("online_watched_last", 5000, {});
        if (_0x1e0eea) {
          if (!_0x2afbdc[_0x134c81]) _0x2afbdc[_0x134c81] = {};
          Lampa.Arrays.extend(_0x2afbdc[_0x134c81], _0x1e0eea, true);
          Lampa.Storage.set("online_watched_last", _0x2afbdc);
          this.updateWatched();
        } else return _0x2afbdc[_0x134c81];
      };

      this.updateWatched = function () {
        var _0xa135db = this.watched(),
          _0x444cfa = _0x256cfd.body().find(".online-prestige-watched .online-prestige-watched__body").empty();
        if (_0xa135db) {
          _0x444cfa.append("<span>Мир Кино</span>");
        } else _0x444cfa.append("<span>" + Lampa.Lang.translate("lampac_no_watch_history") + "</span>");
      };

      this.draw = function (_0x589b28) {
        var _0xeb9e1d = this,
          _0x5536ce = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        if (!_0x589b28.length) return this.empty();
        _0x256cfd.clear();
        this.updateWatched();

        _0x589b28.forEach(function (_0x311c64) {
          _0x311c64.info = "<span>Мир Кино</span><span class=\"online-prestige-split\">●</span><span>4K / 5.1</span>";
          var _0x2f70ed = Lampa.Template.get("lampac_prestige_full", _0x311c64),
            _0x108c67 = _0x2f70ed.find(".online-prestige__loader"),
            _0x16e426 = _0x2f70ed.find(".online-prestige__img");

          _0x16e426.hide();
          _0x108c67.remove();

          _0x2f70ed.on("hover:enter", function () {
            if (_0x1140bc.movie.id) Lampa.Favorite.add("history", _0x1140bc.movie, 100);
            if (_0x5536ce.onEnter) _0x5536ce.onEnter(_0x311c64, _0x2f70ed);
          }).on("hover:focus", function (_0x139cbe) {
            _0x42f0ab = _0x139cbe.target;
            _0x256cfd.update($(_0x139cbe.target), true);
          });

          _0x256cfd.append(_0x2f70ed);
        });

        _0x42f0ab = _0x256cfd.body().find('.selector')[0];
        Lampa.Controller.enable("content");
      };

      this.contextMenu = function () {};

      this.empty = function () {
        var _0x1845af = Lampa.Template.get("lampac_does_not_answer", {});
        _0x1845af.find(".online-empty__buttons").remove();
        _0x1845af.find(".online-empty__title").text(Lampa.Lang.translate("empty_title_two"));
        _0x1845af.find(".online-empty__time").text(Lampa.Lang.translate("empty_text"));
        _0x256cfd.clear();
        _0x256cfd.append(_0x1845af);
        this.loading(false);
      };

      this.noConnectToServer = function () {
        this.empty();
      };

      this.doesNotAnswer = function () {
        this.empty();
      };

      this.getLastEpisode = function () { return 0; };

      this.start = function () {
        if (Lampa.Activity.active().activity !== this.activity) return;
        !_0x1f70e9 && (_0x1f70e9 = true, this.initialize());
        Lampa.Background.immediately(Lampa.Utils.cardImgBackgroundBlur(_0x1140bc.movie));
        Lampa.Controller.add("content", {
          "toggle": function _0x3c4808() {
            Lampa.Controller.collectionSet(_0x256cfd.render(), _0x90b156.render());
            Lampa.Controller.collectionFocus(_0x42f0ab || false, _0x256cfd.render());
          },
          "gone": function _0x3d4731() {
            clearTimeout(_0x32b57b);
          },
          "up": function _0xfac62f() {
            if (Navigator.canmove("up")) Navigator.move("up"); else Lampa.Controller.toggle("head");
          },
          "down": function _0x164108() {
            Navigator.move("down");
          },
          "right": function _0x4e13f8() {
            if (Navigator.canmove("right")) Navigator.move("right"); else _0x17b61f.show(Lampa.Lang.translate("title_filter"), "filter");
          },
          "left": function _0x2c1cc4() {
            if (Navigator.canmove("left")) Navigator.move("left"); else Lampa.Controller.toggle("menu");
          },
          "back": this.back.bind(this)
        });
        Lampa.Controller.toggle("content");
      };

      this.render = function () {
        return _0x90b156.render();
      };

      this.back = function () {
        Lampa.Activity.backward();
      };
      this.pause = function () {};
      this.stop = function () {};
      this.destroy = function () {
        _0x3c7a6b.clear();
        this.clearImages();
        _0x90b156.destroy();
        _0x256cfd.destroy();
        clearInterval(_0x32b57b);
        clearTimeout(_0x3440ea);
      };
    }

    function _0x3763c5() {
      window.lampac_plugin = true;
      var _0x51e5e4 = {
        "type": "video",
        "version": "7.7.7",
        "name": "Cinema",
        "description": "Плагин для просмотра онлайн сериалов и фильмов",
        "component": "cinema_online",
        "onContextMenu": function () {
          return { "name": Lampa.Lang.translate("lampac_watch"), "description": "" };
        },
        "onContextLauch": function (_0x57940d) {
          _0x3cd3c3();
          Lampa.Component.add("cinema_online", _0x4cd5d3);
          Lampa.Activity.push({
            "url": "",
            "title": Lampa.Lang.translate("title_online"),
            "component": "cinema_online",
            "search": _0x57940d.title,
            "movie": _0x57940d,
            "page": 1,
            "clarification": false
          });
        }
      };
      Lampa.Manifest.plugins = _0x51e5e4;

      Lampa.Template.add("lampac_css", "\n        <style>\n        @charset 'UTF-8';.online-prestige{position:relative;-webkit-border-radius:.3em;border-radius:.3em;background-color:rgba(0,0,0,0.3);display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}.online-prestige__body{padding:1.2em;line-height:1.3;-webkit-box-flex:1;-webkit-flex-grow:1;-moz-box-flex:1;-ms-flex-positive:1;flex-grow:1;position:relative}@media screen and (max-width:480px){.online-prestige__body{padding:.8em 1.2em}}.online-prestige__img{position:relative;width:13em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;min-height:8.2em}.online-prestige__img>img{position:absolute;top:0;left:0;width:100%;height:100%;-o-object-fit:cover;object-fit:cover;-webkit-border-radius:.3em;border-radius:.3em;opacity:0;-webkit-transition:opacity .3s;-o-transition:opacity .3s;-moz-transition:opacity .3s;transition:opacity .3s}.online-prestige__img--loaded>img{opacity:1}@media screen and (max-width:480px){.online-prestige__img{width:7em;min-height:6em}}.online-prestige__folder{padding:1em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0}.online-prestige__folder>svg{width:4.4em !important;height:4.4em !important}.online-prestige__viewed{position:absolute;top:1em;left:1em;background:rgba(0,0,0,0.45);-webkit-border-radius:100%;border-radius:100%;padding:.25em;font-size:.76em}.online-prestige__viewed>svg{width:1.5em !important;height:1.5em !important}.online-prestige__episode-number{position:absolute;top:0;left:0;right:0;bottom:0;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;font-size:2em}.online-prestige__loader{position:absolute;top:50%;left:50%;width:2em;height:2em;margin-left:-1em;margin-top:-1em;background:url(./img/loader.svg) no-repeat center center;-webkit-background-size:contain;-o-background-size:contain;background-size:contain}.online-prestige__head,.online-prestige__footer{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-moz-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.online-prestige__timeline{margin:.8em 0}.online-prestige__timeline>.time-line{display:block !important}.online-prestige__title{font-size:1.7em;overflow:hidden;-o-text-overflow:ellipsis;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:1;line-clamp:1;-webkit-box-orient:vertical}@media screen and (max-width:480px){.online-prestige__title{font-size:1.4em}}.online-prestige__time{padding-left:2em}.online-prestige__info{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.online-prestige__info>*{overflow:hidden;-o-text-overflow:ellipsis;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:1;line-clamp:1;-webkit-box-orient:vertical}.online-prestige__quality{padding-left:1em;white-space:nowrap}.online-prestige.focus::after{content:'';position:absolute;top:-0.6em;left:-0.6em;right:-0.6em;bottom:-0.6em;-webkit-border-radius:.7em;border-radius:.7em;border:solid .3em #fff;z-index:-1;pointer-events:none}.online-prestige+.online-prestige{margin-top:1.5em}\n        </style>\n    ");
      $("body").append(Lampa.Template.get("lampac_css", {}, true));

      function _0x3cd3c3() {
        Lampa.Template.add("lampac_prestige_full", "<div class=\"online-prestige online-prestige--full selector\">\n            <div class=\"online-prestige__body\">\n                <div class=\"online-prestige__head\">\n                    <div class=\"online-prestige__title\">{title}</div>\n                    <div class=\"online-prestige__time\">{time}</div>\n                </div>\n                <div class=\"online-prestige__footer\">\n                    <div class=\"online-prestige__info\">{info}</div>\n                    <div class=\"online-prestige__quality\">{quality}</div>\n                </div>\n            </div>\n        </div>");
        Lampa.Template.add("lampac_content_loading", "<div class=\"online-empty\"><div class=\"broadcast__scan\"><div></div></div></div>");
        Lampa.Template.add("lampac_does_not_answer", "<div class=\"online-empty\"><div class=\"online-empty__title\">Ничего не найдено в Мир Кино</div></div>");
      }

      var _0x198427 = "<div class=\"full-start__button selector cinema--online lampac--button\" data-subtitle=\"Мир Кино 4K\">\n        <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"28\" height=\"29\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M11.585.031c-.342.087-.603.22-.94.478c-.354.273-.644.582-1.038 1.11c-.748 1.01-1.475 2.337-2.332 4.265c-.105.236-.198.43-.205.43a10 10 0 0 1-.211-.655c-.442-1.47-.77-2.426-1.095-3.196C5.254 1.25 4.793.638 4.234.43a1.25 1.25 0 0 0-.795.007c-.565.23-.985.838-1.318 1.914c-.522 1.676-.96 4.53-1.472 9.6c-.478 4.69-.675 7.526-.646 9.257c.012.835.045 1.181.15 1.62c.187.792.622 1.206 1.225 1.163c.159-.013.216-.03.392-.134c.173-.102.247-.17.434-.391c.504-.602.976-1.62 1.952-4.22c.364-.967 1.967-5.397 1.967-5.434c0-.026-.703-2.417-.822-2.8l-.04-.123l-.034.076c-.064.143-.72 1.934-1.448 3.952c-1 2.772-1.577 4.32-1.884 5.06l-.097.239l.012-.267c.01-.146.026-.495.038-.773c.086-1.766.33-4.554.703-8.068c.375-3.536.708-5.842 1.043-7.227c.1-.414.26-.959.294-1.004c.024-.027.233.424.404.871c.356.934.636 1.816 1.515 4.774c1.083 3.651 1.627 5.265 2.325 6.901c.61 1.436 1.104 2.305 1.72 3.036c.432.512.84.835 1.294 1.029a2.03 2.03 0 0 0 1.626.017c1.385-.557 2.565-2.553 3.971-6.719c.378-1.122.691-2.122 1.35-4.32c.911-3.045 1.313-4.251 1.7-5.128a7 7 0 0 1 .211-.447l.057-.098l.038.11c.33.916.663 2.636.971 5.02c.333 2.552.81 7.354.988 9.89c.057.818.12 1.976.117 2.192v.155l-.074-.169c-.235-.534-.779-1.999-1.9-5.102c-.869-2.404-1.484-4.076-1.515-4.113c-.011-.013-.029.014-.043.057c-.574 1.9-.836 2.777-.836 2.81c0 .04.976 2.756 1.686 4.69c.606 1.647 1.152 3.041 1.416 3.618c.349.764.605 1.206.888 1.543c.164.194.242.264.413.365c.376.213.704.16.97.007c.84-.495.985-1.903.66-6.39c-.164-2.229-.523-5.94-.834-8.602c-.494-4.228-1.017-6.645-1.66-7.671c-.254-.408-.601-.7-.938-.793a1.44 1.44 0 0 0-.668.017c-.876.298-1.548 1.546-2.557 4.75c-.136.434-.262.836-.276.892c-.016.059-.038.107-.045.107c-.01 0-.073-.13-.145-.29C15.516 3.2 14.494 1.523 13.542.677c-.278-.247-.729-.52-.995-.604c-.245-.076-.739-.098-.962-.04zm.682 2.15c.726.38 1.918 2.452 3.322 5.778l.44 1.04l-.345 1.099c-.639 2.046-1.05 3.227-1.534 4.382c-.672 1.605-1.316 2.657-1.812 2.958a.73.73 0 0 1-.615.042c-.798-.335-1.798-2.198-2.881-5.375a77 77 0 0 1-.805-2.51l-.135-.442l.346-.837c1.344-3.239 2.541-5.417 3.297-6.008c.273-.213.484-.25.722-.126Z\"/></svg>\n        <span>Онлайн</span>\n    </div>";

      Lampa.Component.add("cinema_online", _0x4cd5d3);
      _0x3cd3c3();

      function _0x5afe35(_0x3f7cfd) {
        if (_0x3f7cfd.render.find(".lampac--button").length) return;
        var _0x33dd67 = $(_0x198427);
        _0x33dd67.on("hover:enter", function () {
          _0x3cd3c3();
          Lampa.Component.add("cinema_online", _0x4cd5d3);
          Lampa.Activity.push({
            "url": "",
            "title": Lampa.Lang.translate("title_online"),
            "component": "cinema_online",
            "search": _0x3f7cfd.movie.title,
            "movie": _0x3f7cfd.movie,
            "page": 1,
            "clarification": false
          });
        });
        _0x3f7cfd.render.after(_0x33dd67);
      }

      Lampa.Listener.follow("full", function (_0x3895f5) {
        _0x3895f5.type == "complite" && _0x5afe35({
          "render": _0x3895f5.object.activity.render().find(".view--torrent"),
          "movie": _0x3895f5.data.movie
        });
      });

      try {
        Lampa.Activity.active().component == "full" && _0x5afe35({
          "render": Lampa.Activity.active().activity.render().find(".view--torrent"),
          "movie": Lampa.Activity.active().card
        });
      } catch (_0x4850f1) {}
    }

    if (!window.lampac_plugin) _0x3763c5();
  })();
})();
