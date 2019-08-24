define('game/modules/level', [
    'engine/core',

    'game/globals',

    'game/modules/tiledmap',

    'game/entities/tilelayer',
    'game/entities/walls',
    'game/entities/onewayplatform',
    'game/entities/player',
    'game/entities/cameracontroller',
    'game/entities/exit',

    'game/managers/camera'
], function (
    Core,

    G,

    TiledMap,

    TileLayer,
    Walls,
    OneWayPlatform,
    Player,
    CameraController,
    Exit,

    Camera
) {
    "use strict";
    let _enemyCache = {};

    return function (key) {
        let _map = new TiledMap('levels/' + key);

        let _spawns = {};

        let _player;

        let _findSpawns = function () {
            let spawnData = _map.getObjectLayer('spawns');
            if (!spawnData) return;

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

        let _createExits = function () {
            let exitData = _map.getObjectLayer('exits');
            if (!exitData) return;

            for (let ii = 0; ii < exitData.length; ii++) {
                let data = exitData[ii];

                if (data.type !== 'exit') {
                    console.warn('non exit object in the exit layer');
                    continue;
                }

                let exit = new Exit({
                    x: data.x,
                    y: data.y,
                    width: data.width,
                    height: data.height,

                    targetMap: data.properties.map,
                    targetSpawnKey: data.properties.spawnPoint,
                    manual: data.properties.manual || false,
                    direction: data.properties.direction || 1
                });
                Core.add(exit);
            }
        };

        let _spawnEnemies = function () {
            let enemyData = _map.getObjectLayer('enemies');
            if (!enemyData) return;

            for (let ii = 0; ii < enemyData.length; ii++) {
                let data = enemyData[ii];
                let key;
                switch (data.idInSet) {
                    case 0: //slime
                        key = 'slime';
                        break;
                    case 1: //bird
                        key = 'bird';
                        break;
                    case 2: //shield gob
                        break;
                    case 3: //sword gob
                        break;
                }
                data.x += 8;
                if (_enemyCache[key]) {
                    let K = _enemyCache[key];
                    Core.add(new K(data));
                } else {
                    require(['game/entities/enemies/' + key], function (K) {
                        _enemyCache[key] = K;
                        Core.add(new K(data));
                    });
                }
            }
        };

        let _createLevelGeometry = function () {
            let walls = new Walls({
                width: _map.width + 2,
                height: _map.height + 2,
                x: -16,
                y: -16
            });
            let wallGrid = walls.getComponent('solidGrid');
            Core.add(walls);

            let collisionLayer = _map.getTileLayer('collision');
            for (let ix = 0; ix < _map.width; ix++) {
                for (let iy = 0; iy < _map.height; iy++) {
                    if (!collisionLayer[ix][iy]) continue;
                    switch (collisionLayer[ix][iy].idInSet) {
                        case 0:
                            wallGrid.setSolid(ix + 1, iy + 1, true);
                            break;
                        case 1:
                            Core.add(new OneWayPlatform({
                                x: ix * G.TILE_SIZE,
                                y: iy * G.TILE_SIZE
                            }));
                            break;
                    }
                }
            }
            for (let ix = 0; ix < _map.width + 2; ix++) {
                wallGrid.setSolid(ix + 1, 0, true);
                wallGrid.setSolid(ix + 1, _map.height + 1, true);
            }
            for (let iy = 0; iy < _map.height + 2; iy++) {
                wallGrid.setSolid(0, iy + 1, true);
                wallGrid.setSolid(_map.width + 1, iy + 1, true);
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

            _createLevelGeometry();

            Core.add(new TileLayer({
                map: _map
            }));

            let spawnX = (getSpawn(spawnKey) || getSpawn('default')).x;
            let spawnY = (getSpawn(spawnKey) || getSpawn('default')).y - 1;

            _player = new Player({
                x: spawnX,
                y: spawnY,
            });
            Core.add(_player);

            Camera.moveTo(spawnX - 80, spawnY - 72);

            Core.add(new CameraController({
                player: _player
            }));

            _createExits();

            _spawnEnemies();
        };

        let clear = function () {
            let entities = Core.engine.getByTags('removeOnLevelExit');
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