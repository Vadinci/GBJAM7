define('game/entities/screens/credits', [
    'engine/core',
    'game/globals',

    'game/components/sprite',
    'game/components/transform',

    'game/modules/framestrip',
    'game/modules/animation',

    'engine/core/entity'
], function (
    Core,
    G,

    Sprite,
    Transform,

    FrameStrip,
    Animation,

    Entity
) {
    "use strict";
    return function (settings) {
        settings = settings || {};

        let creditsScreen = new Entity({
            z: 0,
            priority: 0,
            name: 'creditsScreen'
        });

        let creditsTexture = Core.assets.getTexture('thankyou');
        let creditsStrip = new FrameStrip(creditsTexture, 0, 0, 160, 72, 1, 1, 80, 36);

        let animCredits = new Animation(creditsStrip.getFrames([0]), 0, false);

        let creditsSprite = creditsScreen.addComponent(new Sprite());
        creditsSprite.addAnimation('default', animCredits);
        creditsSprite.setAnimation('default');

        let creditsTransform = creditsScreen.addComponent(new Transform(80, 60));

        creditsScreen.addComponent({
            name: 'cleanUp',
            die: function () {
                // Core.remove(logo);
                // Core.remove(button);

                // Core.input.off('keyDown', _start);
            }
        });

        return creditsScreen;
    };
});