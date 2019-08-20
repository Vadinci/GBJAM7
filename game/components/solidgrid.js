define('game/components/solidgrid', [
    'engine/math/rectangle',

    'game/managers/world'
], function (
    Rectangle,

    World
) {
    return function (settings) {
        let _entity;
        let _transform;

        let _cellWidth = settings.cellWidth || 16;
        let _cellHeight = settings.cellHeight || 16;

        let _width = settings.width || 1;
        let _height = settings.height || 1;

        let _cells = [];
        for (let ic = 0; ic < _width; ic++) {
            _cells[ic] = [];
            for (let ir = 0; ir < _height; ir++) {
                _cells[ic][ir] = false;
            }
        }

        let _collidable = settings.collidable === undefined ? true : settings.collidable;

        let _isValidPos = function (c, r) {
            if (c < 0 || r < 0) return false;
            if (r >= _height) return false;
            if (c >= _width) return false;

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

            //TODO

            return false;
        };

        let overlapsActor = function (actor, dx, dy) {
            if (!_collidable) return false;

            dx -= _transform.position.x;
            dy -= _transform.position.y;

            //find best candidates for potential overlap
            let lc = Math.floor((actor.hitbox.left + dx) / _cellWidth);
            let rc = Math.floor((actor.hitbox.right + dx) / _cellWidth);
            let tc = Math.floor((actor.hitbox.top + dy) / _cellHeight);
            let bc = Math.floor((actor.hitbox.bottom + dy) / _cellHeight);

            for (let ic = lc; ic <= rc; ic++) {
                for (let ir = tc; ir <= bc; ir++) {
                    if (!_isValidPos(ic, ir)) continue;
                    if (_cells[ic][ir]) return true;
                }
            }

            return false;
        };

        let setSolid = function (c, r, solid) {
            if (!_isValidPos(c, r)) return;
            _cells[c][r] = solid;
        };

        let self = {
            name: 'solidGrid',

            setCollidable: setCollidable,
            getCollidable: getCollidable,
            overlapsPoint: overlapsPoint,
            overlapsActor: overlapsActor,

            setSolid: setSolid,

            start: function (data) {
                _entity = data.entity;

                _transform = _entity.getComponent('transform');
                if (!_transform) throw "solid needs a transform component";

                World.addSolid(self);
            },
            die: function () {
                World.removeSolid(self);
            },

            drawDebug: function (data) {
                for (let ic = 0; ic < _width; ic++) {
                    for (let ir = 0; ir < _height; ir++) {
                        if (!_cells[ic][ir]) continue;
                        data.canvas.drawRect('#ddd', ic * _cellWidth, ir * _cellHeight, _cellWidth, _cellHeight, false, 1);
                    }
                }
            }
        };

        return self;
    }
});