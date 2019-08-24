define('game/entities/player', [
    'game/globals',
    'game/utils',

    'engine/core',
    'engine/core/entity',
    'engine/utils/keycodes',

    'game/components/transform',
    'game/components/hitbox',
    'game/components/actor',
    'game/components/collider',
    'game/components/physics',
    'game/components/player/controller',

    'game/modules/framestrip',
    'game/modules/animation',
    'game/components/sprite'
], function (
    G,
    Utils,

    Core,
    Entity,
    KeyCodes,

    Transform,
    Hitbox,
    Actor,
    Collider,
    Physics,
    PlayerController,

    FrameStrip,
    Animation,
    Sprite
) {
    "use strict";
    return function (settings) {
        settings = settings || {};

        let player = new Entity({
            z: 10,
            priority: 100,
            name: 'player'
        });
        player.addTag('removeOnLevelExit');

        let transform = player.addComponent(new Transform(settings.x, settings.y));
        let hitbox = player.addComponent(new Hitbox(-6, -12, 12, 11));
        hitbox.debugColor = '#0ad';
        let actor = player.addComponent(new Actor());
        let physics = player.addComponent(new Physics({}));

        let collider = player.addComponent(new Collider());
        collider.addTag(G.CollisionTags.PLAYER);
        collider.addCheck(G.CollisionTags.HARM);

        //TODO make some creator for this.
        let texture = Core.assets.getTexture('player');
        let strip = new FrameStrip(texture, 0, 0, 64, 32, 8, 2, 32, 32);

        let animIdle = new Animation(strip.getFrames([0, 0, 0, 0, 0, 0, 0, 1]), 8, true);
        let animWalk = new Animation(strip.getFrames([2, 3]), 8, true);
        let animJump = new Animation(strip.getFrames([4, 5]), 8, true);
        let animCharge = new Animation(strip.getFrames(6), 0, false);
        let animStab = new Animation(strip.getFrames([7, 6]), 8, false);
        let animAirSweep = new Animation(strip.getFrames([8, 9]), 16, false);
        let animHit = new Animation(strip.getFrames([10, 11]), 16, false);

        let sprite = new Sprite();
        sprite.addAnimation('idle', animIdle);
        sprite.addAnimation('walk', animWalk);
        sprite.addAnimation('jump', animJump);
        sprite.addAnimation('charge', animCharge);
        sprite.addAnimation('stab', animStab);
        sprite.addAnimation('airSweep', animAirSweep);
        sprite.addAnimation('hit', animHit);
        sprite.setAnimation('idle');

        player.addComponent(sprite);
        let controller = player.addComponent(new PlayerController());

        player.on('collisionStart', function (data) {
            if (data.otherCollider.tags & G.CollisionTags.HARM) {
               controller.hit();
            }
        });

        return player;
    };
});