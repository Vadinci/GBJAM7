define('game/states/player/hit', [
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
        name: 'hit',
        start: function (data) {
            data.sprite.setAnimation('hit');
            data.physics.vx = -data.transform.scale.x;
            data.physics.vy = -1.8;
            this.timer = 16;

            Camera.shake(5);
        },
        update: function (data) {
            data.physics.vx *= 0.95;
            this.timer--;
            if (this.timer <= 0) data.stateMachine.setState('idle');
        }
    });
    return state;
});