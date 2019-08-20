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

            if (Core.input.keyPressed('jump')) {
                //TODO coyote time
            }

            if (data.physics.isFloored()) {
                data.stateMachine.setState('idle');
            }

            //TODO left right movement

            //TODO air attack
        }
    });
});