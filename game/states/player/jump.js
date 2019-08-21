define('game/states/player/jump', [
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
        name: 'jump',
        start: function (data) {
            data.sprite.setAnimation('jump');
        },
        update: function (data) {
            data.handleLeftRight();

            if (Core.input.keyPressed('attack')) {
                data.stateMachine.setState('airSweep');
            }

            if (data.physics.isFloored()) {
                data.stateMachine.setState('idle');
            }

            //TODO left right movement

            //TODO air attack
        }
    });
});