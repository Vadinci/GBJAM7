define('game/entities/attack', [
    'engine/core',
    'engine/core/entity',

    'game/components/transform',
    'game/components/hitbox',
    'game/components/collider'
], function (
    Core,
    Entity,

    Transform,
    Hitbox,
    Collider
) {
    "use strict";
    return function (settings) {
        settings = settings || {};

        let lifeTime = settings.lifeTime || 2;

        let attack = new Entity({
            z: 1,
            priority: 100,
            name: 'attack'
        });
        let left = Math.min(settings.a.x, settings.b.x);
        let right = Math.max(settings.a.x, settings.b.x);
        let top = Math.min(settings.a.y, settings.b.y);
        let bottom = Math.max(settings.a.y, settings.b.y);

        let transform = attack.addComponent(new Transform(left, top));
        let hitbox = attack.addComponent(new Hitbox(0, 0, right - left, bottom - top));
        let collider = attack.addComponent(new Collider());

        for (let ii = 0; ii < settings.tags.length; ii++) {
            collider.addTag(settings.tags[ii]);
        };

        attack.addComponent({
            name: 'life',
            duration: lifeTime,
            update: function () {
                this.duration--;
                if (this.duration <= 0) Core.remove(attack);
            }
        });


        hitbox.debugColor = '#52a';

        return attack;
    };
});