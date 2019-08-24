define('game/states/player/dash', [
    'engine/core',
    'engine/utils/keycodes',

    'game/globals',
    'game/utils',
    'game/modules/state',

    'game/entities/attack',

    'game/managers/camera'
], function (
    Core,
    KeyCodes,

    G,
    Utils,
    State,

    Attack,

    Camera
) {
    "use strict";
    let state = new State({
        name: 'dash',
        start: function (data) {
            this.stateMachine = data.stateMachine;
            this.physics = data.physics;
            data.sprite.setAnimation('dash');
            data.entity.on('collisionX', this.onHitWall, { context: this });

            this.attack = new Attack({
                a: { x: 12, y: -5 },
                b: { x: 30, y: -1 },
                tags: [G.CollisionTags.PLAYER_ATTACK],
                onHit: function (col) {
                    Camera.shake(5);
                },
                lifeTime : -1
            });
            this.attack.name = 'dashAttack';
            this.attack.getComponent('transform').parent = data.transform;
            Core.add(this.attack);
        },
        update: function (data) {
            data.physics.vx += data.transform.scale.x * 0.5;
            data.physics.vx *= 0.9;
            data.physics.vy *= 0.9;
        },
        stop: function (data) {
            data.entity.off('collisionX', this.onHitWall);
            Core.remove(this.attack);
        }
    });

    state.onHitWall = function (data) {
        //TODO boink and screenshake
        this.physics.vx *= -0.7;
        this.physics.vy = -1;
        this.stateMachine.setState('hit');

        Camera.shake(8);
    };
    return state;
});