define('game/entities/enemies/slime', [
    'game/globals',
    'game/utils',

    'engine/core',
    'engine/core/entity',

    'game/components/transform',
    'game/components/hitbox',
    'game/components/actor',
    'game/components/collider',
    'game/components/physics',
    'game/components/enemy',

    'game/modules/framestrip',
    'game/modules/animation',
    'game/components/sprite',

    'game/entities/effect'
], function (
    G,
    Utils,

    Core,
    Entity,

    Transform,
    Hitbox,
    Actor,
    Collider,
    Physics,
    Enemy,

    FrameStrip,
    Animation,
    Sprite,

    Effect
) {
    "use strict";
    return function (settings) {
        settings = settings || {};

        let slime = new Entity({
            z: 10,
            priority: 100,
            name: 'slime'
        });
        slime.addTag('removeOnLevelExit');
        slime.addTag('enemy');

        let transform = slime.addComponent(new Transform(settings.x, settings.y));
        let hitbox = slime.addComponent(new Hitbox(-6, -12, 12, 11));
        let actor = slime.addComponent(new Actor());
        let collider = slime.addComponent(new Collider());
        let physics = slime.addComponent(new Physics({}));
        let enemy = slime.addComponent(new Enemy({}));

        //TODO make some creator for this.
        let texture = Core.assets.getTexture('enemy_slime');
        let strip = new FrameStrip(texture, 0, 0, 16, 16, 4, 1, 8, 16);

        let animDefault = new Animation(strip.getFrames([0, 1]), 4, true);
        let animDie = new Animation(strip.getFrames([2, 3]), 8, false);
        let sprite = new Sprite();
        sprite.addAnimation('default', animDefault);
        sprite.addAnimation('die', animDie);
        sprite.setAnimation('default');

        slime.addComponent(sprite);

        hitbox.debugColor = '#f00';

        physics.vx = Core.random.pick([-0.5, 0.5]);

        slime.on('collisionX', () => physics.vx *= -1);
        slime.addComponent({
            name: 'ledgeTurner',
            update: function (data) {
                if (!actor.collidesAt((hitbox.width + 1) * Utils.sign(physics.vx), 1)) {
                    physics.vx *= -1;
                }
            }
        });

        slime.on('hurt', () => {
            slime.removeComponent('enemy');
            slime.removeComponent('ledgeTurner');
            physics.vx = 0;

            sprite.setAnimation('die');
            animDie.on('finish', () => {
                Core.remove(slime);
                Core.add(new Effect('dust', { x: transform.position.x, y: transform.position.y }));
            }, { once: true });
        });

        return slime;
    };
});