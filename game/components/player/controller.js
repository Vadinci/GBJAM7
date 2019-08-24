define('game/components/player/controller', [
    'engine/core',
    'engine/utils/keycodes',

    'game/globals',
    'game/utils',

    'game/modules/statemachine',

    'game/states/player/idle',
    'game/states/player/walk',
    'game/states/player/jump',
    'game/states/player/charge',
    'game/states/player/stab',
    'game/states/player/airsweep',
    'game/states/player/dash',
    'game/states/player/hit'
], function (
    Core,
    KeyCodes,

    G,
    Utils,

    StateMachine,

    IdleState,
    WalkState,
    JumpState,
    ChargeState,
    StabState,
    AirSweepState,
    DashState,
    HitState
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

        let _stateMachine = new StateMachine({});

        _stateMachine.addState(IdleState);
        _stateMachine.addState(WalkState);
        _stateMachine.addState(JumpState);
        _stateMachine.addState(ChargeState);
        _stateMachine.addState(StabState);
        _stateMachine.addState(AirSweepState);
        _stateMachine.addState(DashState);
        _stateMachine.addState(HitState);


        let _jumpBufferTimer = 0;
        let _coyoteTimer = 0;
        /*
                let _isStabbing = false;
                let _isCharging = false;

                let _canJump = function () {
                    console.log(_coyoteTimer);
                    return _coyoteTimer > 0;
                };
            */

        let _didHandleLeftRight = false;
        let _didHandleJump = false;

        let _handleLeftRight = function (noInput) {
            if (_didHandleLeftRight) return;

            let tvx = 0;
            if (!noInput) {
                if (Core.input.keyDown('left')) {
                    tvx -= 1.2;
                }
                if (Core.input.keyDown('right')) {
                    tvx += 1.2;
                }
            }
            _physics.vx = Utils.step(_physics.vx, tvx, 0.4);
            if (_physics.vx > 0.1) _transform.scale.x = 1;
            if (_physics.vx < -0.1) _transform.scale.x = -1;

            _didHandleLeftRight = true;
        };

        let _handleJump = function () {
            if (_didHandleJump) return;

            if (_jumpBufferTimer > 0 && _coyoteTimer > 0) {
                _physics.vy = -3.15;
                _jumpBufferTimer = 0;

                Core.assets.getSound('jump').play();
            }

            _didHandleJump = true;
        };

        _stateMachine.setData('handleLeftRight', _handleLeftRight);
        _stateMachine.setData('handleJump', _handleJump);

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

                _stateMachine.setData('entity', _entity);
                _stateMachine.setData('physics', _physics);
                _stateMachine.setData('transform', _transform);
                _stateMachine.setData('sprite', _sprite);

                _stateMachine.setState('idle');
            },
            update: function (data) {
                _didHandleLeftRight = false;
                _didHandleJump = false;

                if (_physics.isFloored()) {
                    _coyoteTimer = COYOTE_FRAMES;
                }

                if (Core.input.keyPressed(kJUMP)) {
                    _jumpBufferTimer = BUFFER_FRAMES;
                }

                _stateMachine.update();

                _coyoteTimer--;
                _jumpBufferTimer--;
            },

            hit : function(){
                _stateMachine.setState('hit');
            }
        };
        return self;
    }
});