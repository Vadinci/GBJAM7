define('game/components/collider', [
    'game/utils',

    'game/managers/collision'
], function (
    Utils,

    CollisionManager
) {
    let isPowerOf2 = function (n) {
        return (Math.log(n) / Math.log(2)) % 1 === 0;
    };

    return function (settings) {
        let _entity;
        let _transform;

        let _hitbox;

        let _tags = 0;
        let _checkAgainst = 0;

        let _collidingWith = [];
        let _wasCollidingWith = [];

        //TODO move this function to hitbox itself?
        let collidesWith = function (other) {
            if (other.hitbox.left > _hitbox.right) return false;
            if (other.hitbox.right <= _hitbox.left) return false;
            if (other.hitbox.top > _hitbox.bottom) return false;
            if (other.hitbox.bottom <= _hitbox.top) return false;

            return true;
        };

        let handleCollisionWith = function (other) {
            let data = {
                collider: self,
                otherCollider: other,
                otherEntity: other.getEntity()
            };

            if (_wasCollidingWith.indexOf(other) === -1) {
                _entity.emit('collisionStart', data);
            }
            _entity.emit('collision', data);
            _collidingWith.push(other);
        };

        let addTag = function (tag) {
            if (!isPowerOf2(tag)) throw 'tag needs to be a power of 2';
            _tags = _tags | tag;
        };

        let removeTag = function (tag) {
            if (!isPowerOf2(tag)) throw 'tag needs to be a power of 2';
            _tags = _tags ^ tag;
        };

        let addCheck = function (check) {
            if (!isPowerOf2(check)) throw 'check needs to be a power of 2';
            _checkAgainst = _checkAgainst | check;
        };

        let removeCheck = function (check) {
            if (!isPowerOf2(check)) throw 'check needs to be a power of 2';
            _checkAgainst = _checkAgainst ^ check;
        };

        let self = {
            name: 'collider',

            collidesWith: collidesWith,
            handleCollisionWith: handleCollisionWith,

            addTag: addTag,
            removeTag: removeTag,
            addCheck: addCheck,
            removeCheck: removeCheck,

            start: function (data) {
                _entity = data.entity;

                _transform = _entity.getComponent('transform');
                if (!_transform) throw "actor needs a transform component";

                _hitbox = _entity.getComponent('hitbox');
                if (!_hitbox) throw "actor needs a hitbox component";

                CollisionManager.addCollider(self);
            },
            update: function () {
                for (let ii = 0; ii < _wasCollidingWith.length; ii++) {
                    let other = _wasCollidingWith[ii];
                    if (_collidingWith.indexOf(other) === -1) {
                        _entity.emit('collisionEnd', {
                            collider: self,
                            otherCollider: other,
                            otherEntity: other.getEntity()
                        });
                    }
                }
                //TODO can this be done (in one line :x) without creating a new array?
                _wasCollidingWith = [].concat(_collidingWith);
                _collidingWith.length = 0;
            },
            die: function () {
                CollisionManager.removeCollider(self);

                for (let ii = 0; ii < _wasCollidingWith.length; ii++) {
                    let other = _wasCollidingWith[ii];
                    _entity.emit('collisionEnd', {
                        collider: self,
                        otherCollider: other,
                        otherEntity: other.getEntity()
                    });
                }
            },

            getEntity: function () {
                return _entity;
            }
        };

        Object.defineProperties(self, {
            hitbox: { get: function () { return _hitbox; } },
            tags: { get: function () { return _tags; } },
            checkAgainst: { get: function () { return _checkAgainst; } }
        });

        return self;
    }
});