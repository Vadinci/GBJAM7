define('game/states/player/idle', [
    'engine/core',
    'engine/utils/keycodes',

    'game/globals',
    'game/utils',
    'game/modules/state'
], function (
    Core,
    KeyCodes,

    G,
    Utils,
    State
) {
    "use strict";
    return new State({
        name: 'idle',
        start: function (data) {
            data.sprite.setAnimation('idle');
        },
        update: function (data) {
            data.handleLeftRight();
            data.handleJump();
            if (Math.abs(data.physics.vy) > 0.01) {
            	console.log(data.physics.vy);
                data.stateMachine.setState('jump');
            } else if (Core.input.keyPressed('attack')) {
                data.stateMachine.setState('charge');
            } else if (Math.abs(data.physics.vx) > 0.01) {
                data.stateMachine.setState('walk');
            }
        }
    });
});