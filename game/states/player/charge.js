define('game/states/player/charge', [
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
        name: 'charge',
        start: function (data) {
            data.sprite.setAnimation('charge');
            this.isHolding = true;
            this.timer = 0;
        },
        update: function (data) {
            this.timer++;
            data.handleLeftRight(true);
            if (Core.input.keyReleased('attack')) this.isHolding = false;

            if (!this.isHolding && this.timer > 30) {
                data.stateMachine.setState('dash');
            } else if (!this.isHolding && this.timer > 4) {
                data.stateMachine.setState('stab');
            }
        }
    });
});