define('game/states/player/dash', [
    'engine/core',
    'engine/utils/keycodes',

    'game/globals',
    'game/utils',
    'game/modules/state',

    'game/managers/camera'
], function (
    Core,
    KeyCodes,

    G,
    Utils,
    State,

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
        },
        update: function (data) {
            data.physics.vx += data.transform.scale.x * 0.5;
            data.physics.vx *= 0.9;
            data.physics.vy *= 0.9;
        },
        stop: function (data) {
            data.entity.off('collisionX', this.onHitWall);
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