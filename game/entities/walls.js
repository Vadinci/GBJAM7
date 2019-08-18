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

        let walls = new Entity({
            z: 1,
            priority: 100,
            name: 'walls'
        });
        walls.addTag('removeOnLevelExit');

        let transform = walls.addComponent(new Transform(settings.x, settings.y));
        let solidGrid = walls.addComponent(new SolidGrid({
            width: settings.width,
            height: settings.height
        }));

        return walls;
    };
});