//Hitbox is essentially just an extension of rectangle, but acts as a component and
//takes a transform into account for offset

define('game/components/hitbox', [
    'engine/math/rectangle'
], function (
    Rectangle
) {
    let Hitbox = function (x, y, width, height) {
        Rectangle.call(this, x, y, width, height);

        this.debugColor = '#f0f';
    };

    //inheritance
    Hitbox.prototype = Object.create(Rectangle.prototype);
    Object.defineProperty(Hitbox.prototype, 'constructor', {
        value: Hitbox,
        enumerable: false, // so that it does not appear in 'for in' loop
        writable: true
    });

    Hitbox.prototype.start = function (data) {
        this._transform = data.entity.getComponent('transform');
        if (!this._transform) {
            throw "hitbox needs a transform component!";
        }
    };

    Hitbox.prototype.drawDebug = function (data) {
        data.canvas.drawRect(this.debugColor, this.x, this.y, this.width, this.height, false, 1);
        data.canvas.drawLine(this.debugColor, this.x, this.y, this.x + this.width, this.y + this.height, 1);
    };

    Object.defineProperties(Hitbox.prototype, {
        name: {
            writable: false,
            value: 'hitbox'
        },
        left: { get: function () { return this.x + this._transform.position.x; } },
        right: { get: function () { return this.left + this.width; } },
        top: { get: function () { return this.y + this._transform.position.y; } },
        bottom: { get: function () { return this.top + this.height; } }
    });

    return Hitbox;
});