define('game/states/player/stab', [
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
    return new State({
        name: 'stab',
        start: function (data) {
            data.sprite.setAnimation('stab');
            this.timer = 16;
        },
        update: function (data) {
            this.timer--;
            data.handleLeftRight(true);

            if (this.timer === 9) {
                //TODO create a 1 frame attack
                let a = data.transform.fromLocalPoint(12, -5);
                let b = data.transform.fromLocalPoint(30, -1);

                Core.assets.getSound('attack').play();

                Core.add(new Attack({
                    a: a,
                    b: b,
                    tags: [G.CollisionTags.PLAYER_ATTACK],
                    onHit: function (col) {
                        Camera.shake(5);
                    }
                }));
            }

            if (this.timer <= 0) {
                data.stateMachine.setState('idle');
            }
        }
    });
});