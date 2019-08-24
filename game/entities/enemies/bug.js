define('game/entities/enemies/bug', [
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

        let bug = new Entity({
            z: 10,
            priority: 100,
            name: 'bug'
        });
        bug.addTag('removeOnLevelExit');
        bug.addTag('enemy');

        let transform = bug.addComponent(new Transform(settings.x, settings.y));
        let hitbox = bug.addComponent(new Hitbox(-6, -12, 12, 11));
        let actor = bug.addComponent(new Actor());
        let collider = bug.addComponent(new Collider());
        let physics = bug.addComponent(new Physics({}));
        let enemy = bug.addComponent(new Enemy({}));

        //TODO make some creator for this.
        let texture = Core.assets.getTexture('enemy_slime');
        let strip = new FrameStrip(texture, 0, 0, 16, 16, 4, 1, 8, 16);

        let animDefault = new Animation(strip.getFrames([0, 1]), 4, true);
        let animDie = new Animation(strip.getFrames([2, 3]), 8, false);
        let sprite = new Sprite();
        sprite.addAnimation('default', animDefault);
        sprite.addAnimation('die', animDie);
        sprite.setAnimation('default');

        bug.addComponent(sprite);

        hitbox.debugColor = '#f00';

        physics.vx = Core.random.pick([-0.5, 0.5]);

        bug.on('collisionX', () => physics.vx *= -1);
        bug.addComponent({
            name: 'ledgeTurner',
            update: function (data) {
                if (!actor.collidesAt((hitbox.width + 1) * Utils.sign(physics.vx), 1)) {
                    physics.vx *= -1;
                }
            }
        });

        bug.on('hurt', () => {
            bug.removeComponent('enemy');
            bug.removeComponent('ledgeTurner');
            physics.vx = 0;

            sprite.setAnimation('die');
            animDie.on('finish', () => {
                Core.remove(bug);
                Core.add(new Effect('dust', { x: transform.position.x, y: transform.position.y }));
            }, { once: true });
        });

        return bug;
    };
});