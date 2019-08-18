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

        let cameraController = new Entity({
            z: 0,
            name: 'cameraContoller'
        });
        cameraController.addTag('removeOnLevelExit');

        cameraController.addComponent({
            name: 'eventRegistration',
            start: function () {
                Core.engine.on('postUpdate', _updateCamera);
            },
            die: function () {
                Core.engine.off('postUpdate', _updateCamera);
            }
        });

        let _updateCamera = function () {
            //just try and center player right now

            let centerX = Camera.x + Camera.width / 2;
            let centerY = Camera.y + Camera.height / 2;

            let dx = _playerTransform.position.x - centerX;
            let dy = _playerTransform.position.y - centerY;

            Camera.move(dx, dy);
        };

        return cameraController;
    };
});