define('game/components/player/controller', [
    'engine/core',
    'engine/utils/keycodes',

    'game/globals',
    'game/utils'
], function (
    Core,
    KeyCodes,

    G,
    Utils
) {
    "use strict";
    const COYOTE_FRAMES = 5;
    const BUFFER_FRAMES = 3;

    const MIN_JUMP_HEIGHT = 24;
    const MAX_JUMP_HEIGHT = 40;

    let kLEFT = KeyCodes.LEFT;
    let kRIGHT = KeyCodes.RIGHT;

    let kJUMP = KeyCodes.Z;
    let kATTACK = KeyCodes.X;

    return function () {
        let _entity;
        let _physics;
        let _transform;
        let _sprite;

        //TODO split player into statemachine
        let _jumpBufferTimer = 0;
        let _coyoteTimer = 0;

        let _isStabbing = false;
        let _isCharging = false;

        let _canJump = function () {
            console.log(_coyoteTimer);
            return _coyoteTimer > 0;
        };

        let self = {
            name: 'playerController',
            start: function (data) {
                _entity = data.entity;

                _physics = _physics || _entity.getComponent('physics');
                if (!_physics) throw "playerController needs a physics component";

                _transform = _transform || _entity.getComponent('transform');
                if (!_transform) throw "playerController needs a transform component";

                //TODO tbf this doesn't make sense. While animations are important, I'm
                //not sure player controls should be anim-dependend rather than the other way round
                _sprite = _sprite || _entity.getComponent('sprite');
                if (!_sprite) throw "playerController needs a sprite component";

                _sprite.getAnimation('stab').on('finish', () => _isStabbing = false);;
            },
            update: function (data) {
                let tvx = 0;

                if (Core.input.keyDown(kLEFT)) tvx -= 1.2;
                if (Core.input.keyDown(kRIGHT)) tvx += 1.2;

                if (_physics.isFloored()) {
                    _coyoteTimer = COYOTE_FRAMES;
                }

                if (Core.input.keyPressed(kJUMP) && !_isStabbing && !_isCharging) {
                    _jumpBufferTimer = BUFFER_FRAMES;
                }

                if (_jumpBufferTimer > 0 && _canJump()) {
                    _physics.vy = -3.15;
                    _jumpBufferTimer = 0;
                }


                if (Core.input.keyPressed(kATTACK) && _physics.isFloored() && !_isStabbing) {
                    _isCharging = true;
                }

                if (Core.input.keyReleased(kATTACK) && _isCharging) {
                    _isStabbing = true;
                    _isCharging = false;
                }

                _jumpBufferTimer--;
                _coyoteTimer--;

                if (_isCharging) {
                    tvx *= 0.1;
                }

                if (_isStabbing) {
                    tvx = 0;
                }

                _physics.vx = Utils.step(_physics.vx, tvx, 0.4);

                if (_physics.vx > 0.1) _transform.scale.x = 1;
                if (_physics.vx < -0.1) _transform.scale.x = -1;

                if (_isCharging) {
                    _sprite.setAnimation('charge');
                } else if (_isStabbing) {
                    _sprite.setAnimation('stab');
                } else if (!_physics.isFloored()) {
                    _sprite.setAnimation('jump');
                } else if (Math.abs(_physics.vx) > 0.1) {
                    _sprite.setAnimation('walk');
                } else {
                    _sprite.setAnimation('idle')
                };
            }
        };
        return self;
    }
});