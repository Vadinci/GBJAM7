define('game/entities/enemies/shieldgoblin', [
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

        let _stationary = settings.properties && settings.properties.stationary;

        let _stunTimer = 0;
        let _stationaryTimer = 0;

        let shieldGoblin = new Entity({
            z: 10,
            priority: 100,
            name: 'shieldGoblin'
        });
        shieldGoblin.addTag('removeOnLevelExit');
        shieldGoblin.addTag('enemy');

        let transform = shieldGoblin.addComponent(new Transform(settings.x, settings.y));
        let hitbox = shieldGoblin.addComponent(new Hitbox(-6, -12, 12, 11));
        let actor = shieldGoblin.addComponent(new Actor());
        let collider = shieldGoblin.addComponent(new Collider());
        let physics = shieldGoblin.addComponent(new Physics({}));
        let enemy = shieldGoblin.addComponent(new Enemy({}));

        //TODO make some creator for this.
        let texture = Core.assets.getTexture('enemy_shield');
        let strip = new FrameStrip(texture, 0, 0, 32, 32, 8, 1, 16, 32);

        let animWalk = new Animation(strip.getFrames([0, 1]), 6, true);
        let animGuard = new Animation(strip.getFrames([2, 3]), 6, true);
        let animStun = new Animation(strip.getFrames([4, 5]), 8, false);
        let animDie = new Animation(strip.getFrames([6, 7]), 8, false);

        let sprite = new Sprite();
        sprite.addAnimation('walk', animWalk);
        sprite.addAnimation('guard', animGuard);
        sprite.addAnimation('stun', animStun);
        sprite.addAnimation('die', animDie);
        sprite.setAnimation('guard');

        shieldGoblin.addComponent(sprite);

        hitbox.debugColor = '#f00';

        if (_stationary) physics.vx = 0;

        let player;


        let shieldGobBehavior = shieldGoblin.addComponent({
            name: 'shieldGobBehavior',
            update: function () {
                if (!player) {
                    player = Core.engine.getByName('player')[0];
                }
                let dx = player.getComponent('transform').position.x - transform.position.x;

                if (_stunTimer > 0) {
                    _stunTimer--;
                    physics.vx *= 0.8;
                } else {
                    //face player
                    if (dx > 0) {
                        transform.scale.x = 1;
                    } else if (dx < 0) {
                        transform.scale.x = -1;
                    }

                    if (Math.abs(dx) < 25) { //shuffle away
                        physics.vx = transform.scale.x * -0.25;
                    } else if (Math.abs(dx) > 40 && Math.abs(dx) < 120) { //get closer
                        physics.vx = transform.scale.x * 0.4;
                    } else {
                        physics.vx *= 0.8;
                    }

                    if (_stationaryTimer > 0) {
                        _stationaryTimer--;
                        physics.vx = 0;
                    }

                    if (Math.abs(physics.vx) > 0.1) {
                        sprite.setAnimation('walk');
                    } else {
                        sprite.setAnimation('guard');
                    }
                }
            }
        });

        shieldGoblin.on('hurt', data => {
            if (_stunTimer <= 0) {
                if (data.otherEntity.name === 'dashAttack') {
                    _stunTimer = 120;
                    sprite.setAnimation('stun');
                    physics.vy = -1.8;
                    physics.vx = -transform.scale.x * 1.8;
                } else {
                    sprite.setAnimation('guard');
                    _stationaryTimer += 50;
                    Core.assets.getSound('hit_shield').play();

                }
                player.getComponent('playerController').hit();
            } else {
                shieldGoblin.removeComponent('enemy');
                physics.vx = 0;

                Core.assets.getSound('kill_enemy').play();

                sprite.setAnimation('die');
                animDie.on('finish', () => {
                    Core.remove(shieldGoblin);
                    Core.add(new Effect('dust', { x: transform.position.x, y: transform.position.y }));
                }, { once: true });
            }
        });

        return shieldGoblin;
    };
});