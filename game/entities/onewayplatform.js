define('game/entities/onewayplatform', [
    'engine/core/entity',

    'game/components/transform',
    'game/components/hitbox',
    'game/components/onewaysolid'
], function (
    Entity,

    Transform,
    Hitbox,
    OneWaySolid
) {
    "use strict";
    return function (settings) {
        settings = settings || {};

        let oneWayPlatform = new Entity({
            z: 1,
            priority: 100,
            name: 'oneWayPlatform'
        });
        oneWayPlatform.addTag('removeOnLevelExit');

        let transform = oneWayPlatform.addComponent(new Transform(settings.x, settings.y));
        let hitbox = oneWayPlatform.addComponent(new Hitbox(0, -1, 16, 4));
        let oneWaySolid = oneWayPlatform.addComponent(new OneWaySolid({}));

        hitbox.debugColor = '#52a';

        return oneWayPlatform;
    };
});