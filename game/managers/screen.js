define('game/managers/screen', [
    'engine/core',

    'game/globals',
    'game/utils',

    'game/entities/screens/title',
    'game/entities/screens/credits',

    'game/managers/collision',
    'game/managers/camera',
    'game/managers/navigation'
], function (
    Core,

    G,
    Utils,

    TitleScreen,
    CreditsScreen,

    CollisionManager,
    Camera,
    Navigation
) {
    "use strict";

    let _stopCurrentScreen = null;

    let _doStopCurrentScreen = function () {
        if (_stopCurrentScreen) _stopCurrentScreen();
        _stopCurrentScreen = null;
    };

    let showTitleScreen = function () {
        _doStopCurrentScreen();

        let titleScreen = new TitleScreen({
            onStart: function () {
                startGame();
            }
        });
        Core.add(titleScreen);

        let titleMusic = Core.assets.getSound('music/title').play(true);
        let tryMusic = function () {
            if (!titleMusic || titleMusic.isPlaying) return;
            titleMusic.play();
            setTimeout(tryMusic, 25);
        };
        tryMusic();

        _stopCurrentScreen = function () {
            Core.remove(titleScreen);
            titleMusic.stop();
            titleMusic = null;
        }
    };

    let showCreditsScreen = function () {
        _doStopCurrentScreen();

        let creditsScreen = new CreditsScreen({
            onStart: function () {
                startGame();
            }
        });
        Core.add(creditsScreen);

        /*
        let titleMusic = Core.assets.getSound('music/title').play(true);
        let tryMusic = function () {
            if (!titleMusic || titleMusic.isPlaying) return;
            titleMusic.play();
            setTimeout(tryMusic, 25);
        };
        tryMusic();
        */

        _stopCurrentScreen = function () {
            Core.remove(creditsScreen);
            // titleMusic.stop();
            // titleMusic = null;
        }
    };

    let startGame = function () {
        _doStopCurrentScreen();

        let firstMap = 'test';

        CollisionManager.enable();
        Camera.enable();

        Navigation.warpTo(firstMap, 'default');

        let gameMusic = Core.assets.getSound('music/ingame').play(true);
        let tryMusic = function () {
            if (!gameMusic || gameMusic.isPlaying) return;
            gameMusic.play();
            setTimeout(tryMusic, 25);
        };
        tryMusic();

        _stopCurrentScreen = function () {
            CollisionManager.disable();
            Camera.disable();
            Navigation.getCurrentLevel().clear();

            gameMusic.stop();
            gameMusic = null;
        };
    };

    var self = {
        showTitleScreen: showTitleScreen,
        showCreditsScreen: showCreditsScreen,
        startGame: startGame
    };
    return self;
});