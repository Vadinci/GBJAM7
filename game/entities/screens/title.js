define('game/entities/screens/title', [
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

        let titleScreen = new Entity({
            z: 0,
            priority: 0,
            name: 'titleScreen'
        });

        let titleTexture = Core.assets.getTexture('title_screen');
        let titleStrip = new FrameStrip(titleTexture, 0, 0, 160, 144, 4, 2, 0, 0);

        let animBG = new Animation(titleStrip.getFrames([0, 1, 2, 3]), 8, true);

        let bgSprite = titleScreen.addComponent(new Sprite());
        bgSprite.addAnimation('default', animBG);
        bgSprite.setAnimation('default');

        let logo = new Entity({
            z: 1,
            priority: 0,
            name: 'titleScreen'
        });
        let logoTransform = logo.addComponent(new Transform());
        let logoSprite = logo.addComponent(new Sprite());
        let logoTexture = Core.assets.getTexture('logo');
        let logoStrip = new FrameStrip(logoTexture, 0, 0, 160, 144, 1, 1, 0, 0);

        let animLogo = new Animation(logoStrip.getFrames([0]), 0, false);
        logoSprite.addAnimation('default', animLogo);
        logoSprite.setAnimation('default');

        logo.addComponent({
            name: 'bouncer',
            update: function (data) {
                logoTransform.position.y = Math.round(Math.sin(data.frame * 0.01) * 2);
            }
        });

        Core.add(logo);

        let button = new Entity({
            z: 50,
            name: 'button',
        });

        let buttonTransform = button.addComponent(new Transform(60, 100));
        let buttonSprite = button.addComponent(new Sprite());
        let buttonTexture = Core.assets.getTexture('start_button');
        let buttonStrip = new FrameStrip(buttonTexture, 0, 0, 41, 16, 1, 1, 0, 0);

        let animButton = new Animation(buttonStrip.getFrames([0]), 0, false);
        buttonSprite.addAnimation('default', animButton);
        buttonSprite.setAnimation('default');

        button.addComponent({
            name: 'blinker',
            update: function (data) {
                if (data.frame % 40 !== 0) return;
                buttonTransform.position.y *= -1;
            }
        });

        Core.add(button);

        let _start = function (data) {
            if (!Core.input.keyPressed('attack') && !Core.input.keyPressed('jump')) return;
            settings.onStart && settings.onStart();
            Core.assets.getSound('start_game').play();
        };

        Core.input.on('keyDown', _start);

        titleScreen.addComponent({
            name: 'cleanUp',
            die: function () {
                Core.remove(logo);
                Core.remove(button);

                Core.input.off('keyDown', _start);
            }
        });

        return titleScreen;
    };
});