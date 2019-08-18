define('game/entities/player', [
    'game/globals',

    'engine/core',
    'engine/core/entity',
    'engine/utils/keycodes',

    'game/components/transform',
    'game/components/hitbox',
    'game/components/actor',
    'game/components/collider',

    'game/modules/framestrip',
    'game/modules/animation',
    'game/components/sprite'
], function (
    G,

    Core,
    Entity,
    KeyCodes,

    Transform,
    Hitbox,
    Actor,
    Collider,

    FrameStrip,
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
        player.addTag('removeOnLevelExit');

        let transform = player.addComponent(new Transform(settings.x, settings.y));
        let hitbox = player.addComponent(new Hitbox(-6, -12, 12, 12));
        hitbox.debugColor = '#0ad';
        let actor = player.addComponent(new Actor());

        let collider = player.addComponent(new Collider());
        collider.addTag(G.CollisionTags.PLAYER);

        let texture = Core.assets.getTexture('player');
        let strip = new FrameStrip(texture, 0, 0, 64, 32, 8, 1, 32, 32);

        let animIdle = new Animation(strip.getFrames([0, 0, 0, 0, 0, 0, 0, 1]), 8, true);
        let animWalk = new Animation(strip.getFrames([2, 3]), 12, true);
        let animJump = new Animation(strip.getFrames([4, 5]), 12, true);
        let animCharge = new Animation(strip.getFrames(6), 0, false);
        let animStab = new Animation(strip.getFrames([7, 6]), 8, false);

        let sprite = new Sprite();
        sprite.addAnimation('idle', animIdle);
        sprite.addAnimation('walk', animWalk);
        sprite.addAnimation('jump', animJump);
        sprite.addAnimation('charge', animCharge);
        sprite.addAnimation('stab', animStab);
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

        let _isStabbing = false;
        let _isCharging = false;

        animStab.on('finish', () => _isStabbing = false);

        let controller = {
            name: 'controller',
            update: function (data) {
                let tvx = 0;

                if (Core.input.keyDown(KeyCodes.LEFT)) tvx -= 1.2;
                if (Core.input.keyDown(KeyCodes.RIGHT)) tvx += 1.2;

                if (isFloored()) {
                    _coyoteTimer = COYOTE_FRAMES;
                }

                if (Core.input.keyPressed(KeyCodes.Z) && !_isStabbing && !_isCharging) {
                    _jumpBufferTimer = BUFFER_FRAMES;
                }

                if (_jumpBufferTimer > 0 && canJump()) {
                    _velocity.y = -3.15;
                    _jumpBufferTimer = 0;
                }


                if (Core.input.keyPressed(KeyCodes.X) && isFloored() && !_isStabbing) {
                    _isCharging = true;
                }

                if (Core.input.keyReleased(KeyCodes.X) && _isCharging) {
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

                _velocity.x = step(_velocity.x, tvx, 0.4);

                if (_velocity.x > 0.1) transform.scale.x = 1;
                if (_velocity.x < -0.1) transform.scale.x = -1;

                if (_isCharging) {
                    sprite.setAnimation('charge');
                } else if (_isStabbing) {
                    sprite.setAnimation('stab');
                } else if (!isFloored()) {
                    sprite.setAnimation('jump');
                } else if (Math.abs(_velocity.x) > 0.1) {
                    sprite.setAnimation('walk');
                } else {
                    sprite.setAnimation('idle')
                };
            }
        };
        player.addComponent(controller);


        return player;
    };
});