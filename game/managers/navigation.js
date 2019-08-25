define('game/managers/navigation', [
    'engine/core',

    'game/modules/level'
], function (
    Core,

    Level
) {
    "use strict";
    let _currentLevel;
    let _currentSpawnKey = 'default';

    let Screen;

    require(['game/managers/screen'], K => Screen = K);


    let warpTo = function (levelKey, spawnKey) {
        if (levelKey === 'finishGame'){
            Screen.showCreditsScreen();
            return;
        }

        // console.log(`warping to ${levelKey}:${spawnKey}`);
        if (_currentLevel) {
            _currentLevel.clear();
        }

        _currentSpawnKey = spawnKey;
        _currentLevel = new Level(levelKey);

        _currentLevel.init(_currentSpawnKey);
    };

    let getCurrentLevel = function () {
        return _currentLevel;
    };

    let manager = {
        warpTo: warpTo,
        getCurrentLevel : getCurrentLevel
    };
    return manager;

});