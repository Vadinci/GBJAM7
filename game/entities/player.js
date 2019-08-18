define('game/entities/player', [
    'engine/core',
    'engine/core/entity',
    'engine/utils/keycodes',

    'game/components/transform',
    'game/components/hitbox',
    'game/components/actor',

    'game/modules/frame',
    'game/modules/animation',
    'game/components/sprite'
], function (
    Core,
    Entity,
    KeyCodes,

    Transform,
    Hitbox,
    Actor,

    Frame,
    Animation,
    Sprite
) {
    "use strict";
    const COYOTE_FRAMES = 5;
    const BUFFER_FRAMES = 3;

    const MIN_JUMP_HEIGHT = 24;
    const MAX_JUMP_HEIGHT = 40;

    const MAX_FALL_SPEED = 8;

    return function (settings) {
        //TODO sometimes jump doesn't register (might be framing, button gets pressed after player update but then
        //gets flushed before the next frame :/ )
        //TODO variable jumping. Min and max height in pixels

        settings = settings || {};

        let player = new Entity({
            z: 10,
            priority: 100,
            name: 'player'
        });

        let transform = player.addComponent(new Transform(settings.x, settings.y));
        let hitbox = player.addComponent(new Hitbox(-6, -12, 12, 12));
        hitbox.debugColor = '#0ad';
        let actor = player.addComponent(new Actor());

        let texture = Core.assets.getTexture('player');
        let frames = [];
        frames.push(new Frame(texture, 0 * 64, 0, 64, 32, 32, 32));
        frames.push(new Frame(texture, 1 * 64, 0, 64, 32, 32, 32));
        let animIdle = new Animation([frames[0], frames[1]], 12, true);

        let sprite = new Sprite();
        sprite.addAnimation('idle', animIdle);
        sprite.setAnimation('idle');

        player.addComponent(sprite);


        //TODO make component that requires actor
        let _velocity = { x: 0, y: 0 };

        let physics = {
            name: 'physics',
            update: function (data) {
                _velocity.y += 0.2;
                _velocity.y = Math.min(MAX_FALL_SPEED, _velocity.y);

                actor.moveX(_velocity.x, data => _velocity.x = 0);
                actor.moveY(_velocity.y, data => _velocity.y = 0);
            },
            drawDebug: function (data) {
                data.canvas.drawLine('#f0f', 0, 0, _velocity.x * 2, _velocity.y * 2);
            }
        };
        player.addComponent(physics);

        //TODO math utils
        let step = function (from, to, maxStep) {
            if (Math.abs(from - to) < 0.0001) return to;
            if (from > to) {
                return Math.max(to, from - maxStep);
            } else {
                return Math.min(to, from + maxStep);
            }
        };

        let isFloored = function () {
            return actor.collidesAt(0, 1);
        };

        let canJump = function () {
            console.log(_coyoteTimer);
            return _coyoteTimer > 0;
        };

        //TODO make component that requires physics
        let _jumpBufferTimer = 0;
        let _coyoteTimer = 0;

        let controller = {
            name: 'controller',
            update: function (data) {
                let tvx = 0;

                if (Core.input.keyDown(KeyCodes.LEFT)) tvx -= 1.2;
                if (Core.input.keyDown(KeyCodes.RIGHT)) tvx += 1.2;

                if (isFloored()) {
                    _coyoteTimer = COYOTE_FRAMES;
                }

                if (Core.input.keyPressed(KeyCodes.Z)) {
                    _jumpBufferTimer = BUFFER_FRAMES;
                }

                if (_jumpBufferTimer > 0 && canJump()) {
                    _velocity.y = -3;
                    _jumpBufferTimer = 0;
                }

                _jumpBufferTimer--;
                _coyoteTimer--;

                _velocity.x = step(_velocity.x, tvx, 0.4);

                if (_velocity.x > 0.1) transform.scale.x = 1;
                if (_velocity.x < -0.1) transform.scale.x = -1;
            }
        };
        player.addComponent(controller);


        return player;
    };
});