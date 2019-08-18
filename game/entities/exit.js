define('game/entities/exit', [
    'game/globals',

    'engine/core/entity',

    'game/components/transform',
    'game/components/hitbox',
    'game/components/collider'
], function (
    G,

    Entity,

    Transform,
    Hitbox,
    Collider
) {
    "use strict";
    //declaring in the define would create a circular dependency. Navigation->Level->Exit->Navigation
    let Navigation;
    require(['game/managers/navigation'], function (N) {
        Navigation = N;
    });

    return function (settings) {
        settings = settings || {};

        let _targetMap = settings.targetMap;
        if (!_targetMap) throw "exit has no target map defined";
        let _targetSpawnKey = settings.targetSpawnKey;
        if (!_targetSpawnKey) {
            console.warn("exit has no target spawn key defined. Falling back to 'default', but this can have unexpected results");
            _targetSpawnKey = 'default';
        }

        let exit = new Entity({
            z: 1,
            priority: 100,
            name: 'exit'
        });
        exit.addTag('removeOnLevelExit');

        let transform = exit.addComponent(new Transform(settings.x, settings.y));
        let hitbox = exit.addComponent(new Hitbox(0, 0, settings.width, settings.height));
        let collider = exit.addComponent(new Collider());

        collider.addTag(G.CollisionTags.EXIT);
        collider.addCheck(G.CollisionTags.PLAYER);

        exit.on('collision', function (data) {
            if (data.otherEntity.name !== 'player') return;

            Navigation.warpTo(_targetMap, _targetSpawnKey);
        });

        return exit;
    };
});