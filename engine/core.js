define('engine/core', [
	'engine/animationframe',
    'engine/canvas',
    'engine/engine',
    'engine/core/input',

    'engine/modules/assets',
    'engine/modules/savedata',

    'engine/math/random'
], function (
	AnimationFrame,
    Canvas,
    Engine,
    Input,

    Assets,
    SaveData,

    Random
) {
	"use strict";

	let canvas;
	let input;
	let random;

    let init = function (settings, onComplete) {
    	random = new Random(settings.randomSeed);
        module.random = random;

    	canvas = new Canvas(settings.canvas);
    	module.canvas = canvas;

    	Input.init(canvas);
    	Engine.init(canvas);

    	if (onComplete){
    		onComplete();
    	}
    };

    let module = {
        init: init,

        canvas : canvas,

        input : Input,
        engine : Engine,
        assets : Assets,
        saveData: SaveData,

        add : Engine.add,
        remove : Engine.remove
    };
    return module;
});