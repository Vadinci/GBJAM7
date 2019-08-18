define('game/components/actor', [
    'game/utils',

    'engine/math/rectangle',
    'game/managers/world'
], function (
    Utils,

    Rectangle,
    World
) {
    return function (settings) {
        let _entity;
        let _transform;

        let _hitbox;

        let _xRemainder = 0;
        let _yRemainder = 0;

        let collidesAt = function (dx, dy) {
            let solids = World.getSolids();

            for (let ii = 0; ii < solids.length; ii++) {
                let solid = solids[ii];
                if (solid.overlapsActor(self, dx, dy)) return solid;
            }
            return false;
        };

        let isRiding = function (solid) {
            return solid.overlapsActor(entity, 0, 1);
        };

        let squish = function (solid) {
            _entity.emit('squish');
        };

        let moveX = function (dist, onCollision) {
            _xRemainder += dist;
            let move = Math.round(_xRemainder);

            if (move === 0) return;

            _xRemainder -= move;
            let sign = Utils.sign(move);

            while (move != 0) {
                let collision = collidesAt(sign, 0);
                if (!collision) {
                    //no solid, can move
                    _transform.position.x += sign;
                    move -= sign;
                } else {
                    let colData = {
                        solid: collision,
                        direction: sign
                    };
                    onCollision && onCollision(colData);
                    _entity.emit('collide-x', colData);
                    break;
                }
            }
        };

        let moveY = function (dist, onCollision) {
            _yRemainder += dist;
            let move = Math.round(_yRemainder);

            if (move === 0) return;

            _yRemainder -= move;
            let sign = Utils.sign(move);

            while (move != 0) {
                let collision = collidesAt(0, sign);
                if (!collision) {
                    //no solid, can move
                    _transform.position.y += sign;
                    move -= sign;
                } else {
                    let colData = {
                        solid: collision,
                        direction: sign
                    };
                    onCollision && onCollision(colData);
                    _entity.emit('collide-y', colData);
                    break;
                }
            }
        };

        let self = {
            name: 'actor',

            collidesAt: collidesAt,

            isRiding: isRiding,
            squish: squish,

            moveX: moveX,
            moveY: moveY,

            start: function (data) {
                _entity = data.entity;

                _transform = _entity.getComponent('transform');
                if (!_transform) throw "actor needs a transform component";

                _hitbox = _entity.getComponent('hitbox');
                if (!_hitbox) throw "actor needs a hitbox component";

                World.addActor(self);
            },
            die: function () {
                World.removeActor(self);
            }
        };

        Object.defineProperties(self, {
            hitbox: { get: function () { return _hitbox; } }
        });

        return self;
    }
});