define('game/states/player/walk', [
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
        name: 'walk',
        start: function (data) {
            data.sprite.setAnimation('walk');
        },
        update: function (data) {
            data.handleLeftRight();
            data.handleJump();

            if (Math.abs(data.physics.vy) > 0.01) {
                data.stateMachine.setState('jump');
            } else if (Core.input.keyPressed('attack')) {
                data.stateMachine.setState('charge');
            } else if (Math.abs(data.physics.vx) < 0.01) {
                data.stateMachine.setState('idle');
            }
        }
    });
});