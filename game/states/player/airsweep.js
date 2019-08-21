define('game/states/player/airsweep', [
    'engine/core',
    'engine/utils/keycodes',

    'game/globals',
    'game/utils',
    'game/modules/state',

    'game/entities/attack'
], function (
    Core,
    KeyCodes,

    G,
    Utils,
    State,

    Attack
) {
    "use strict";
    return new State({
        name: 'airSweep',
        start: function (data) {
            data.sprite.setAnimation('airSweep');
            this.timer = 9;
        },
        update: function (data) {
            this.timer--;
            data.handleLeftRight(true);

            if (this.timer >= 3) {
                data.physics.vy = -data.physics.gravity;
            }

            if (this.timer === 3) {

                let a = data.transform.fromLocalPoint(16, -20);
                let b = data.transform.fromLocalPoint(26, -1);

                Core.add(new Attack({
                    a: a,
                    b: b,
                    tags: [G.CollisionTags.PLAYER_ATTACK],
                    onHit: function () {
                        data.physics.vy = -3.5;
                    }
                }));

            }

            if (this.timer <= 0) {
                data.stateMachine.setState('jump');
            }
        }
    });
});