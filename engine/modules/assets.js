define('engine/modules/assets', [
    'engine/core/dispatcher',
    'engine/core/texture'
], function (
    Dispatcher,
    Texture
) {
    "use strict"
    let dispatcher = new Dispatcher();

    let _textureCache = {};
    let _soundCache = {};
    let _jsonCache = {};

    let _assetsRemaining = 0;

    let getTexture = function (name) {
        return _textureCache[name];
    };

    let loadTexture = function (path, name) {
        name = name || path.replace('.png', '');
        if (path.indexOf('.png') === -1) {
            path = path + '.png';
        }

        _assetsRemaining++;
        Texture.load(path, data => {
            _textureCache[name] = data.texture;
            _assetsRemaining--;

            dispatcher.emit('textureLoaded', data.texture);

            if (_assetsRemaining === 0) {
                dispatcher.emit('loadingComplete');
            }
        });
    };

    let loadTextures = function (paths) {
        paths = [].concat(paths);

        for (let ii = 0; ii < paths.length; ii++) {
            loadTexture(paths[ii]);
        }
    };

    let getJson = function (name) {
        return _jsonCache[name];
    };

    let loadJson = function (path, name) {
        name = name || path.replace('.json', '');
        if (path.indexOf('.json') === -1) {
            path = path + '.json';
        }

        _assetsRemaining++;

        let xhr = new window.XMLHttpRequest();
        if (xhr.overrideMimeType) {
            xhr.overrideMimeType('application/json');
        }
        xhr.open('GET', path, true);
        xhr.onerror = e => console.error('Error: loading JSON ' + source);
        xhr.ontimeout = e => console.error('Timeout: loading JSON ' + source);

        xhr.onreadystatechange = function () {
            let response;
            if (xhr.readyState === 4) {
                if ((xhr.status === 304) || (xhr.status === 200) || ((xhr.status === 0) && xhr.responseText)) {
                    response = xhr.responseText;
                    let jsonData = JSON.parse(response);
                    _jsonCache[name] = jsonData;
                    _assetsRemaining--;
                    dispatcher.emit('jsonLoaded', jsonData);

                    if (_assetsRemaining === 0) {
                        dispatcher.emit('loadingComplete');
                    }
                } else {
                    callback('Error: State ' + xhr.readyState + ' ' + source);
                }
            }
        };
        xhr.send(null);
    };

    let loadJsons = function (paths) {
        paths = [].concat(paths);

        for (let ii = 0; ii < paths.length; ii++) {
            loadJson(paths[ii]);
        }
    };

    let module = {
        getTexture: getTexture,
        loadTexture: loadTexture,
        loadTextures: loadTextures,

        getSound: () => undefined,
        loadSound: () => undefined,
        loadSounds: () => undefined,

        getJson: getJson,
        loadJson: loadJson,
        loadJsons: loadJsons,

        on: dispatcher.on,
        off: dispatcher.off
    };
    return module;
});