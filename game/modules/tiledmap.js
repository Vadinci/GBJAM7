define('game/modules/tiledmap', [
    'engine/core'
], function (
    Core
) {
    'use strict';
    return function (key) {

        let _mapData;

        let _tilesets = [];

        let _parseTileSets = function () {
            for (let ii = 0; ii < _mapData.tilesets.length; ii++) {
                let set = _mapData.tilesets[ii];
                let sourceName = set.source || set.image
                let setName = sourceName.split('\/').pop();
                setName = setName.substr(0, setName.indexOf('.tsx'));

                let tileset = {
                    firstGID: set.firstgid,
                    name: setName
                }
                _tilesets.push(tileset);
            }

            _tilesets.sort(function (a, b) {
                return a.firstGID - b.firstgid;
            });
        };

        let _parseTile = function (id) {
            let set = -1;
            while (
                set < _tilesets.length - 1 &&
                id >= _tilesets[set + 1].firstGID
            ) {
                set++;
            }

            return {
                id: id,
                idInSet: id - _tilesets[set].firstGID,
                setName: _tilesets[set].name
            };
        };

        let _parseObject = function (obj) {
            let objData = {};

            objData.name = obj.name || "object";

            objData.type = obj.type;
            objData.x = obj.x;
            objData.y = obj.y;
            objData.width = obj.width;
            objData.height = obj.height;
            objData.col = Math.floor(obj.x / _mapData.tilewidth);
            //for whatever reason, tiled sets the origin of objects on the bottom of their sprite
            //this causes an obj snapped to ,for example, row 1 to have a y coordinate of 96
            objData.row = Math.floor((obj.y - 0.01) / _mapData.tileheight);

            objData.properties = obj.properties || {};

            return objData;
        };


        let load = function (key) {
            _mapData = Core.assets.getJson(key);
            _parseTileSets();
        };

        let _getLayer = function (key) {
            for (let ii = 0; ii < _mapData.layers.length; ii++) {
                if (_mapData.layers[ii].name === key) {
                    return _mapData.layers[ii];
                }
            }
            if (Utils.isDev()) {
                console.error("layer named " + key + " couldn't be found");
            }
            return undefined;
        };

        let getTileLayer = function (key) {
            let layer = _getLayer(key);
            if (!layer) {
                return [
                    [undefined]
                ];
            }

            let width = layer.width;
            let height = layer.height;

            let tiles = [];

            for (let ix = 0; ix < width; ix++) {
                tiles[ix] = [];
                for (let iy = 0; iy < height; iy++) {
                    tiles[ix][iy] = undefined;

                    let idx = ix + iy * width;
                    if (layer.data[idx] !== 0) {
                        tiles[ix][iy] = _parseTile(layer.data[idx]);
                    }
                }
            }

            return tiles;
        };

        let getObjectLayer = function (key) {
            let layer = _getLayer(key);
            if (!layer) {
                return [];
            }

            let objects = [];

            for (let ii = 0; ii < layer.objects.length; ii++) {
                let obj = layer.objects[ii];
                objects.push(_parseObject(obj));
            }

            return objects;
        };

        let self = {
            load: load,

            getTileLayer: getTileLayer,
            getObjectLayer: getObjectLayer
        };

        Object.defineProperties(self, {
            width: {
                get: function () { return _mapData ? _mapData.width : 0; }
            },
            height: {
                get: function () { return _mapData ? _mapData.height : 0; }
            }
        })

        if (key) {
            load(key);
        }

        return self;
    };
});