(function () {
  'use strict';

  Lampa.Platform.tv();
  (function () {
    "use strict";

    // --- КОНФИГУРАЦИЯ МИР КИНО (ES5) ---
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
        _0x4c45f6,
        _0x1f70e9,
        _0x32b57b,
        _0x3706f7 = [],
        _0x95222e = 0,
        _0x38bdfc,
        _0x1b2f9f = 0,
        _0x3440ea,
        _0x4ae3ee = {},
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

      function _0x1ff58a(_0x3c1549) {
        var _0x598165 = _0x3c1549.balanser,
          _0x5e976a = _0x3c1549.name.split(" ")[0];
        return (_0x598165 || _0x5e976a).toLowerCase();
      }

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
            } else {
              var _0x1fc05a = _0x4047f4[_0x79b6b9.stype][_0x4a0e07.index].url,
                _0x1a83d1 = _0x3e0c45.getChoice();
              if (_0x79b6b9.stype == "voice") {
                _0x1a83d1.voice_name = _0x4047f4.voice[_0x4a0e07.index].title;
                _0x1a83d1.voice_url = _0x1fc05a;
              }
              _0x1a83d1[_0x79b6b9.stype] = _0x4a0e07.index;
              _0x3e0c45.saveChoice(_0x1a83d1);
              _0x3e0c45.reset();
              _0x3e0c45.request(_0x1fc05a);
              setTimeout(Lampa.Select.close, 10);
            }
          } else if (_0x564258 == "sort") {
            Lampa.Select.close();
            _0x1140bc.lampac_custom_select = _0x79b6b9.source;
            _0x3e0c45.changeBalanser(_0x79b6b9.source);
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

        if (_0x1140bc.balanser) {
          _0x90b156.render().find(".filter--search").remove();
          _0x4bfca2 = {};
          _0x4bfca2[_0x1140bc.balanser] = {
            "name": _0x1140bc.balanser
          };
          _0x4c45f6 = _0x1140bc.balanser;
          _0x4ae3ee = [];
          if (_0x4c45f6 === "mirkino") {
            return this.findMirKino();
          }
          return _0x3c7a6b.native(_0x251c58(_0x1140bc.url.replace("rjson=", "nojson=")), this.parse.bind(this), function () {
            _0x90b156.render().find(".torrent-filter").remove();
            _0x3e0c45.empty();
          }, false, {
            "dataType": "text",
            "headers": _0x5b044d()
          });
        }

        this.externalids().then(function () {
          return _0x3e0c45.createSource();
        }).then(function () {
          if (_0x4155ab && _0x4155ab.find) {
            !_0x4155ab.find(function (_0x39c300) {
              return _0x4c45f6.slice(0, _0x39c300.length) == _0x39c300;
            }) && _0x17b61f.render().find(".filter--search").addClass("hide");
          }
          _0x3e0c45.search();
        })["catch"](function (_0x3f33e0) {
          _0x3e0c45.noConnectToServer(_0x3f33e0);
        });
      };

      this.rch = function (_0x5923b6, _0xf9815d) {
        var _0x26489a = this;
        _0x204321(_0x5923b6, function () {
          if (!_0xf9815d) _0x26489a.find(); else _0xf9815d();
        });
      };

      this.externalids = function () {
        return new Promise(function (_0x49df3e) {
          if (!_0x1140bc.movie.imdb_id || !_0x1140bc.movie.kinopoisk_id) {
            var _0x247af8 = [];
            _0x247af8.push("id=" + encodeURIComponent(_0x1140bc.movie.id));
            _0x247af8.push("serial=" + (_0x1140bc.movie.name ? 1 : 0));
            if (_0x1140bc.movie.imdb_id) _0x247af8.push("imdb_id=" + (_0x1140bc.movie.imdb_id || ""));
            if (_0x1140bc.movie.kinopoisk_id) _0x247af8.push("kinopoisk_id=" + (_0x1140bc.movie.kinopoisk_id || ""));
            var _0x444e98 = _0x55d122.localhost + "externalids?" + _0x247af8.join("&");
            _0x3c7a6b.timeout(10000);
            _0x3c7a6b.silent(_0x251c58(_0x444e98), function (_0x4f39c6) {
              for (var _0x258335 in _0x4f39c6) {
                _0x1140bc.movie[_0x258335] = _0x4f39c6[_0x258335];
              }
              _0x49df3e();
            }, function () {
              _0x49df3e();
            }, false, {
              "headers": _0x5b044d()
            });
          } else _0x49df3e();
        });
      };

      this.updateBalanser = function (_0x3c5662) {
        var _0x5c2e34 = Lampa.Storage.cache("online_last_balanser", 3000, {});
        _0x5c2e34[_0x1140bc.movie.id] = _0x3c5662;
        Lampa.Storage.set("online_last_balanser", _0x5c2e34);
      };

      this.changeBalanser = function (_0x304414) {
        this.updateBalanser(_0x304414);
        Lampa.Storage.set("online_balanser", _0x304414);
        var _0x10f190 = this.getChoice(_0x304414),
          _0x4e29f2 = this.getChoice();
        if (_0x4e29f2.voice_name) _0x10f190.voice_name = _0x4e29f2.voice_name;
        this.saveChoice(_0x10f190, _0x304414);
        Lampa.Activity.replace();
      };

      this.requestParams = function (_0x249958) {
        var _0x12e2e8 = [],
          _0x2093d7 = _0x1140bc.movie.source || "tmdb";
        _0x12e2e8.push("id=" + encodeURIComponent(_0x1140bc.movie.id));
        if (_0x1140bc.movie.imdb_id) _0x12e2e8.push("imdb_id=" + (_0x1140bc.movie.imdb_id || ""));
        if (_0x1140bc.movie.kinopoisk_id) _0x12e2e8.push("kinopoisk_id=" + (_0x1140bc.movie.kinopoisk_id || ""));
        if (_0x1140bc.movie.tmdb_id) _0x12e2e8.push("tmdb_id=" + (_0x1140bc.movie.tmdb_id || ""));
        if (_0x1140bc.movie.keywords && _0x1140bc.movie.keywords.results) {
          for (var _0xc5047c = 0, _0x2e460a = _0x1140bc.movie.keywords.results; _0xc5047c < _0x2e460a.length; _0xc5047c++) {
            if (_0x2e460a[_0xc5047c].name == "anime") {
              _0x12e2e8.push("anime=1");
              break;
            }
          }
        }
        _0x12e2e8.push("title=" + encodeURIComponent(_0x1140bc.clarification ? _0x1140bc.search : _0x1140bc.movie.title || _0x1140bc.movie.name));
        _0x12e2e8.push("original_title=" + encodeURIComponent(_0x1140bc.movie.original_title || _0x1140bc.movie.original_name));
        _0x12e2e8.push("serial=" + (_0x1140bc.movie.name ? 1 : 0));
        _0x12e2e8.push("original_language=" + (_0x1140bc.movie.original_language || ""));
        _0x12e2e8.push("year=" + ((_0x1140bc.movie.release_date || _0x1140bc.movie.first_air_date || "0000") + "").slice(0, 4));
        _0x12e2e8.push("source=" + _0x2093d7);
        _0x12e2e8.push("clarification=" + (_0x1140bc.clarification ? 1 : 0));
        _0x12e2e8.push("similar=" + (_0x1140bc.similar ? true : false));
        _0x12e2e8.push("rchtype=" + ((window.rch_nws && window.rch_nws[_0x17917c] ? window.rch_nws[_0x17917c].type : window.rch && window.rch[_0x17917c] ? window.rch[_0x17917c].type : "") || ""));
        if (Lampa.Storage.get("account_email", "")) _0x12e2e8.push("cub_id=" + Lampa.Utils.hash(Lampa.Storage.get("account_email", "")));
        return _0x249958 + (_0x249958.indexOf("?") >= 0 ? "&" : "?") + _0x12e2e8.join("&");
      };

      this.getLastChoiceBalanser = function () {
        var _0x4068b1 = Lampa.Storage.cache("online_last_balanser", 3000, {});
        return _0x4068b1[_0x1140bc.movie.id] ? _0x4068b1[_0x1140bc.movie.id] : Lampa.Storage.get("online_balanser", _0x4ae3ee.length ? _0x4ae3ee[0] : "");
      };

      this.startSource = function (_0x5c5db0) {
        return new Promise(function (_0x56a326, _0x35f966) {
          _0x4bfca2 = {};
          _0x4bfca2['mirkino'] = {
            "url": "mirkino_local",
            "name": "Мир Кино ~ 4K / 5.1",
            "show": true
          };

          if (_0x5c5db0 && _0x5c5db0.forEach) {
            _0x5c5db0.forEach(function (_0x42f4fe) {
              var _0x31f2e8 = _0x1ff58a(_0x42f4fe);
              _0x4bfca2[_0x31f2e8] = {
                "url": _0x42f4fe.url,
                "name": _0x42f4fe.name,
                "show": typeof _0x42f4fe.show == "undefined" ? true : _0x42f4fe.show
              };
            });
          }

          _0x4ae3ee = Lampa.Arrays.getKeys(_0x4bfca2);
          if (_0x4ae3ee.length) {
            var _0x14e8c2 = Lampa.Storage.cache("online_last_balanser", 3000, {});
            _0x14e8c2[_0x1140bc.movie.id] ? _0x4c45f6 = _0x14e8c2[_0x1140bc.movie.id] : _0x4c45f6 = Lampa.Storage.get("online_balanser", _0x4ae3ee[0]);
            if (!_0x4bfca2[_0x4c45f6]) _0x4c45f6 = _0x4ae3ee[0];
            if (!_0x4bfca2[_0x4c45f6].show && !_0x1140bc.lampac_custom_select) _0x4c45f6 = _0x4ae3ee[0];
            _0x1929d0 = _0x4bfca2[_0x4c45f6].url;
            Lampa.Storage.set("active_balanser", _0x4c45f6);
            _0x56a326(_0x5c5db0);
          } else _0x35f966();
        });
      };

      this.lifeSource = function () {
        var _0x1c598a = this;
        return new Promise(function (_0x36de6b, _0x2e3848) {
          var _0x45edec = _0x1c598a.requestParams(_0x55d122.localhost + "lifeevents?memkey=" + (_0x1c598a.memkey || "")),
            _0x3d4ace = false,
            _0x20702a = function _0x30e2b9(_0x15851d, _0x194fb6) {
              if (_0x15851d.accsdb) return _0x2e3848(_0x15851d);
              var _0x4081a7 = _0x1c598a.getLastChoiceBalanser();
              if (!_0x3d4ace) {
                var _0x14b30a = _0x15851d.online.filter(function (_0xab1c41) {
                  return _0x194fb6 ? _0xab1c41.show : _0xab1c41.show && _0xab1c41.name.toLowerCase() == _0x4081a7;
                });
                if (_0x14b30a.length || _0x4081a7 === 'mirkino') {
                  _0x3d4ace = true;
                  _0x36de6b(_0x15851d.online.filter(function (_0x5220c4) { return _0x5220c4.show; }));
                } else _0x194fb6 && _0x2e3848();
              }
            },
            _0x1fba8c = function _0x5f07e2() {
              _0x3c7a6b.timeout(3000);
              _0x3c7a6b.silent(_0x251c58(_0x45edec), function (_0x44ef22) {
                _0x1b2f9f++;
                _0x4ae3ee = [];
                _0x4bfca2 = {};

                _0x4bfca2['mirkino'] = {
                  "url": "mirkino_local",
                  "name": "Мир Кино ~ 4K / 5.1",
                  "show": true
                };

                _0x44ef22.online.forEach(function (_0xff4e96) {
                  var _0x59c54c = _0x1ff58a(_0xff4e96);
                  _0x4bfca2[_0x59c54c] = {
                    "url": _0xff4e96.url,
                    "name": _0xff4e96.name,
                    "show": typeof _0xff4e96.show == "undefined" ? true : _0xff4e96.show
                  };
                });

                _0x4ae3ee = Lampa.Arrays.getKeys(_0x4bfca2);
                _0x17b61f.set("sort", _0x4ae3ee.map(function (_0x47848d) {
                  return {
                    "title": _0x4bfca2[_0x47848d].name,
                    "source": _0x47848d,
                    "selected": _0x47848d == _0x4c45f6,
                    "ghost": !_0x4bfca2[_0x47848d].show
                  };
                }));
                _0x17b61f.chosen("sort", [_0x4bfca2[_0x4c45f6] ? _0x4bfca2[_0x4c45f6].name : _0x4c45f6]);
                _0x20702a(_0x44ef22);

                var _0x10973c = _0x1c598a.getLastChoiceBalanser();
                if (_0x1b2f9f > 15 || _0x44ef22.ready) {
                  _0x17b61f.render().find(".lampac-balanser-loader").remove();
                  _0x20702a(_0x44ef22, true);
                } else {
                  !_0x3d4ace && _0x4bfca2[_0x10973c] && _0x4bfca2[_0x10973c].show ? (_0x20702a(_0x44ef22, true), _0x3440ea = setTimeout(_0x5f07e2, 1000)) : _0x3440ea = setTimeout(_0x5f07e2, 1000);
                }
              }, function () {
                _0x1b2f9f++;
                _0x1b2f9f > 15 ? _0x2e3848() : _0x3440ea = setTimeout(_0x5f07e2, 1000);
              }, false, {
                "headers": _0x5b044d()
              });
            };
          _0x1fba8c();
        });
      };

      this.createSource = function () {
        var _0x166e01 = this;
        return new Promise(function (_0x32edd0, _0x422c15) {
          var _0x40c9a7 = _0x166e01.requestParams(_0x55d122.localhost + "lite/events?life=true");
          _0x3c7a6b.timeout(15000);
          _0x3c7a6b.silent(_0x251c58(_0x40c9a7), function (_0x483279) {
            if (_0x483279.accsdb) return _0x422c15(_0x483279);
            if (_0x483279.life) {
              _0x166e01.memkey = _0x483279.memkey;
              if (_0x483279.title) {
                if (_0x1140bc.movie.name) _0x1140bc.movie.name = _0x483279.title;
                if (_0x1140bc.movie.title) _0x1140bc.movie.title = _0x483279.title;
              }
              _0x17b61f.render().find(".filter--sort").append("<span class=\"lampac-balanser-loader\" style=\"width: 1.2em; height: 1.2em; margin-top: 0; background: url(./img/loader.svg) no-repeat 50% 50%; background-size: contain; margin-left: 0.5em\"></span>");
              _0x166e01.lifeSource().then(_0x166e01.startSource).then(_0x32edd0)["catch"](_0x422c15);
            } else _0x166e01.startSource(_0x483279).then(_0x32edd0)["catch"](_0x422c15);
          }, _0x422c15, false, {
            "headers": _0x5b044d()
          });
        });
      };

      this.create = function () {
        return this.render();
      };

      this.search = function () {
        this.filter({
          "source": _0x4ae3ee
        }, this.getChoice());
        this.find();
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

          var formattedList = items.map(function (item) {
            var fileName = item.Name;
            if (item.MediaSources && item.MediaSources[0] && item.MediaSources[0].Path) {
              var path = item.MediaSources[0].Path;
              var extracted = path.split('\\').pop().split('/').pop();
              if (extracted) fileName = extracted;
            }

            var streamUrl = mkBuildStreamUrl(item);
            var qMap = {};
            qMap["4K 5.1"] = streamUrl;

            return {
              method: 'play',
              title: fileName,
              text: fileName,
              url: streamUrl,
              qualitys: qMap,
              voice_name: "Мир Кино"
            };
          });

          _0x1d6940.display(formattedList);
        });
      };

      this.find = function () {
        if (_0x4c45f6 === "mirkino") {
          this.findMirKino();
        } else {
          this.request(this.requestParams(_0x1929d0));
        }
      };

      this.request = function (_0x2a81a4) {
        if (_0x4c45f6 === "mirkino") {
          return this.findMirKino();
        }
        _0x95222e++;
        if (_0x95222e < 10) {
          _0x3c7a6b.native(_0x251c58(_0x2a81a4), this.parse.bind(this), this.doesNotAnswer.bind(this), false, {
            "dataType": "text",
            "headers": _0x5b044d()
          });
          clearTimeout(_0x38bdfc);
          _0x38bdfc = setTimeout(function () {
            _0x95222e = 0;
          }, 4000);
        } else this.empty();
      };

      this.parseJsonDate = function (_0x382a41, _0x343c26) {
        try {
          var _0x410f44 = $("<div>" + _0x382a41 + "</div>"),
            _0xa501ee = [];
          return _0x410f44.find(_0x343c26).each(function () {
            var _0x5358ca = $(this),
              _0x42d5b3 = JSON.parse(_0x5358ca.attr("data-json")),
              _0x42b2f5 = _0x5358ca.attr("s"),
              _0x5c8e89 = _0x5358ca.attr("e"),
              _0x60d456 = _0x5358ca.text();
            !_0x1140bc.movie.name && (_0x60d456.match(/\d+p/i) && (!_0x42d5b3.quality && (_0x42d5b3.quality = {}, _0x42d5b3.quality[_0x60d456] = _0x42d5b3.url), _0x60d456 = _0x1140bc.movie.title), _0x60d456 == "По умолчанию" && (_0x60d456 = _0x1140bc.movie.title));
            if (_0x5c8e89) _0x42d5b3.episode = parseInt(_0x5c8e89);
            if (_0x42b2f5) _0x42d5b3.season = parseInt(_0x42b2f5);
            if (_0x60d456) _0x42d5b3.text = _0x60d456;
            _0x42d5b3.active = _0x5358ca.hasClass("active");
            _0xa501ee.push(_0x42d5b3);
          }), _0xa501ee;
        } catch (_0x1351d6) {
          return [];
        }
      };

      this.getFileUrl = function (_0x4e8f31, _0x420144, _0xc92f09) {
        if (_0x4c45f6 === "mirkino" || (_0x4e8f31 && _0x4e8f31.url && _0x4e8f31.url.indexOf('ru.mir-kino.pp.ru') !== -1)) {
          return _0x420144(_0x4e8f31, {});
        }
        var _0x54c6e8 = this;
        if (Lampa.Storage.field("player") !== "inner" && _0x4e8f31.stream && Lampa.Platform.is("apple")) {
          var _0x147e97 = Lampa.Arrays.clone(_0x4e8f31);
          _0x147e97.method = "play";
          _0x147e97.url = _0x4e8f31.stream;
          _0x420144(_0x147e97, {});
        } else {
          if (_0x4e8f31.method == "play") _0x420144(_0x4e8f31, {}); else Lampa.Loading.start(function () {
            Lampa.Loading.stop();
            Lampa.Controller.toggle("content");
            _0x3c7a6b.clear();
          }), _0x3c7a6b.native(_0x251c58(_0x4e8f31.url), function (_0x463430) {
            _0x463430.rch ? _0xc92f09 ? (_0xc92f09 = false, Lampa.Loading.stop(), _0x420144(false, {})) : _0x54c6e8.rch(_0x463430, function () {
              Lampa.Loading.stop();
              _0x54c6e8.getFileUrl(_0x4e8f31, _0x420144, true);
            }) : (Lampa.Loading.stop(), _0x420144(_0x463430, _0x463430));
          }, function () {
            Lampa.Loading.stop();
            _0x420144(false, {});
          }, false, {
            "headers": _0x5b044d()
          });
        }
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

      this.orUrlReserve = function (_0x57aa3b) {
        if (_0x57aa3b.url && typeof _0x57aa3b.url == "string" && _0x57aa3b.url.indexOf(" or ") !== -1) {
          var _0x5cb067 = _0x57aa3b.url.split(" or ");
          _0x57aa3b.url = _0x5cb067[0];
          _0x57aa3b.url_reserve = _0x5cb067[1];
        }
      };

      this.setDefaultQuality = function (_0x441523) {
        if (_0x441523.quality && Lampa.Arrays.getKeys(_0x441523.quality).length) {
          for (var _0x5b402b in _0x441523.quality) {
            if (parseInt(_0x5b402b) == Lampa.Storage.field("video_quality_default")) {
              _0x441523.url = _0x441523.quality[_0x5b402b];
              this.orUrlReserve(_0x441523);
            }
            if (_0x441523.quality[_0x5b402b] && typeof _0x441523.quality[_0x5b402b] === 'string' && _0x441523.quality[_0x5b402b].indexOf(" or ") !== -1) {
              _0x441523.quality[_0x5b402b] = _0x441523.quality[_0x5b402b].split(" or ")[0];
            }
          }
        }
      };

      this.display = function (_0x5792cb) {
        var _0x1d6940 = this;
        this.draw(_0x5792cb, {
          "onEnter": function _0x46a7f5(_0x399b01) {
            _0x1d6940.getFileUrl(_0x399b01, function (_0x4c30dc, _0x2c7c13) {
              if (_0x4c30dc && _0x4c30dc.url) {
                var _0x23d0a2 = [],
                  _0x2c15bd = _0x1d6940.toPlayElement(_0x399b01);
                _0x2c15bd.url = _0x4c30dc.url;
                _0x2c15bd.headers = _0x2c7c13.headers || _0x4c30dc.headers;
                _0x2c15bd.quality = _0x2c7c13.quality || _0x399b01.qualitys;
                _0x2c15bd.segments = _0x2c7c13.segments || _0x399b01.segments;
                _0x2c15bd.hls_manifest_timeout = _0x2c7c13.hls_manifest_timeout || _0x4c30dc.hls_manifest_timeout;
                _0x2c15bd.subtitles = _0x4c30dc.subtitles;
                _0x2c15bd.subtitles_call = _0x2c7c13.subtitles_call || _0x4c30dc.subtitles_call;
                if (_0x4c30dc.vast && _0x4c30dc.vast.url) {
                  _0x2c15bd.vast_url = _0x4c30dc.vast.url;
                  _0x2c15bd.vast_msg = _0x4c30dc.vast.msg;
                  _0x2c15bd.vast_region = _0x4c30dc.vast.region;
                  _0x2c15bd.vast_platform = _0x4c30dc.vast.platform;
                  _0x2c15bd.vast_screen = _0x4c30dc.vast.screen;
                }
                _0x1d6940.orUrlReserve(_0x2c15bd);
                _0x1d6940.setDefaultQuality(_0x2c15bd);
                if (_0x399b01.season) {
                  _0x5792cb.forEach(function (_0x42d77c) {
                    var _0x11022f = _0x1d6940.toPlayElement(_0x42d77c);
                    if (_0x42d77c == _0x399b01) _0x11022f.url = _0x4c30dc.url; else if (_0x42d77c.method == "call") {
                      if (Lampa.Storage.field("player") !== "inner") {
                        _0x11022f.url = _0x42d77c.stream;
                        delete _0x11022f.quality;
                      } else {
                        _0x11022f.url = function (_0xf73156) {
                          _0x1d6940.getFileUrl(_0x42d77c, function (_0x21d547, _0x4298f5) {
                            if (_0x21d547.url) {
                              _0x11022f.url = _0x21d547.url;
                              _0x11022f.quality = _0x4298f5.quality || _0x42d77c.qualitys;
                              _0x11022f.segments = _0x4298f5.segments || _0x42d77c.segments;
                              _0x11022f.subtitles = _0x21d547.subtitles;
                              _0x1d6940.orUrlReserve(_0x11022f);
                              _0x1d6940.setDefaultQuality(_0x11022f);
                              _0x42d77c.mark();
                            } else {
                              _0x11022f.url = "";
                              Lampa.Noty.show(Lampa.Lang.translate("lampac_nolink"));
                            }
                            _0xf73156();
                          }, function () {
                            _0x11022f.url = "";
                            _0xf73156();
                          });
                        };
                      }
                    } else _0x11022f.url = _0x42d77c.url;
                    _0x1d6940.orUrlReserve(_0x11022f);
                    _0x1d6940.setDefaultQuality(_0x11022f);
                    _0x23d0a2.push(_0x11022f);
                  });
                } else _0x23d0a2.push(_0x2c15bd);

                if (_0x23d0a2.length > 1) _0x2c15bd.playlist = _0x23d0a2;
                if (_0x2c15bd.url) {
                  var _0x3b6411 = _0x2c15bd;
                  _0x3b6411.isonline = true;
                  Lampa.Player.play(_0x3b6411);
                  Lampa.Player.playlist(_0x23d0a2);
                  if (_0x3b6411.subtitles_call) _0x1d6940.loadSubtitles(_0x3b6411.subtitles_call);
                  _0x399b01.mark();
                  _0x1d6940.updateBalanser(_0x4c45f6);
                } else Lampa.Noty.show(Lampa.Lang.translate("lampac_nolink"));
              } else Lampa.Noty.show(Lampa.Lang.translate("lampac_nolink"));
            }, true);
          },
          "onContextMenu": function _0x170bf6(_0x5e690a, _0x3cd0cc, _0x3204c2, _0x508fc2) {
            _0x1d6940.getFileUrl(_0x5e690a, function (_0x5d6244) {
              _0x508fc2({
                "file": _0x5d6244.url,
                "quality": _0x5e690a.qualitys
              });
            }, true);
          }
        });
        this.filter({
          "season": _0x4047f4.season.map(function (_0x20642d) { return _0x20642d.title; }),
          "voice": _0x4047f4.voice.map(function (_0x357f36) { return _0x357f36.title; })
        }, this.getChoice());
      };

      this.loadSubtitles = function (_0x5896af) {
        _0x3c7a6b.silent(_0x251c58(_0x5896af), function (_0x5864ca) {
          Lampa.Player.subtitles(_0x5864ca);
        }, function () {}, false, {
          "headers": _0x5b044d()
        });
      };

      this.parse = function (_0x1c47dd) {
        var _0x26ee4b = Lampa.Arrays.decodeJson(_0x1c47dd, {});
        if (Lampa.Arrays.isObject(_0x1c47dd) && _0x1c47dd.rch) _0x26ee4b = _0x1c47dd;
        if (_0x26ee4b.rch) return this.rch(_0x26ee4b);
        try {
          var _0x60d51c = this.parseJsonDate(_0x1c47dd, ".videos__item"),
            _0x50b590 = this.parseJsonDate(_0x1c47dd, ".videos__button");
          if (_0x60d51c.length == 1 && _0x60d51c[0].method == "link" && !_0x60d51c[0].similar) {
            _0x4047f4.season = _0x60d51c.map(function (_0x31705e) {
              return {
                "title": _0x31705e.text,
                "url": _0x31705e.url
              };
            });
            this.replaceChoice({ "season": 0 });
            this.request(_0x60d51c[0].url);
          } else {
            this.activity.loader(false);
            var _0x5090e2 = _0x60d51c.filter(function (_0x1c8c58) {
                return _0x1c8c58.method == "play" || _0x1c8c58.method == "call";
              }),
              _0x2f505f = _0x60d51c.filter(function (_0x5955fc) {
                return _0x5955fc.similar;
              });
            if (_0x5090e2.length) {
              if (_0x50b590.length) {
                _0x4047f4.voice = _0x50b590.map(function (_0x3690e6) {
                  return {
                    "title": _0x3690e6.text,
                    "url": _0x3690e6.url
                  };
                });
                var _0x5da070 = this.getChoice(_0x4c45f6).voice_url,
                  _0x43e2f9 = this.getChoice(_0x4c45f6).voice_name,
                  _0x70d6e1 = _0x50b590.find(function (_0x44c3ea) {
                    return _0x44c3ea.url == _0x5da070;
                  }),
                  _0x1097e0 = _0x50b590.find(function (_0x43f21d) {
                    return _0x43f21d.text == _0x43e2f9;
                  }),
                  _0x22c413 = _0x50b590.find(function (_0x28ca36) {
                    return _0x28ca36.active;
                  });
                if (_0x70d6e1 && !_0x70d6e1.active) {
                  this.replaceChoice({
                    "voice": _0x50b590.indexOf(_0x70d6e1),
                    "voice_name": _0x70d6e1.text
                  });
                  this.request(_0x70d6e1.url);
                } else if (_0x1097e0 && !_0x1097e0.active) {
                  this.replaceChoice({
                    "voice": _0x50b590.indexOf(_0x1097e0),
                    "voice_name": _0x1097e0.text
                  });
                  this.request(_0x1097e0.url);
                } else {
                  if (_0x22c413) {
                    this.replaceChoice({
                      "voice": _0x50b590.indexOf(_0x22c413),
                      "voice_name": _0x22c413.text
                    });
                  }
                  this.display(_0x5090e2);
                }
              } else {
                this.replaceChoice({
                  "voice": 0,
                  "voice_url": "",
                  "voice_name": ""
                });
                this.display(_0x5090e2);
              }
            } else {
              if (_0x60d51c.length) {
                if (_0x2f505f.length) {
                  this.similars(_0x2f505f);
                  this.activity.loader(false);
                } else {
                  _0x4047f4.season = _0x60d51c.map(function (_0x15c121) {
                    return {
                      "title": _0x15c121.text,
                      "url": _0x15c121.url
                    };
                  });
                  var _0x17d431 = this.getChoice(_0x4c45f6).season,
                    _0x313984 = _0x4047f4.season[_0x17d431];
                  if (!_0x313984) _0x313984 = _0x4047f4.season[0];
                  this.request(_0x313984.url);
                }
              } else this.doesNotAnswer(_0x26ee4b);
            }
          }
        } catch (_0x138d9b) {
          this.doesNotAnswer(_0x138d9b);
        }
      };

      this.similars = function (_0x298bb8) {
        var _0x54e4e0 = this;
        _0x256cfd.clear();
        _0x298bb8.forEach(function (_0x308e04) {
          _0x308e04.title = _0x308e04.text;
          _0x308e04.info = "";
          var _0x24852 = [],
            _0x2178a3 = ((_0x308e04.start_date || _0x308e04.year || _0x1140bc.movie.release_date || _0x1140bc.movie.first_air_date || "") + "").slice(0, 4);
          if (_0x2178a3) _0x24852.push(_0x2178a3);
          if (_0x308e04.details) _0x24852.push(_0x308e04.details);
          var _0x3892e3 = _0x308e04.title || _0x308e04.text;
          _0x308e04.title = _0x3892e3;
          _0x308e04.time = _0x308e04.time || "";
          _0x308e04.info = _0x24852.join("<span class=\"online-prestige-split\">●</span>");
          var _0x210c35 = Lampa.Template.get("lampac_prestige_folder", _0x308e04);
          if (_0x308e04.img) {
            var _0x1f3072 = $("<img style=\"height: 7em; width: 7em; border-radius: 0.3em;\"/>");
            _0x210c35.find(".online-prestige__folder").empty().append(_0x1f3072);
            if (_0x308e04.img !== undefined) {
              if (_0x308e04.img.charAt(0) === "/") _0x308e04.img = _0x55d122.localhost + _0x308e04.img.substring(1);
              if (_0x308e04.img.indexOf("/proxyimg") !== -1) _0x308e04.img = _0x251c58(_0x308e04.img);
            }
            Lampa.Utils.imgLoad(_0x1f3072, _0x308e04.img);
          }
          _0x210c35.on("hover:enter", function () {
            _0x54e4e0.reset();
            _0x54e4e0.request(_0x308e04.url);
          }).on("hover:focus", function (_0x504dc3) {
            _0x42f0ab = _0x504dc3.target;
            _0x256cfd.update($(_0x504dc3.target), true);
          });
          _0x256cfd.append(_0x210c35);
        });
        this.filter({
          "season": _0x4047f4.season.map(function (_0x491e94) { return _0x491e94.title; }),
          "voice": _0x4047f4.voice.map(function (_0x486246) { return _0x486246.title; })
        }, this.getChoice());
        Lampa.Controller.enable("content");
      };

      this.getChoice = function (_0x9a5907) {
        var _0xd32cd5 = Lampa.Storage.cache("online_choice_" + (_0x9a5907 || _0x4c45f6), 3000, {}),
          _0x53c8a7 = _0xd32cd5[_0x1140bc.movie.id] || {};
        return Lampa.Arrays.extend(_0x53c8a7, {
          "season": 0,
          "voice": 0,
          "voice_name": "",
          "voice_id": 0,
          "episodes_view": {},
          "movie_view": ""
        }), _0x53c8a7;
      };

      this.saveChoice = function (_0x11fa19, _0x8ff267) {
        var _0x2d550a = Lampa.Storage.cache("online_choice_" + (_0x8ff267 || _0x4c45f6), 3000, {});
        _0x2d550a[_0x1140bc.movie.id] = _0x11fa19;
        Lampa.Storage.set("online_choice_" + (_0x8ff267 || _0x4c45f6), _0x2d550a);
        this.updateBalanser(_0x8ff267 || _0x4c45f6);
      };

      this.replaceChoice = function (_0x1a6a9e, _0x179a72) {
        var _0x237bcc = this.getChoice(_0x179a72);
        Lampa.Arrays.extend(_0x237bcc, _0x1a6a9e, true);
        this.saveChoice(_0x237bcc, _0x179a72);
      };

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

      this.filter = function (_0x4d737a, _0x34f907) {
        var _0x27025e = this,
          _0x14175f = [],
          _0x1f60b9 = function _0x4cd1eb(_0xe25997, _0x315d07) {
            var _0x311031 = _0x27025e.getChoice(),
              _0x4cf22d = _0x4d737a[_0xe25997],
              _0x12eddc = [],
              _0x5c02d0 = _0x311031[_0xe25997];
            _0x4cf22d.forEach(function (_0x2ff6a8, _0x328a44) {
              _0x12eddc.push({
                "title": _0x2ff6a8,
                "selected": _0x5c02d0 == _0x328a44,
                "index": _0x328a44
              });
            });
            _0x14175f.push({
              "title": _0x315d07,
              "subtitle": _0x4cf22d[_0x5c02d0],
              "items": _0x12eddc,
              "stype": _0xe25997
            });
          };
        _0x4d737a.source = _0x4ae3ee;
        _0x14175f.push({
          "title": Lampa.Lang.translate("torrent_parser_reset"),
          "reset": true
        });
        this.saveChoice(_0x34f907);
        if (_0x4d737a.voice && _0x4d737a.voice.length) _0x1f60b9("voice", Lampa.Lang.translate("torrent_parser_voice"));
        if (_0x4d737a.season && _0x4d737a.season.length) _0x1f60b9("season", Lampa.Lang.translate("torrent_serial_season"));
        _0x17b61f.set("filter", _0x14175f);
        _0x17b61f.set("sort", _0x4ae3ee.map(function (_0x4521be) {
          return {
            "title": _0x4bfca2[_0x4521be].name,
            "source": _0x4521be,
            "selected": _0x4521be == _0x4c45f6,
            "ghost": !_0x4bfca2[_0x4521be].show
          };
        }));
        this.selected(_0x4d737a);
      };

      this.selected = function (_0x3e9781) {
        var _0x59d079 = this.getChoice(),
          _0x38e9d2 = [];
        for (var _0x42bdae in _0x59d079) {
          if (_0x3e9781[_0x42bdae] && _0x3e9781[_0x42bdae].length) {
            if (_0x42bdae == "voice") _0x38e9d2.push(_0x29f83b[_0x42bdae] + ": " + _0x3e9781[_0x42bdae][_0x59d079[_0x42bdae]]); else _0x42bdae !== "source" && _0x3e9781.season.length >= 1 && _0x38e9d2.push(_0x29f83b.season + ": " + _0x3e9781[_0x42bdae][_0x59d079[_0x42bdae]]);
          }
        }
        _0x17b61f.chosen("filter", _0x38e9d2);
        _0x17b61f.chosen("sort", [_0x4bfca2[_0x4c45f6] ? _0x4bfca2[_0x4c45f6].name : _0x4c45f6]);
      };

      this.getEpisodes = function (_0x4a25d4, _0x15c15a) {
        var _0x4d5f17 = [],
          _0x5c4492 = _0x1140bc.movie.id;
        if (["cub", "tmdb"].indexOf(_0x1140bc.movie.source || "tmdb") == -1) _0x5c4492 = _0x1140bc.movie.tmdb_id;
        if (typeof _0x5c4492 == "number" && _0x1140bc.movie.name) {
          Lampa.Api.sources.tmdb.get("tv/" + _0x5c4492 + "/season/" + _0x4a25d4, {}, function (_0x30a369) {
            _0x4d5f17 = _0x30a369.episodes || [];
            _0x15c15a(_0x4d5f17);
          }, function () {
            _0x15c15a(_0x4d5f17);
          });
        } else _0x15c15a(_0x4d5f17);
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
          var _0x3d23b9 = [];
          if (_0xa135db.balanser_name) _0x3d23b9.push(_0xa135db.balanser_name);
          if (_0xa135db.voice_name) _0x3d23b9.push(_0xa135db.voice_name);
          if (_0xa135db.season) _0x3d23b9.push(Lampa.Lang.translate("torrent_serial_season") + " " + _0xa135db.season);
          if (_0xa135db.episode) _0x3d23b9.push(Lampa.Lang.translate("torrent_serial_episode") + " " + _0xa135db.episode);
          _0x3d23b9.forEach(function (_0x4ec6ea) {
            _0x444cfa.append("<span>" + _0x4ec6ea + "</span>");
          });
        } else _0x444cfa.append("<span>" + Lampa.Lang.translate("lampac_no_watch_history") + "</span>");
      };

      this.draw = function (_0x589b28) {
        var _0xeb9e1d = this,
          _0x5536ce = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        if (!_0x589b28.length) return this.empty();
        _0x256cfd.clear();
        if (!_0x1140bc.balanser) _0x256cfd.append(Lampa.Template.get("lampac_prestige_watched", {}));
        this.updateWatched();
        this.getEpisodes(_0x589b28[0].season, function (_0x1e8b64) {
          var _0x3f5624 = Lampa.Storage.cache("online_view", 5000, []),
            _0x594e7d = _0x1140bc.movie.name ? true : false,
            _0x251a37 = _0xeb9e1d.getChoice(),
            _0x427bfa = window.innerWidth > 480,
            _0x2f4710 = false,
            _0x52a307 = false;
          _0x589b28.forEach(function (_0x311c64, _0x3abe68) {
            var _0x40ba00 = _0x594e7d && _0x1e8b64.length && !_0x5536ce.similars ? _0x1e8b64.find(function (_0x1a9b7c) {
                return _0x1a9b7c.episode_number == _0x311c64.episode;
              }) : false,
              _0x30d6b6 = _0x311c64.episode || _0x3abe68 + 1,
              _0xe90704 = _0x251a37.episodes_view[_0x311c64.season],
              _0x1622d2 = _0x251a37.voice_name || (_0x4047f4.voice[0] ? _0x4047f4.voice[0].title : false) || _0x311c64.voice_name || (_0x594e7d ? "Неизвестно" : _0x311c64.text) || "Неизвестно";
            _0x311c64.quality && (_0x311c64.qualitys = _0x311c64.quality, _0x311c64.quality = Lampa.Arrays.getKeys(_0x311c64.quality)[0]);
            Lampa.Arrays.extend(_0x311c64, {
              "voice_name": _0x1622d2,
              "info": _0x1622d2.length > 60 ? _0x1622d2.substr(0, 60) + "..." : _0x1622d2,
              "quality": "",
              "time": Lampa.Utils.secondsToTime((_0x40ba00 ? _0x40ba00.runtime : _0x1140bc.movie.runtime) * 60, true)
            });
            var _0x1c4c11 = Lampa.Utils.hash(_0x311c64.season ? [_0x311c64.season, _0x311c64.season > 10 ? ":" : "", _0x311c64.episode, _0x1140bc.movie.original_title].join("") : _0x1140bc.movie.original_title),
              _0x30af82 = Lampa.Utils.hash(_0x311c64.season ? [_0x311c64.season, _0x311c64.season > 10 ? ":" : "", _0x311c64.episode, _0x1140bc.movie.original_title, _0x311c64.voice_name].join("") : _0x1140bc.movie.original_title + _0x311c64.voice_name),
              _0x5631df = {
                "hash_timeline": _0x1c4c11,
                "hash_behold": _0x30af82
              },
              _0x45d525 = [];
            _0x311c64.season && (_0x311c64.translate_episode_end = _0xeb9e1d.getLastEpisode(_0x589b28), _0x311c64.translate_voice = _0x311c64.voice_name);
            if (_0x311c64.text && !_0x40ba00) _0x311c64.title = _0x311c64.text;
            _0x311c64.timeline = Lampa.Timeline.view(_0x1c4c11);
            if (_0x40ba00) {
              _0x311c64.title = _0x40ba00.name;
              if (_0x311c64.info.length < 30 && _0x40ba00.vote_average) _0x45d525.push(Lampa.Template.get("lampac_prestige_rate", {
                "rate": parseFloat(_0x40ba00.vote_average + "").toFixed(1)
              }, true));
              if (_0x40ba00.air_date && _0x427bfa) _0x45d525.push(Lampa.Utils.parseTime(_0x40ba00.air_date).full);
            } else _0x1140bc.movie.release_date && _0x427bfa && _0x45d525.push(Lampa.Utils.parseTime(_0x1140bc.movie.release_date).full);
            if (!_0x594e7d && _0x1140bc.movie.tagline && _0x311c64.info.length < 30) _0x45d525.push(_0x1140bc.movie.tagline);
            if (_0x311c64.info) _0x45d525.push(_0x311c64.info);
            if (_0x45d525.length) _0x311c64.info = _0x45d525.map(function (_0x4fa4df) {
              return "<span>" + _0x4fa4df + "</span>";
            }).join("<span class=\"online-prestige-split\">●</span>");
            var _0x2f70ed = Lampa.Template.get("lampac_prestige_full", _0x311c64),
              _0x108c67 = _0x2f70ed.find(".online-prestige__loader"),
              _0x16e426 = _0x2f70ed.find(".online-prestige__img");
            if (_0x1140bc.balanser) _0x16e426.hide();
            if (!_0x594e7d) {
              if (_0x251a37.movie_view == _0x30af82) _0x2f4710 = _0x2f70ed;
            } else typeof _0xe90704 !== "undefined" && _0xe90704 == _0x30d6b6 && (_0x2f4710 = _0x2f70ed);
            if (_0x594e7d && !_0x40ba00) _0x16e426.append("<div class=\"online-prestige__episode-number\">" + _0x5b38c2(_0x311c64.episode || _0x3abe68 + 1) + "</div>"), _0x108c67.remove(); else {
              if (!_0x594e7d && _0x1140bc.movie.backdrop_path == "undefined") _0x108c67.remove(); else {
                var _0x3ae7d9 = _0x2f70ed.find("img")[0];
                _0x3ae7d9.onerror = function () {
                  _0x3ae7d9.src = "./img/img_broken.svg";
                };
                _0x3ae7d9.onload = function () {
                  _0x16e426.addClass("online-prestige__img--loaded");
                  _0x108c67.remove();
                  if (_0x594e7d) _0x16e426.append("<div class=\"online-prestige__episode-number\">" + _0x5b38c2(_0x311c64.episode || _0x3abe68 + 1) + "</div>");
                };
                _0x3ae7d9.src = Lampa.TMDB.image("t/p/w300" + (_0x40ba00 ? _0x40ba00.still_path : _0x1140bc.movie.backdrop_path));
                _0x3706f7.push(_0x3ae7d9);
                _0x311c64.thumbnail = _0x3ae7d9.src;
              }
            }
            _0x2f70ed.find(".online-prestige__timeline").append(Lampa.Timeline.render(_0x311c64.timeline));
            _0x3f5624.indexOf(_0x30af82) !== -1 && (_0x52a307 = _0x2f70ed, _0x2f70ed.find(".online-prestige__img").append("<div class=\"online-prestige__viewed\">" + Lampa.Template.get("icon_viewed", {}, true) + "</div>"));
            _0x311c64.mark = function () {
              _0x3f5624 = Lampa.Storage.cache("online_view", 5000, []);
              _0x3f5624.indexOf(_0x30af82) == -1 && (_0x3f5624.push(_0x30af82), Lampa.Storage.set("online_view", _0x3f5624), _0x2f70ed.find(".online-prestige__viewed").length == 0 && _0x2f70ed.find(".online-prestige__img").append("<div class=\"online-prestige__viewed\">" + Lampa.Template.get("icon_viewed", {}, true) + "</div>"));
              _0x251a37 = _0xeb9e1d.getChoice();
              !_0x594e7d ? _0x251a37.movie_view = _0x30af82 : _0x251a37.episodes_view[_0x311c64.season] = _0x30d6b6;
              _0xeb9e1d.saveChoice(_0x251a37);
              var _0x2296f7 = _0x251a37.voice_name || _0x311c64.voice_name || _0x311c64.title;
              if (_0x2296f7.length > 30) _0x2296f7 = _0x2296f7.slice(0, 30) + "...";
              _0xeb9e1d.watched({
                "balanser": _0x4c45f6,
                "balanser_name": _0x4bfca2[_0x4c45f6] ? _0x4bfca2[_0x4c45f6].name.split(" ")[0] : _0x4c45f6,
                "voice_id": _0x251a37.voice_id,
                "voice_name": _0x2296f7,
                "episode": _0x311c64.episode,
                "season": _0x311c64.season
              });
            };
            _0x311c64.unmark = function () {
              _0x3f5624 = Lampa.Storage.cache("online_view", 5000, []);
              _0x3f5624.indexOf(_0x30af82) !== -1 && (Lampa.Arrays.remove(_0x3f5624, _0x30af82), Lampa.Storage.set("online_view", _0x3f5624), Lampa.Storage.remove("online_view", _0x30af82), _0x2f70ed.find(".online-prestige__viewed").remove());
            };
            _0x311c64.timeclear = function () {
              _0x311c64.timeline.percent = 0;
              _0x311c64.timeline.time = 0;
              _0x311c64.timeline.duration = 0;
              Lampa.Timeline.update(_0x311c64.timeline);
            };
            _0x2f70ed.on("hover:enter", function () {
              if (_0x1140bc.movie.id) Lampa.Favorite.add("history", _0x1140bc.movie, 100);
              if (_0x5536ce.onEnter) _0x5536ce.onEnter(_0x311c64, _0x2f70ed, _0x5631df);
            }).on("hover:focus", function (_0x139cbe) {
              _0x42f0ab = _0x139cbe.target;
              if (_0x5536ce.onFocus) _0x5536ce.onFocus(_0x311c64, _0x2f70ed, _0x5631df);
              _0x256cfd.update($(_0x139cbe.target), true);
            });
            if (_0x5536ce.onRender) _0x5536ce.onRender(_0x311c64, _0x2f70ed, _0x5631df);
            _0xeb9e1d.contextMenu({
              "html": _0x2f70ed,
              "element": _0x311c64,
              "onFile": function _0x3e615a(_0x15a405) {
                if (_0x5536ce.onContextMenu) _0x5536ce.onContextMenu(_0x311c64, _0x2f70ed, _0x5631df, _0x15a405);
              },
              "onClearAllMark": function _0x241fed() {
                _0x589b28.forEach(function (_0x2dc11f) { _0x2dc11f.unmark(); });
              },
              "onClearAllTime": function _0xf9165d() {
                _0x589b28.forEach(function (_0x39ce43) { _0x39ce43.timeclear(); });
              }
            });
            _0x256cfd.append(_0x2f70ed);
          });
          if (_0x594e7d && _0x1e8b64.length > _0x589b28.length && !_0x5536ce.similars) {
            var _0x339ff6 = _0x1e8b64.slice(_0x589b28.length);
            _0x339ff6.forEach(function (_0x20a333) {
              var _0x50ee0e = [];
              if (_0x20a333.vote_average) _0x50ee0e.push(Lampa.Template.get("lampac_prestige_rate", {
                "rate": parseFloat(_0x20a333.vote_average + "").toFixed(1)
              }, true));
              if (_0x20a333.air_date) _0x50ee0e.push(Lampa.Utils.parseTime(_0x20a333.air_date).full);
              var _0x27253b = new Date((_0x20a333.air_date + "").replace(/-/g, "/")),
                _0x329ee0 = Date.now(),
                _0x31cca4 = Math.round((_0x27253b.getTime() - _0x329ee0) / (24 * 60 * 60 * 1000)),
                _0x638d1e = Lampa.Lang.translate("full_episode_days_left") + ": " + _0x31cca4,
                _0x45e236 = Lampa.Template.get("lampac_prestige_full", {
                  "time": Lampa.Utils.secondsToTime((_0x20a333 ? _0x20a333.runtime : _0x1140bc.movie.runtime) * 60, true),
                  "info": _0x50ee0e.length ? _0x50ee0e.map(function (_0x23f09b) { return "<span>" + _0x23f09b + "</span>"; }).join("<span class=\"online-prestige-split\">●</span>") : "",
                  "title": _0x20a333.name,
                  "quality": _0x31cca4 > 0 ? _0x638d1e : ""
                }),
                _0x54c662 = _0x45e236.find(".online-prestige__loader"),
                _0x3f342b = _0x45e236.find(".online-prestige__img"),
                _0x6a635a = _0x589b28[0] ? _0x589b28[0].season : 1;
              _0x45e236.find(".online-prestige__timeline").append(Lampa.Timeline.render(Lampa.Timeline.view(Lampa.Utils.hash([_0x6a635a, _0x20a333.episode_number, _0x1140bc.movie.original_title].join("")))));
              var _0x1035cc = _0x45e236.find("img")[0];
              _0x20a333.still_path ? (_0x1035cc.onerror = function () {
                _0x1035cc.src = "./img/img_broken.svg";
              }, _0x1035cc.onload = function () {
                _0x3f342b.addClass("online-prestige__img--loaded");
                _0x54c662.remove();
                _0x3f342b.append("<div class=\"online-prestige__episode-number\">" + _0x5b38c2(_0x20a333.episode_number) + "</div>");
              }, _0x1035cc.src = Lampa.TMDB.image("t/p/w300" + _0x20a333.still_path), _0x3706f7.push(_0x1035cc)) : (_0x54c662.remove(), _0x3f342b.append("<div class=\"online-prestige__episode-number\">" + _0x5b38c2(_0x20a333.episode_number) + "</div>"));
              _0x45e236.on("hover:focus", function (_0x5d78e3) {
                _0x42f0ab = _0x5d78e3.target;
                _0x256cfd.update($(_0x5d78e3.target), true);
              });
              _0x45e236.css("opacity", "0.5");
              _0x256cfd.append(_0x45e236);
            });
          }
          if (_0x2f4710) _0x42f0ab = _0x2f4710[0]; else _0x52a307 && (_0x42f0ab = _0x52a307[0]);
          Lampa.Controller.enable("content");
        });
      };

      this.contextMenu = function (_0x56b5c1) {
        _0x56b5c1.html.on("hover:long", function () {
          function _0x2f2348(_0x100518) {
            var _0x4acf34 = Lampa.Controller.enabled().name,
              _0xe68993 = [];
            Lampa.Platform.is("webos") && _0xe68993.push({
              "title": Lampa.Lang.translate("player_lauch") + " - Webos",
              "player": "webos"
            });
            Lampa.Platform.is("android") && _0xe68993.push({
              "title": Lampa.Lang.translate("player_lauch") + " - Android",
              "player": "android"
            });
            _0xe68993.push({
              "title": Lampa.Lang.translate("player_lauch") + " - Lampa",
              "player": "lampa"
            });
            _0xe68993.push({
              "title": Lampa.Lang.translate("lampac_video"),
              "separator": true
            });
            _0xe68993.push({
              "title": Lampa.Lang.translate("torrent_parser_label_title"),
              "mark": true
            });
            _0xe68993.push({
              "title": Lampa.Lang.translate("torrent_parser_label_cancel_title"),
              "unmark": true
            });
            _0xe68993.push({
              "title": Lampa.Lang.translate("time_reset"),
              "timeclear": true
            });
            _0x100518 && _0xe68993.push({
              "title": Lampa.Lang.translate("copy_link"),
              "copylink": true
            });
            if (window.lampac_online_context_menu) window.lampac_online_context_menu.push(_0xe68993, _0x100518, _0x56b5c1);
            _0xe68993.push({
              "title": Lampa.Lang.translate("more"),
              "separator": true
            });
            Lampa.Account.logged() && _0x56b5c1.element && typeof _0x56b5c1.element.season !== "undefined" && _0x56b5c1.element.translate_voice && _0xe68993.push({
              "title": Lampa.Lang.translate("lampac_voice_subscribe"),
              "subscribe": true
            });
            _0xe68993.push({
              "title": Lampa.Lang.translate("lampac_clear_all_marks"),
              "clearallmark": true
            });
            _0xe68993.push({
              "title": Lampa.Lang.translate("lampac_clear_all_timecodes"),
              "timeclearall": true
            });
            Lampa.Select.show({
              "title": Lampa.Lang.translate("title_action"),
              "items": _0xe68993,
              "onBack": function _0x517cbc() {
                Lampa.Controller.toggle(_0x4acf34);
              },
              "onSelect": function _0x288fb2(_0x19e4ce) {
                if (_0x19e4ce.mark) _0x56b5c1.element.mark();
                if (_0x19e4ce.unmark) _0x56b5c1.element.unmark();
                if (_0x19e4ce.timeclear) _0x56b5c1.element.timeclear();
                if (_0x19e4ce.clearallmark) _0x56b5c1.onClearAllMark();
                if (_0x19e4ce.timeclearall) _0x56b5c1.onClearAllTime();
                if (window.lampac_online_context_menu) window.lampac_online_context_menu.onSelect(_0x19e4ce, _0x56b5c1);
                Lampa.Controller.toggle(_0x4acf34);
                _0x19e4ce.player && (Lampa.Player.runas(_0x19e4ce.player), _0x56b5c1.html.trigger("hover:enter"));
                if (_0x19e4ce.copylink) {
                  if (_0x100518.quality) {
                    var _0x2b1533 = [];
                    for (var _0x473cd8 in _0x100518.quality) {
                      _0x2b1533.push({
                        "title": _0x473cd8,
                        "file": _0x100518.quality[_0x473cd8]
                      });
                    }
                    Lampa.Select.show({
                      "title": Lampa.Lang.translate("settings_server_links"),
                      "items": _0x2b1533,
                      "onBack": function _0x4b3e27() {
                        Lampa.Controller.toggle(_0x4acf34);
                      },
                      "onSelect": function _0x220b4e(_0x2f8aa2) {
                        Lampa.Utils.copyTextToClipboard(_0x2f8aa2.file, function () {
                          Lampa.Noty.show(Lampa.Lang.translate("copy_secuses"));
                        }, function () {
                          Lampa.Noty.show(Lampa.Lang.translate("copy_error"));
                        });
                      }
                    });
                  } else Lampa.Utils.copyTextToClipboard(_0x100518.file, function () {
                    Lampa.Noty.show(Lampa.Lang.translate("copy_secuses"));
                  }, function () {
                    Lampa.Noty.show(Lampa.Lang.translate("copy_error"));
                  });
                }
                _0x19e4ce.subscribe && Lampa.Account.subscribeToTranslation({
                  "card": _0x1140bc.movie,
                  "season": _0x56b5c1.element.season,
                  "episode": _0x56b5c1.element.translate_episode_end,
                  "voice": _0x56b5c1.element.translate_voice
                }, function () {
                  Lampa.Noty.show(Lampa.Lang.translate("lampac_voice_success"));
                }, function () {
                  Lampa.Noty.show(Lampa.Lang.translate("lampac_voice_error"));
                });
              }
            });
          }
          _0x56b5c1.onFile(_0x2f2348);
        }).on("hover:focus", function () {
          if (Lampa.Helper) Lampa.Helper.show("online_file", Lampa.Lang.translate("helper_online_file"), _0x56b5c1.html);
        });
      };

      this.empty = function () {
        var _0x1845af = Lampa.Template.get("lampac_does_not_answer", {});
        _0x1845af.find(".online-empty__buttons").remove();
        _0x1845af.find(".online-empty__title").text(Lampa.Lang.translate("empty_title_two"));
        _0x1845af.find(".online-empty__time").text(Lampa.Lang.translate("empty_text"));
        _0x256cfd.clear();
        _0x256cfd.append(_0x1845af);
        this.loading(false);
      };

      this.noConnectToServer = function (_0x5effc5) {
        var _0x536336 = Lampa.Template.get("lampac_does_not_answer", {});
        _0x536336.find(".online-empty__buttons").remove();
        _0x536336.find(".online-empty__title").text(Lampa.Lang.translate("title_error"));
        _0x536336.find(".online-empty__time").text(_0x5effc5 && _0x5effc5.accsdb ? _0x5effc5.msg : Lampa.Lang.translate("lampac_does_not_answer_text").replace("{balanser}", _0x4bfca2[_0x4c45f6] ? _0x4bfca2[_0x4c45f6].name : _0x4c45f6));
        _0x256cfd.clear();
        _0x256cfd.append(_0x536336);
        this.loading(false);
      };

      this.doesNotAnswer = function (_0x5c5e28) {
        var _0x31a997 = this;
        this.reset();
        var _0x3192d9 = Lampa.Template.get("lampac_does_not_answer", {
          "balanser": _0x4c45f6
        });
        if (_0x5c5e28 && _0x5c5e28.accsdb) _0x3192d9.find(".online-empty__title").html(_0x5c5e28.msg);
        var _0x21f27b = _0x5c5e28 && _0x5c5e28.accsdb ? 10 : 5;
        _0x3192d9.find(".cancel").on("hover:enter", function () {
          clearInterval(_0x32b57b);
        });
        _0x3192d9.find(".change").on("hover:enter", function () {
          clearInterval(_0x32b57b);
          _0x17b61f.render().find(".filter--sort").trigger("hover:enter");
        });
        _0x256cfd.clear();
        _0x256cfd.append(_0x3192d9);
        this.loading(false);
        _0x32b57b = setInterval(function () {
          _0x21f27b--;
          _0x3192d9.find(".timeout").text(_0x21f27b);
          if (_0x21f27b == 0) {
            clearInterval(_0x32b57b);
            var _0x3d4582 = Lampa.Arrays.getKeys(_0x4bfca2),
              _0x492648 = _0x3d4582.indexOf(_0x4c45f6),
              _0xe50f5c = _0x3d4582[_0x492648 + 1];
            if (!_0xe50f5c) _0xe50f5c = _0x3d4582[0];
            _0x4c45f6 = _0xe50f5c;
            if (Lampa.Activity.active().activity == _0x31a997.activity) _0x31a997.changeBalanser(_0x4c45f6);
          }
        }, 1000);
      };

      this.getLastEpisode = function (_0x1d567d) {
        var _0xffa2f1 = 0;
        return _0x1d567d.forEach(function (_0x2990a4) {
          if (typeof _0x2990a4.episode !== "undefined") _0xffa2f1 = Math.max(_0xffa2f1, parseInt(_0x2990a4.episode));
        }), _0xffa2f1;
      };

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

    function _0xfe99a9(_0x50ffe9, _0x6d0c42) {
      var _0x46a6de = new Lampa.Reguest(),
        _0x5dad0e = {
          "title": _0x50ffe9,
          "search": function (_0x2b5617, _0x23cf86) {
            function _0x307f6d(_0x45a1dd) {
              var _0x10c762 = Lampa.Arrays.getKeys(_0x45a1dd);
              if (_0x10c762.length) {
                var _0x1832d = new Lampa.Status(_0x10c762.length);
                _0x1832d.onComplite = function (_0x33350b) {
                  var _0x453483 = [];
                  _0x10c762.forEach(function (_0x5e5068) {
                    var _0x4b01a7 = _0x33350b[_0x5e5068];
                    if (_0x4b01a7 && _0x4b01a7.data && _0x4b01a7.type == "similar") {
                      var _0x5780bc = _0x4b01a7.data.map(function (_0x497513) {
                        _0x497513.title = Lampa.Utils.capitalizeFirstLetter(_0x497513.title);
                        _0x497513.release_date = _0x497513.year || "0000";
                        _0x497513.balanser = _0x6d0c42;
                        if (_0x497513.img !== undefined) {
                          if (_0x497513.img.charAt(0) === "/") _0x497513.img = _0x55d122.localhost + _0x497513.img.substring(1);
                          if (_0x497513.img.indexOf("/proxyimg") !== -1) _0x497513.img = _0x251c58(_0x497513.img);
                        }
                        return _0x497513;
                      });
                      _0x453483.push({
                        "title": _0x5e5068,
                        "results": _0x5780bc
                      });
                    }
                  });
                  _0x23cf86(_0x453483);
                };
                _0x10c762.forEach(function (_0x2502c0) {
                  _0x46a6de.silent(_0x251c58(_0x45a1dd[_0x2502c0]), function (_0x2a3b3c) {
                    _0x1832d.append(_0x2502c0, _0x2a3b3c);
                  }, function () {
                    _0x1832d.error();
                  }, false, {
                    "headers": _0x5b044d()
                  });
                });
              } else _0x23cf86([]);
            }
            _0x46a6de.silent(_0x251c58(_0x55d122.localhost + "lite/" + _0x6d0c42 + "?title=" + _0x2b5617.query), function (_0x41b445) {
              _0x41b445.rch ? _0x204321(_0x41b445, function () {
                _0x46a6de.silent(_0x251c58(_0x55d122.localhost + "lite/" + _0x6d0c42 + "?title=" + _0x2b5617.query), function (_0x29a936) {
                  _0x307f6d(_0x29a936);
                }, function () {
                  _0x23cf86([]);
                }, false, {
                  "headers": _0x5b044d()
                });
              }) : _0x307f6d(_0x41b445);
            }, function () {
              _0x23cf86([]);
            }, false, {
              "headers": _0x5b044d()
            });
          },
          "onCancel": function () {
            _0x46a6de.clear();
          },
          "params": {
            "lazy": true,
            "align_left": true,
            "card_events": {
              "onMenu": function () {}
            }
          },
          "onMore": function (_0x562c40, _0xc8a2c5) {
            _0xc8a2c5();
          },
          "onSelect": function (_0x3a7eb4, _0x58c0dc) {
            _0x58c0dc();
            Lampa.Activity.push({
              "url": _0x3a7eb4.element.url,
              "title": "Lampac - " + _0x3a7eb4.element.title,
              "component": "lampac",
              "movie": _0x3a7eb4.element,
              "page": 1,
              "search": _0x3a7eb4.element.title,
              "clarification": true,
              "balanser": _0x3a7eb4.element.balanser,
              "noinfo": true
            });
          }
        };
      Lampa.Search.addSource(_0x5dad0e);
    }

    function _0x3763c5() {
      var _0x31fc0d = Lampa.Manifest.origin || (typeof location !== "undefined" && location.host) || "";
      if (_0x31fc0d && ["bylampa", "lampa.mx"].indexOf(_0x31fc0d) === -1 && _0x31fc0d.indexOf("lampa.mx") === -1) {
        console.warn("Lampac", "unsupported origin:", _0x31fc0d);
      }
      window.lampac_plugin = true;
      var _0x51e5e4 = {
        "type": "video",
        "version": "7.7.7",
        "name": "Cinema",
        "description": "Плагин для просмотра онлайн сериалов и фильмов",
        "component": "cinema_online",
        "onContextMenu": function _0x53c477() {
          return {
            "name": Lampa.Lang.translate("lampac_watch"),
            "description": ""
          };
        },
        "onContextLauch": function _0x535464(_0x57940d) {
          _0x3cd3c3();
          Lampa.Component.add("cinema_online", _0x4cd5d3);
          var _0x37e8cd = Lampa.Utils.hash(_0x57940d.number_of_seasons ? _0x57940d.original_name : _0x57940d.original_title),
            _0x4fa4a1 = Lampa.Storage.get("clarification_search", "{}");
          Lampa.Activity.push({
            "url": "",
            "title": Lampa.Lang.translate("title_online"),
            "component": "cinema_online",
            "search": _0x4fa4a1[_0x37e8cd] ? _0x4fa4a1[_0x37e8cd] : _0x57940d.title,
            "search_one": _0x57940d.title,
            "search_two": _0x57940d.original_title,
            "movie": _0x57940d,
            "page": 1,
            "clarification": _0x4fa4a1[_0x37e8cd] ? true : false
          });
        }
      };
      _0xfe99a9("Cinema", "spider");
      _0xfe99a9("Cinema - Anime", "spider/anime");
      Lampa.Manifest.plugins = _0x51e5e4;
      Lampa.Lang.add({
        "lampac_watch": {
          "ru": "Смотреть онлайн",
          "en": "Watch online",
          "uk": "Дивитися онлайн",
          "zh": "在线观看"
        },
        "lampac_video": {
          "ru": "Видео",
          "en": "Video",
          "uk": "Відео",
          "zh": "视频"
        },
        "lampac_no_watch_history": {
          "ru": "Нет истории просмотра",
          "en": "No browsing history",
          "ua": "Немає історії перегляду",
          "zh": "没有浏览历史"
        },
        "lampac_nolink": {
          "ru": "Не удалось извлечь ссылку",
          "uk": "Неможливо отримати посилання",
          "en": "Failed to fetch link",
          "zh": "获取链接失败"
        },
        "lampac_balanser": {
          "ru": "Источник",
          "uk": "Джерело",
          "en": "Source",
          "zh": "来源"
        },
        "helper_online_file": {
          "ru": "Удерживайте клавишу \"ОК\" для вызова контекстного меню",
          "uk": "Утримуйте клавишу \"ОК\" для вызова контекстного меню",
          "en": "Hold the \"OK\" key to bring up the context menu",
          "zh": "按住\"确定\"键调出上下文菜单"
        },
        "title_online": {
          "ru": "Онлайн",
          "uk": "Онлайн",
          "en": "Online",
          "zh": "在线的"
        },
        "lampac_voice_subscribe": {
          "ru": "Подписаться на перевод",
          "uk": "Підписатися на переклад",
          "en": "Subscribe to translation",
          "zh": "订阅翻译"
        },
        "lampac_voice_success": {
          "ru": "Вы успешно подписались",
          "uk": "Ви успішно підписалися",
          "en": "You have successfully subscribed",
          "zh": "您已成功订阅"
        },
        "lampac_voice_error": {
          "ru": "Возникла ошибка",
          "uk": "Виникала помилка",
          "en": "An error has occurred",
          "zh": "发生了错误"
        },
        "lampac_clear_all_marks": {
          "ru": "Очистить все метки",
          "uk": "Очистити всі мітки",
          "en": "Clear all labels",
          "zh": "清除所有标签"
        },
        "lampac_clear_all_timecodes": {
          "ru": "Очистить все тайм-коды",
          "uk": "Очистити всі тайм-коди",
          "en": "Clear all timecodes",
          "zh": "清除所有时间代码"
        },
        "lampac_change_balanser": {
          "ru": "Изменить балансер",
          "uk": "Змінити балансер",
          "en": "Change balancer",
          "zh": "更改平衡器"
        },
        "lampac_balanser_dont_work": {
          "ru": "Поиск на ({balanser}) не дал результатов",
          "uk": "Пошук на ({balanser}) не дав результатів",
          "en": "Search on ({balanser}) did not return any results",
          "zh": "搜索 ({balanser}) 未返回 any 结果"
        },
        "lampac_balanser_timeout": {
          "ru": "Источник будет переключен автоматически через <span class=\"timeout\">10</span> секунд.",
          "uk": "Джерело буде автоматично переключено через <span class=\"timeout\">10</span> секунд.",
          "en": "The source will be switched automatically after <span class=\"timeout\">10</span> seconds.",
          "zh": "平衡器将在<span class=\"timeout\">10</span>秒内自动切换。"
        },
        "lampac_does_not_answer_text": {
          "ru": "Поиск на ({balanser}) не дал результатов",
          "uk": "Пошук на ({balanser}) не дав результатів",
          "en": "Search on ({balanser}) did not return any results",
          "zh": "搜索 ({balanser}) 未返回 any 结果"
        }
      });
      Lampa.Template.add("lampac_css", "\n        <style>\n        @charset 'UTF-8';.online-prestige{position:relative;-webkit-border-radius:.3em;border-radius:.3em;background-color:rgba(0,0,0,0.3);display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}.online-prestige__body{padding:1.2em;line-height:1.3;-webkit-box-flex:1;-webkit-flex-grow:1;-moz-box-flex:1;-ms-flex-positive:1;flex-grow:1;position:relative}@media screen and (max-width:480px){.online-prestige__body{padding:.8em 1.2em}}.online-prestige__img{position:relative;width:13em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;min-height:8.2em}.online-prestige__img>img{position:absolute;top:0;left:0;width:100%;height:100%;-o-object-fit:cover;object-fit:cover;-webkit-border-radius:.3em;border-radius:.3em;opacity:0;-webkit-transition:opacity .3s;-o-transition:opacity .3s;-moz-transition:opacity .3s;transition:opacity .3s}.online-prestige__img--loaded>img{opacity:1}@media screen and (max-width:480px){.online-prestige__img{width:7em;min-height:6em}}.online-prestige__folder{padding:1em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0}.online-prestige__folder>svg{width:4.4em !important;height:4.4em !important}.online-prestige__viewed{position:absolute;top:1em;left:1em;background:rgba(0,0,0,0.45);-webkit-border-radius:100%;border-radius:100%;padding:.25em;font-size:.76em}.online-prestige__viewed>svg{width:1.5em !important;height:1.5em !important}.online-prestige__episode-number{position:absolute;top:0;left:0;right:0;bottom:0;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;font-size:2em}.online-prestige__loader{position:absolute;top:50%;left:50%;width:2em;height:2em;margin-left:-1em;margin-top:-1em;background:url(./img/loader.svg) no-repeat center center;-webkit-background-size:contain;-o-background-size:contain;background-size:contain}.online-prestige__head,.online-prestige__footer{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-moz-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.online-prestige__timeline{margin:.8em 0}.online-prestige__timeline>.time-line{display:block !important}.online-prestige__title{font-size:1.7em;overflow:hidden;-o-text-overflow:ellipsis;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:1;line-clamp:1;-webkit-box-orient:vertical}@media screen and (max-width:480px){.online-prestige__title{font-size:1.4em}}.online-prestige__time{padding-left:2em}.online-prestige__info{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.online-prestige__info>*{overflow:hidden;-o-text-overflow:ellipsis;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:1;line-clamp:1;-webkit-box-orient:vertical}.online-prestige__quality{padding-left:1em;white-space:nowrap}.online-prestige__scan-file{position:absolute;bottom:0;left:0;right:0}.online-prestige__scan-file .broadcast__scan{margin:0}.online-prestige .online-prestige-split{font-size:.8em;margin:0 1em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0}.online-prestige.focus::after{content:'';position:absolute;top:-0.6em;left:-0.6em;right:-0.6em;bottom:-0.6em;-webkit-border-radius:.7em;border-radius:.7em;border:solid .3em #fff;z-index:-1;pointer-events:none}.online-prestige+.online-prestige{margin-top:1.5em}.online-prestige--folder .online-prestige__footer{margin-top:.8em}.online-prestige-watched{padding:1em}.online-prestige-watched__icon>svg{width:1.5em;height:1.5em}.online-prestige-watched__body{padding-left:1em;padding-top:.1em;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap}.online-prestige-watched__body>span+span::before{content:' ● ';vertical-align:top;display:inline-block;margin:0 .5em}.online-prestige-rate{display:-webkit-inline-box;display:-webkit-inline-flex;display:-moz-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.online-prestige-rate>svg{width:1.3em !important;height:1.3em !important}.online-prestige-rate>span{font-weight:600;font-size:1.1em;padding-left:.7em}.online-empty{line-height:1.4}.online-empty__title{font-size:1.8em;margin-bottom:.3em}.online-empty__time{font-size:1.2em;font-weight:300;margin-bottom:1.6em}.online-empty__buttons{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}.online-empty__buttons>*+*{margin-left:1em}.online-empty__button{background:rgba(0,0,0,0.3);font-size:1.2em;padding:.5em 1.2em;-webkit-border-radius:.2em;border-radius:.2em;margin-bottom:2.4em}.online-empty__button.focus{background:#fff;color:black}.online-empty__templates .online-empty-template:nth-child(2){opacity:.5}.online-empty__templates .online-empty-template:nth-child(3){opacity:.2}.online-empty-template{background-color:rgba(255,255,255,0.3);padding:1em;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-border-radius:.3em;border-radius:.3em}.online-empty-template>*{background:rgba(0,0,0,0.3);-webkit-border-radius:.3em;border-radius:.3em}.online-empty-template__ico{width:4em;height:4em;margin-right:2.4em}.online-empty-template__body{height:1.7em;width:70%}.online-empty-template+.online-empty-template{margin-top:1em}\n        </style>\n    ");
      $("body").append(Lampa.Template.get("lampac_css", {}, true));

      function _0x3cd3c3() {
        Lampa.Template.add("lampac_prestige_full", "<div class=\"online-prestige online-prestige--full selector\">\n            <div class=\"online-prestige__img\">\n                <img alt=\"\">\n                <div class=\"online-prestige__loader\"></div>\n            </div>\n            <div class=\"online-prestige__body\">\n                <div class=\"online-prestige__head\">\n                    <div class=\"online-prestige__title\">{title}</div>\n                    <div class=\"online-prestige__time\">{time}</div>\n                </div>\n\n                <div class=\"online-prestige__timeline\"></div>\n\n                <div class=\"online-prestige__footer\">\n                    <div class=\"online-prestige__info\">{info}</div>\n                    <div class=\"online-prestige__quality\">{quality}</div>\n                </div>\n            </div>\n        </div>");
        Lampa.Template.add("lampac_content_loading", "<div class=\"online-empty\">\n            <div class=\"broadcast__scan\"><div></div></div>\n\t\t\t\n            <div class=\"online-empty__templates\">\n                <div class=\"online-empty-template selector\">\n                    <div class=\"online-empty-template__ico\"></div>\n                    <div class=\"online-empty-template__body\"></div>\n                </div>\n                <div class=\"online-empty-template\">\n                    <div class=\"online-empty-template__ico\"></div>\n                    <div class=\"online-empty-template__body\"></div>\n                </div>\n                <div class=\"online-empty-template\">\n                    <div class=\"online-empty-template__ico\"></div>\n                    <div class=\"online-empty-template__body\"></div>\n                </div>\n            </div>\n        </div>");
        Lampa.Template.add("lampac_does_not_answer", "<div class=\"online-empty\">\n            <div class=\"online-empty__title\">\n                #{lampac_balanser_dont_work}\n            </div>\n            <div class=\"online-empty__time\">\n                #{lampac_balanser_timeout}\n            </div>\n            <div class=\"online-empty__buttons\">\n                <div class=\"online-empty__button selector cancel\">#{cancel}</div>\n                <div class=\"online-empty__button selector change\">#{lampac_change_balanser}</div>\n            </div>\n            <div class=\"online-empty__templates\">\n                <div class=\"online-empty-template\">\n                    <div class=\"online-empty-template__ico\"></div>\n                    <div class=\"online-empty-template__body\"></div>\n                </div>\n                <div class=\"online-empty-template\">\n                    <div class=\"online-empty-template__ico\"></div>\n                    <div class=\"online-empty-template__body\"></div>\n                </div>\n                <div class=\"online-empty-template\">\n                    <div class=\"online-empty-template__ico\"></div>\n                    <div class=\"online-empty-template__body\"></div>\n                </div>\n            </div>\n        </div>");
        Lampa.Template.add("lampac_prestige_rate", "<div class=\"online-prestige-rate\">\n            <svg width=\"17\" height=\"16\" viewBox=\"0 0 17 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                <path d=\"M8.39409 0.192139L10.99 5.30994L16.7882 6.20387L12.5475 10.4277L13.5819 15.9311L8.39409 13.2425L3.20626 15.9311L4.24065 10.4277L0 6.20387L5.79819 5.30994L8.39409 0.192139Z\" fill=\"#fff\"></path>\n            </svg>\n            <span>{rate}</span>\n        </div>");
        Lampa.Template.add("lampac_prestige_folder", "<div class=\"online-prestige online-prestige--folder selector\">\n            <div class=\"online-prestige__folder\">\n                <svg viewBox=\"0 0 128 112\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <rect y=\"20\" width=\"128\" height=\"92\" rx=\"13\" fill=\"white\"></rect>\n                    <path d=\"M29.9963 8H98.0037C96.0446 3.3021 91.4079 0 86 0H42C36.5921 0 31.9555 3.3021 29.9963 8Z\" fill=\"white\" fill-opacity=\"0.23\"></path>\n                    <rect x=\"11\" y=\"8\" width=\"106\" height=\"76\" rx=\"13\" fill=\"white\" fill-opacity=\"0.51\"></rect>\n                </svg>\n            </div>\n            <div class=\"online-prestige__body\">\n                <div class=\"online-prestige__head\">\n                    <div class=\"online-prestige__title\">{title}</div>\n                    <div class=\"online-prestige__time\">{time}</div>\n                </div>\n\n                <div class=\"online-prestige__footer\">\n                    <div class=\"online-prestige__info\">{info}</div>\n                </div>\n            </div>\n        </div>");
        Lampa.Template.add("lampac_prestige_watched", "<div class=\"online-prestige online-prestige-watched selector\">\n            <div class=\"online-prestige-watched__icon\">\n                <svg width=\"21\" height=\"21\" viewBox=\"0 0 21 21\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <circle cx=\"10.5\" cy=\"10.5\" r=\"9\" stroke=\"currentColor\" stroke-width=\"3\"/>\n                    <path d=\"M14.8477 10.5628L8.20312 14.399L8.20313 6.72656L14.8477 10.5628Z\" fill=\"currentColor\"/>\n                </svg>\n            </div>\n            <div class=\"online-prestige-watched__body\">\n                \n            </div>\n        </div>");
      }

      var _0x198427 = "<div class=\"full-start__button selector cinema--online lampac--button\" data-subtitle=\"".concat(_0x51e5e4.name, " v").concat(_0x51e5e4.version, "\">\n        <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"28\" height=\"29\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M11.585.031c-.342.087-.603.22-.94.478c-.354.273-.644.582-1.038 1.11c-.748 1.01-1.475 2.337-2.332 4.265c-.105.236-.198.43-.205.43a10 10 0 0 1-.211-.655c-.442-1.47-.77-2.426-1.095-3.196C5.254 1.25 4.793.638 4.234.43a1.25 1.25 0 0 0-.795.007c-.565.23-.985.838-1.318 1.914c-.522 1.676-.96 4.53-1.472 9.6c-.478 4.69-.675 7.526-.646 9.257c.012.835.045 1.181.15 1.62c.187.792.622 1.206 1.225 1.163c.159-.013.216-.03.392-.134c.173-.102.247-.17.434-.391c.504-.602.976-1.62 1.952-4.22c.364-.967 1.967-5.397 1.967-5.434c0-.026-.703-2.417-.822-2.8l-.04-.123l-.034.076c-.064.143-.72 1.934-1.448 3.952c-1 2.772-1.577 4.32-1.884 5.06l-.097.239l.012-.267c.01-.146.026-.495.038-.773c.086-1.766.33-4.554.703-8.068c.375-3.536.708-5.842 1.043-7.227c.1-.414.26-.959.294-1.004c.024-.027.233.424.404.871c.356.934.636 1.816 1.515 4.774c1.083 3.651 1.627 5.265 2.325 6.901c.61 1.436 1.104 2.305 1.72 3.036c.432.512.84.835 1.294 1.029a2.03 2.03 0 0 0 1.626.017c1.385-.557 2.565-2.553 3.971-6.719c.378-1.122.691-2.122 1.35-4.32c.911-3.045 1.313-4.251 1.7-5.128a7 7 0 0 1 .211-.447l.057-.098l.038.11c.33.916.663 2.636.971 5.02c.333 2.552.81 7.354.988 9.89c.057.818.12 1.976.117 2.192v.155l-.074-.169c-.235-.534-.779-1.999-1.9-5.102c-.869-2.404-1.484-4.076-1.515-4.113c-.011-.013-.029.014-.043.057c-.574 1.9-.836 2.777-.836 2.81c0 .04.976 2.756 1.686 4.69c.606 1.647 1.152 3.041 1.416 3.618c.349.764.605 1.206.888 1.543c.164.194.242.264.413.365c.376.213.704.16.97.007c.84-.495.985-1.903.66-6.39c-.164-2.229-.523-5.94-.834-8.602c-.494-4.228-1.017-6.645-1.66-7.671c-.254-.408-.601-.7-.938-.793a1.44 1.44 0 0 0-.668.017c-.876.298-1.548 1.546-2.557 4.75c-.136.434-.262.836-.276.892c-.016.059-.038.107-.045.107c-.01 0-.073-.13-.145-.29C15.516 3.2 14.494 1.523 13.542.677c-.278-.247-.729-.52-.995-.604c-.245-.076-.739-.098-.962-.04zm.682 2.15c.726.38 1.918 2.452 3.322 5.778l.44 1.04l-.345 1.099c-.639 2.046-1.05 3.227-1.534 4.382c-.672 1.605-1.316 2.657-1.812 2.958a.73.73 0 0 1-.615.042c-.798-.335-1.798-2.198-2.881-5.375a77 77 0 0 1-.805-2.51l-.135-.442l.346-.837c1.344-3.239 2.541-5.417 3.297-6.008c.273-.213.484-.25.722-.126Z\"/></svg>\n\n        <span>#{title_online}</span>\n    </div>";
      Lampa.Component.add("cinema_online", _0x4cd5d3);
      _0x3cd3c3();

      function _0x5afe35(_0x3f7cfd) {
        if (_0x3f7cfd.render.find(".lampac--button").length) return;
        var _0x33dd67 = $(Lampa.Lang.translate(_0x198427));
        _0x33dd67.on("hover:enter", function () {
          _0x3cd3c3();
          Lampa.Component.add("cinema_online", _0x4cd5d3);
          var _0x44e7f4 = Lampa.Utils.hash(_0x3f7cfd.movie.number_of_seasons ? _0x3f7cfd.movie.original_name : _0x3f7cfd.movie.original_title),
            _0x599b28 = Lampa.Storage.get("clarification_search", "{}");
          Lampa.Activity.push({
            "url": "",
            "title": Lampa.Lang.translate("title_online"),
            "component": "cinema_online",
            "search": _0x599b28[_0x44e7f4] ? _0x599b28[_0x44e7f4] : _0x3f7cfd.movie.title,
            "search_one": _0x3f7cfd.movie.title,
            "search_two": _0x3f7cfd.movie.original_title,
            "movie": _0x3f7cfd.movie,
            "page": 1,
            "clarification": _0x599b28[_0x44e7f4] ? true : false
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

      if (Lampa.Manifest.app_digital >= 177) {
        var _0x45e7ce = ["mirkino", "filmix", "filmixtv", "fxapi", "rezka", "pizdatoehd", "getstv", "kinopub", "zetflixdb", "collaps", "hdvb", "kodik", "bamboo", "eneyida", "kinoukr", "uafilm", "uakino", "kinotochka", "remux", "anilibria", "animedia", "animego", "animevost", "animebesst", "alloha", "mirage", "phantom", "animelib", "moonanime", "vibix", "fancdn", "cdnvideohub", "vokino", "hydraflix", "videasy", "vidsrc", "movpi", "vidlink", "smashystream", "autoembed", "pidtor", "videoseed", "iptvonline", "veoveo", "kinoflix", "leproduction", "vkmovie", "videoseed", "veoveo", "kinogo", "kinobase", "fancdn", "asiage", "geosaitebi", "mikai", "dreamerscast"];
        _0x45e7ce.forEach(function (_0xd5a4cf) {
          Lampa.Storage.sync("online_choice_" + _0xd5a4cf, "object_object");
        });
        Lampa.Storage.sync("online_watched_last", "object_object");
      }
    }

    if (!window.lampac_plugin) _0x3763c5();
  })();
})();
