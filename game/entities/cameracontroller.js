define('game/entities/cameracontroller', [
    'engine/core',
    'engine/core/entity',

    'game/managers/camera'
], function (
    Core,
    Entity,

    Camera
) {
    "use strict";
    return function (settings) {
        let _player = settings.player;

        let _playerTransform = _player.getComponent('transform');

        let _offX = 0;

        let cameraController = new Entity({
            z: 0,
            name: 'cameraContoller'
        });
        cameraController.addTag('removeOnLevelExit');

        cameraController.addComponent({
            name: 'eventRegistration',
            start: function () {
                Core.engine.on('postUpdate', _updateCamera);

                _lastPlayerX = _playerTransform.position.x;
                _lastPlayerY = _playerTransform.position.y;
            },
            die: function () {
                Core.engine.off('postUpdate', _updateCamera);
            }
        });

        //TODO math utils
        let step = function (from, to, maxStep) {
            if (Math.abs(from - to) < 0.0001) return to;
            if (from > to) {
                return Math.max(to, from - maxStep);
            } else {
                return Math.min(to, from + maxStep);
            }
        };

        let _lastPlayerX;
        let _lastPlayerY;

        let _updateCamera = function () {
            //just try and center player right now

            let targetX = Camera.x + Camera.width / 2;
            let targetY = Camera.y + Camera.height / 2;

            targetX += _offX;

            let dx = _playerTransform.position.x - targetX;
            let dy = _playerTransform.position.y - targetY;

            let dPlayerX = _playerTransform.position.x - _lastPlayerX;

            _lastPlayerX = _playerTransform.position.x;
            _lastPlayerY = _playerTransform.position.y;

            if (dPlayerX > 0) {
                _offX = step(_offX, -30, 1.5);
                if (_offX > 0) {
                    _offX = step(_offX, -30, 0.7);
                }
            }
            if (dPlayerX < 0) {
                _offX = step(_offX, 30, 1.5);
                if (_offX < 0) {
                    _offX = step(_offX, 30, 0.7);
                }
            }

            //TODO clamp util
            let stepX = Math.min(Math.max(-4, dx), 4) | 0;
            let stepY = Math.min(Math.max(-4, dy), 4) | 0;

            Camera.move(stepX, stepY);
        };

        return cameraController;
    };
});