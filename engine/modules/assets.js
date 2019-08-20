define('engine/modules/assets', [
    'engine/core/dispatcher',
    'engine/core/texture',

    'lib/js-yaml.min'
], function (
    Dispatcher,
    Texture,

    YAML
) {
    "use strict"
    let dispatcher = new Dispatcher();

    let _textureCache = {};
    let _soundCache = {};
    let _jsonCache = {};
    let _yamlCache = {};

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

    let _loadPlainText = function (path, onComplete, onError) {
        let xhr = new window.XMLHttpRequest();
        if (xhr.overrideMimeType) {
            xhr.overrideMimeType('application/json');
        }
        xhr.open('GET', path, true);

        onError = onError || function (e) {
            console.error(e);
        };

        xhr.onerror = e => onError('Error: loading file ' + path);
        xhr.ontimeout = e => onError('Timeout: loading file ' + path);

        xhr.onreadystatechange = function () {
            let response;
            if (xhr.readyState === 4) {
                if ((xhr.status === 304) || (xhr.status === 200) || ((xhr.status === 0) && xhr.responseText)) {
                    onComplete(xhr.responseText);
                } else {
                    onError('Error: State ' + xhr.readyState + ' ' + path);
                }
            }
        };
        xhr.send(null);
    };


    let getJson = function (name) {
        return _jsonCache[name];
    };

    let loadJson = function (path, name) {
        name = name || path.replace('.json', '');
        if (path.indexOf('.json') === -1) {
            path = path + '.json';
        }

        _loadPlainText(path, data => {
            let jsonData = JSON.parse(data);
            _jsonCache[name] = jsonData;
            _assetsRemaining--;
            dispatcher.emit('jsonLoaded', jsonData);

            if (_assetsRemaining === 0) {
                dispatcher.emit('loadingComplete');
            }
        });

        _assetsRemaining++;


    };

    let loadJsons = function (paths) {
        paths = [].concat(paths);

        for (let ii = 0; ii < paths.length; ii++) {
            loadJson(paths[ii]);
        }
    };


    let getYaml = function (name) {
        return _yamlCache[name];
    };

    let loadYaml = function (path, name) {
        name = name || path.replace('.yaml', '');
        if (path.indexOf('.yaml') === -1) {
            path = path + '.yaml';
        }

        _loadPlainText(path, data => {
            let yamlData = YAML.load(data);
            _yamlCache[name] = yamlData;
            _assetsRemaining--;
            dispatcher.emit('yamlLoaded', yamlData);

            if (_assetsRemaining === 0) {
                dispatcher.emit('loadingComplete');
            }
        });

        _assetsRemaining++;


    };

    let loadYamls = function (paths) {
        paths = [].concat(paths);

        for (let ii = 0; ii < paths.length; ii++) {
            loadYaml(paths[ii]);
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

        getYaml: getYaml,
        loadYaml: loadYaml,
        loadYamls: loadYamls,

        on: dispatcher.on,
        off: dispatcher.off
    };
    return module;
});