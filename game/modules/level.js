define('game/modules/level', [
    'engine/core',

    'game/globals',

    'game/modules/tiledmap',

    'game/entities/tilelayer',
    'game/entities/walls',
    'game/entities/player',
    'game/entities/cameracontroller',

    'game/managers/camera'
], function (
    Core,

    G,

    TiledMap,

    TileLayer,
    Walls,
    Player,
    CameraController,

    Camera
) {
    "use strict";
    return function (key) {
        let _map = new TiledMap('levels/' + key);

        let _spawns = {};

        let _player;

        let _findSpawns = function () {
            let spawnData = _map.getObjectLayer('spawns');
            for (let ii = 0; ii < spawnData.length; ii++) {
                let data = spawnData[ii];

                if (data.type !== 'spawn') {
                    console.warn('non spawn object in the spawn layer');
                    continue;
                }

                let key = data.properties.key || 'default';
                _spawns[key] = {
                    x: data.x,
                    y: data.y
                };

                if (!_spawns['default']) {
                    _spawns['default'] = {
                        x: data.x,
                        y: data.y
                    };
                }
            }
        };

        let getSpawn = function (key) {
            if (_spawns[key]) {
                return {
                    x: _spawns[key].x,
                    y: _spawns[key].y
                };
            }
            return undefined;
        };

        let getAllSpawns = function () {
            let result = {};
            for (let key in _spawns) {
                result[key] = {
                    x: _spawns[key].x,
                    y: _spawns[key].y
                }
            }
            return result;
        };

        let init = function (spawnKey) {
            _findSpawns();
            spawnKey = spawnKey || 'default';

            Camera.setBounds(0, 0, _map.width * G.TILE_SIZE, _map.height * G.TILE_SIZE);

            Core.add(new Walls({
                map: _map
            }));

            Core.add(new TileLayer({
                map: _map
            }));

            _player = new Player({
                x: (getSpawn(spawnKey) || getSpawn('default')).x,
                y: (getSpawn(spawnKey) || getSpawn('default')).y - 1,
            });
            Core.add(_player);

            Core.add(new CameraController({
                player: _player
            }));
        };

        let clear = function () {
            let entities = Core.engine.getByTags('level');
            entities.forEach(e => Core.remove(e));
        };

        let self = {
            init: init,
            clear: clear,

            getSpawn: getSpawn,
            getAllSpawns: getAllSpawns
        };

        return self;
    };
});