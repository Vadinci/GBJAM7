define('game/components/solid', [
    'engine/math/rectangle',

    'game/managers/world'
], function (
    Rectangle,

    World
) {
    return function (settings) {
        let _entity;
        let _transform;

        let _hitbox;

        let _xRemainder = 0;
        let _yRemainder = 0;

        let _collidable = settings.collidable === undefined ? true : settings.collidable;

        let _overlapCheck = function (actor, dx, dy) {
            dx = dx || 0;
            dy = dy || 0;

            //aabb compare against hitBox
            if (actor.hitbox.right + dx <= _hitbox.left) return false;
            if (actor.hitbox.bottom + dy <= _hitbox.top) return false;
            if (actor.hitbox.left + dx > _hitbox.right) return false;
            if (actor.hitbox.top + dy > _hitbox.bottom) return false;

            return true;
        };

        let setCollidable = function (col) {
            _collidable = col;
        };

        let getCollidable = function () {
            return _collidable;
        };

        let overlapsPoint = function (x, y) {
            if (!_collidable) return false;

            //aabb compare against hitBox
            if (x <= _hitbox.left) return false;
            if (y <= _hitbox.top) return false;
            if (x > _hitbox.right) return false;
            if (y > _hitbox.bottom) return false;

            return true;
        };

        let overlapsActor = function (actor, dx, dy) {
            if (!_collidable) return false;

            return _overlapCheck(actor, dx, dy);
        };

        let _getAllRidingActors = function () {
            let actors = World.getActors();

            let riding = [];
            for (let ii = 0; ii < actors.length; ii++) {
                let actor = actors[ii];
                if (actor.isRiding(entity)) {
                    riding.push(actor);
                }
            }

            return riding;
        };

        let move = function (dx, dy) {
            _xRemainder += dx;
            _yRemainder += dy;

            let moveX = Math.round(_xRemainder);
            let moveY = Math.round(_yRemainder);

            if (moveX === 0 && moveY === 0) return;

            let actors = World.getActors();

            let riding = _getAllRidingActors();

            _collidable = false; //TODO what if this solid wasn't collidable to start with?

            let moveEveryActor = function (overlapCB, ridingCB) {
                for (let ii = actors.length - 1; ii >= 0; ii--) {
                    let actor = actors[ii];

                    if (_overlapCheck(actor)) overlapCB(actor)
                    else if (riding.indexOf(actor) !== -1) ridingCB(actor);
                }
            };

            if (moveX !== 0) {
                _transform.position.x += moveX;
                _xRemainder -= moveX;

                if (moveX > 0) {
                    moveEveryActor(
                        actor => actor.moveX(_hitbox.right - actor.hitbox.left, actor.squish),
                        actor => actor.moveX(moveX)
                    );
                } else {
                    moveEveryActor(
                        actor => actor.moveX(_hitbox.left - actor.hitbox.right, actor.squish),
                        actor => actor.moveX(moveX)
                    );
                }
            }

            if (moveY !== 0) {
                _transform.position.y += moveY;
                _yRemainder -= moveY;

                if (moveY > 0) {
                    moveEveryActor(
                        actor => actor.moveY(_hitbox.bottom - actor.hitbox.top, actor.squish),
                        actor => actor.moveY()
                    );
                } else {
                    moveEveryActor(
                        actor => actor.moveY(_hitbox.top - actor.hitbox.bottom, actor.squish),
                        actor => actor.moveY()
                    );
                }
            }

            _collidable = true; //TODO what if this solid wasn't collidable to start with?
        }

        let self = {
            name: 'solid',

            setCollidable: setCollidable,
            getCollidable: getCollidable,
            overlapsPoint: overlapsPoint,
            overlapsActor: overlapsActor,
            move: move,

            start: function (data) {
                _entity = data.entity;

                _transform = _entity.getComponent('transform');
                if (!_transform) throw "solid needs a transform component";

                _hitbox = _entity.getComponent('hitbox');
                if (!_hitbox) throw "solid needs a hitbox component";

                World.addSolid(self);
            },
            die: function (data) {
                World.removeSolid(self);
            }
        };

        Object.defineProperties(self, {
            hitbox: { get: function () { return _hitbox; } }
        });

        return self;
    }
});