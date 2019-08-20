define('game/components/physics', [
    'game/globals',
    'game/utils'
], function (
    G,
    Utils
) {
    "use strict";

    const GRAVITY = 0.2;
    const MAX_FALL_SPEED = 8;

    return function (settings) {
        let _entity;
        let _actor;

        let _vx = 0;
        let _vy = 0;

        let _gravity = settings.gravity || GRAVITY;
        let _maxFallSpeed = settings.maxFallSpeed || MAX_FALL_SPEED;

        let self = {
            name: 'physics',

            start: function (data) {
                _entity = data.entity;

                _actor = _actor || _entity.getComponent('actor');
                if (!_actor) throw "enemy needs a actor component";
            },
            update: function (data) {
                if (!self.isFloored()) {
                    _vy += _gravity;
                }
                _vy = Math.min(_maxFallSpeed, _vy);

                if (_vx) _actor.moveX(_vx);
                if (_vy) _actor.moveY(_vy, data => _vy = 0);
            },
            drawDebug: function (data) {
                data.canvas.drawLine('#f0f', 0, 0, _vx * 2, _vy * 2);
            },
            die: function (data) {

            },

            isFloored: function () {
                return _actor.collidesAt(0, 1);
            }
        };

        Object.defineProperties(self, {
            vx: {
                get: () => _vx,
                set: v => _vx = v
            },
            vy: {
                get: () => _vy,
                set: v => _vy = v
            }
        });

        return self;
    }
});