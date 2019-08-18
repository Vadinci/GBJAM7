define('game/components/transform', [
    'engine/math/matrix2d',
], function (
    Matrix2D
) {
    "use strict";
    var TransformVector = function (x, y, parent) {
        this._x = x || 0;
        this._y = y || 0;
        this._parent = parent;
    };

    Object.defineProperties(TransformVector.prototype, {
        x: {
            get: function () {
                return this._x
            },
            set: function (v) {
                this._x = v;
                this._parent.flagDirty();
            }
        },
        y: {
            get: function () {
                return this._y
            },
            set: function (v) {
                this._y = v;
                this._parent.flagDirty();
            }
        }
    });



    var Transform = function (x, y, scaleX, scaleY, rotation) {
        this._position = new TransformVector(x || 0, y || 0, this);
        this._scale = new TransformVector(scaleX || 1, scaleY || 1, this); //TODO falsey
        this._rotation = rotation || 0;

        this._localTransform = Matrix2D.identity();
        this._globalTransform = Matrix2D.identity();

        this._isDirty = true;
        this._parent = undefined;
        this._children = [];
    };

    Transform.prototype.preDraw = function (data) {
        this.recalculateMatrix();
        data.canvas.save();
        data.canvas.transform(
            this._globalTransform[0],
            this._globalTransform[3],
            this._globalTransform[1],
            this._globalTransform[4],
            this._globalTransform[2],
            this._globalTransform[5]
        );
    };

    Transform.prototype.postDraw = function (data) {
        data.canvas.restore();
    };

    //TODO a lot of creation an deletion going on here and in matrix2d.js
    //try to push as much on the stack and/or make functions in place or something?
    Transform.prototype.recalculateMatrix = function () {
        if (!this._isDirty) return;

        Matrix2D.reset(this._localTransform);
        this._localTransform = Matrix2D.translate(this._localTransform, this._position.x, this._position.y);
        this._localTransform = Matrix2D.rotate(this._localTransform, this._rotation);
        this._localTransform = Matrix2D.scale(this._localTransform, this._scale.x, this._scale.y);

        this._globalTransform = Matrix2D.clone(this._localTransform);
        if (this._parent) {
            //this bit is recursive until we hit a root transform
            this._parent.recalculateMatrix();
            this._globalTransform = Matrix2D.multiply(this._globalTransform, this._parent._globalTransform);
        }

        this._isDirty = false;
    };

    Transform.prototype.addChild = function (other) {
        var idx = this._children.indexOf(other);
        if (idx !== -1) return;
        this._children.push(other);
        other.setParent(this);
    };

    Transform.prototype.removeChild = function (other) {
        var idx = this._children.indexOf(other);
        if (idx === -1) return;
        this._children.splice(idx, 1);
        other.setParent(undefined);
    };

    Transform.prototype.setParent = function (other) {
        if (this._parent === other) return;
        this._parent = other;
        if (other) other.addChild(this);

        this.flagDirty();
    };

    Transform.prototype.flagDirty = function () {
        if (this._isDirty) return;

        this._isDirty = true;
        var ii;
        for (ii = 0; ii < this._children.length; ii++) {
            this._children[ii].flagDirty();
        }
    };


    Object.defineProperties(Transform.prototype, {
        name: {
            writable: false,
            value: 'transform'
        },
        parent: {
            get: function () { return this._parent },
            set: function (v) {
                this.setParent(v);
            }
        },
        position: {
            get: function () { return this._position; }
        },
        scale: {
            get: function () { return this._scale; }
        },
        rotation: {
            get: function () { return this._rotation; },
            set: function (v) {
                this._rotation = v;
                this.flagDirty();
            }
        }
    });



    return Transform;
});