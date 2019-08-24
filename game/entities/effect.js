define('game/entities/effect', [
    'game/globals',
    'game/utils',

    'engine/core',
    'engine/core/entity',

    'game/components/transform',

    'game/modules/framestrip',
    'game/modules/animation',
    'game/components/sprite'
], function (
    G,
    Utils,

    Core,
    Entity,

    Transform,

    FrameStrip,
    Animation,
    Sprite
) {
    "use strict";
    return function (key, position) {
        position = position || {};

        let effect = new Entity({
            z: 20,
            priority: 100,
            name: 'effect'
        });
        effect.addTag('removeOnLevelExit');
        effect.addTag('effect');

        let transform = effect.addComponent(new Transform(position.x, position.y));

        let fxData = Core.assets.getYaml('effects')[key];

        let texture = Core.assets.getTexture(fxData.texture);
        let strip = new FrameStrip(texture, fxData.offsetX, fxData.offsetY, fxData.frame.width, fxData.frame.width, fxData.frameCountX, fxData.frameCountY, fxData.frame.originX, fxData.frame.originY);

        let anim = new Animation(strip.getFrames(fxData.frames), fxData.speed, false);

        let sprite = new Sprite();

        sprite.addAnimation('default', anim);
        sprite.setAnimation('default');

        effect.addComponent(sprite);

        anim.on('finish', () => Core.remove(effect));


        return effect;
    };
});