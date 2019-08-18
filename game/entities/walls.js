define('game/entities/walls', [
    'engine/core/entity',

    'game/components/transform',
    'game/components/solidgrid'
], function (
    Entity,

    Transform,
    SolidGrid
) {
    "use strict";
    return function (settings) {
        settings = settings || {};

        let map = settings.map;
        if (!map) throw "walls entity needs a map";

        let walls = new Entity({
            z: 1,
            priority: 100,
            name: 'walls'
        });
        walls.addTag('removeOnLevelExit');

        let transform = walls.addComponent(new Transform(settings.x, settings.y));
        let solidGrid = walls.addComponent(new SolidGrid({
            width: map.width,
            height: map.height
        }));

        let collisionLayer = map.getTileLayer('collision');
        for (let ix = 0; ix < map.width; ix++) {
            for (let iy = 0; iy < map.height; iy++) {
                if (!collisionLayer[ix][iy]) continue;
                solidGrid.setSolid(ix, iy, true);
            }
        }

        return walls;
    };
});