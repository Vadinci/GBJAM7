define('game/managers/camera', [
    'engine/core',
    'engine/math/rectangle',

    'engine/core/entity'
], function (
    Core,
    Rectangle,

    Entity
) {
    "use strict";

    let _width = 160;
    let _height = 144;

    let _bounds = {
        left: 0,
        top: 0,
        right: 160,
        height: 144
    };

    let _xx = 0;
    let _yy = 0;

    let _shake = 0;

    let _dx = 0;
    let _dy = 0;

    let setBounds = function (left, top, right, bottom) {
        if (right - left < _width) throw "camera bounds too small!";
        if (bottom - top < _height) throw "camera bounds too small!";

        _bounds.left = left;
        _bounds.top = top;
        _bounds.right = right;
        _bounds.bottom = bottom;
    };

    let move = function (dx, dy) {
        moveTo(_xx + dx, _yy + dy);
    };

    let moveTo = function (x, y) {
        _xx = x;
        _yy = y;

        if (_xx < _bounds.left) _xx = _bounds.left;
        if (_yy < _bounds.top) _yy = _bounds.top;
        if (_xx + _width > _bounds.right) _xx = _bounds.right - _width;
        if (_yy + _height > _bounds.bottom) _yy = _bounds.bottom - _height;
    };

    let shake = function (amount) {
        _shake += amount;
    };

    let cameraStarter = new Entity({
        z: -1,
        priority: 0,
        name: 'cameraStarter'
    });
    cameraStarter.addComponent({
        name: 'starter',
        update: function () {
            if (_shake > 0) {
                let amt = Math.round((_shake * _shake) / 25);
                _dx = Core.random.int(-amt, amt);
                _dy = Core.random.int(-amt, amt);
                _shake--;
            }
        },
        preDraw: function (data) {
            data.canvas.translate(-_xx - _dx, -_yy - _dy);
        }
    });

    let cameraEnder = new Entity({
        z: 100,
        priority: 0,
        name: 'cameraEnder'
    });
    cameraEnder.addComponent({
        name: 'ender',
        postDraw: function (data) {
            data.canvas.translate(_xx + _dx, _yy + _dy);
        }
    });

    let manager = {
        enable: function () {
            Core.add(cameraStarter);
            Core.add(cameraEnder);
        },
        disable: function () {
            Core.remove(cameraStarter);
            Core.remove(cameraEnder);
        },

        setBounds: setBounds,
        move: move,
        moveTo: moveTo,

        shake : shake
    };

    Object.defineProperties(manager, {
        x: { get: function () { return _xx; } },
        y: { get: function () { return _yy; } },
        width: { get: function () { return _width; } },
        height: { get: function () { return _height; } }
    });

    return manager;
});