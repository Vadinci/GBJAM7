define('game/entities/exit', [
    'game/globals',
    'game/utils',

    'engine/core',
    'engine/core/entity',

    'game/components/transform',
    'game/components/hitbox',
    'game/components/collider'
], function (
    G,
    Utils,

    Core,
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

        let _manual = settings.manual;
        let _direction = settings.direction || 1;

        let exit = new Entity({
            z: 1,
            priority: 100,
            name: 'exit'
        });
        exit.addTag('removeOnLevelExit');

        let transform = exit.addComponent(new Transform(settings.x, settings.y));
        let hitbox = exit.addComponent(new Hitbox(0, 0, settings.width, settings.height));
        let collider = exit.addComponent(new Collider());

        hitbox.debugColor = '#f82';

        collider.addTag(G.CollisionTags.EXIT);
        collider.addCheck(G.CollisionTags.PLAYER);


        if (_manual) {
            let tryToTriggerManualExit = function () {
                if (Core.input.keyDown('up')) {
                    Navigation.warpTo(_targetMap, _targetSpawnKey);
                }
            };

            exit.on('collisionStart', function (data) {
                if (data.otherEntity.name !== 'player') return;

                Core.input.on('keyDown', tryToTriggerManualExit);
            });

            exit.on('collisionEnd', function (data) {
                if (data.otherEntity.name !== 'player') return;

                Core.input.off('keyDown', tryToTriggerManualExit);
            });
        } else {
            exit.on('collision', function (data) {
                if (data.otherEntity.name !== 'player') return;
                let player = data.otherEntity;

                if (Utils.sign(player.getComponent('physics').vx) === _direction) {
                    Navigation.warpTo(_targetMap, _targetSpawnKey);
                }
            });
        }




        return exit;
    };
});