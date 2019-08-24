require([
    'engine/core',

    'game/gamecanvas',
    'game/utils/recorder',

    'engine/utils/keycodes',
    'engine/core/entity',

    'game/managers/camera',
    'game/managers/collision',
    'game/managers/navigation',

    'game/entities/enemies/bug'
], function (
    Core,

    GameCanvas,
    Recorder,

    KeyCodes,
    Entity,

    Camera,
    CollisionManager,
    Navigation,

    Bug
) {
    "use strict";

    let _initControls = function () {
        Core.input.bindKeys('up', KeyCodes.UP);
        Core.input.bindKeys('down', KeyCodes.DOWN);
        Core.input.bindKeys('left', KeyCodes.LEFT);
        Core.input.bindKeys('right', KeyCodes.RIGHT);

        Core.input.bindKeys('jump', KeyCodes.Z);
        Core.input.bindKeys('attack', KeyCodes.X);
    };

    let _addFilteredCanvas = function () {
        let canvas = Core.canvas;

        GameCanvas.init();

        Core.engine.on('preDraw', () => canvas.drawRect('#000', 0, 0, 160, 144, true));
        Core.engine.on('postDraw', GameCanvas.render);

        let palettes = [
            ['#2c1b01', '#1e606e', '#5bb9a9', "#c5f0c2"],
            ['#321e51', '#993429', '#d78e49', "#f7e7c6"],
            ['#2f463e', '#385e49', '#567b47', "#7e8416"],
            ['#5b3920', '#6b8d42', '#7cc67b', "#ffffb5"]
        ];
        let pIdx = 0;
        GameCanvas.setPalette(palettes[pIdx]);

        Core.input.on('keyDown-P', () => {
            pIdx = (pIdx + 1) % palettes.length;
            GameCanvas.setPalette(palettes[pIdx]);
        });

        Core.input.on('keyDown-S', () => {
            Camera.shake(10);
        });
        Core.input.on('keyDown-D', () => {
            Camera.shake(5);
        });

        CollisionManager.enable();
        Camera.enable();

        {
            let isRecording = false;
            Core.input.on('keyDown-R', () => {
                if (!isRecording) {
                    Recorder.start(GameCanvas.getCanvas());
                } else {
                    Recorder.stop();
                    setTimeout(Recorder.save, 500);
                }
                isRecording = !isRecording;
            });
        }

        Navigation.warpTo('test', 'default');

        canvas.getCanvasElement().style.width = '320px';
        canvas.getCanvasElement().style.height = '288px';
        document.body.append(canvas.getCanvasElement());

        Core.add(new Bug({
            x: 80,
            y: 60
        }));

        Core.add(new Bug({
            x: 120,
            y: 60
        }));

        let instance = Core.assets.getSound('music/ingame').play(true);
        let tryMusic = function () {
            if (instance.isPlaying) return;
            instance.play();
            setTimeout(tryMusic, 25);
        };
        tryMusic();
    };

    Core.init({
        canvas: {
            size: {
                width: 160,
                height: 144
            }
        }
    }, function () {
        Core.engine.setDebug(true);
        Core.assets.loadYaml('./assets.yaml', null, function (data) {
            let baseFolder = data.baseFolder;

            let loadFunc = undefined;
            let loadAllIn = function (group) {
                for (let key in group) {
                    loadFunc('./' + baseFolder + '/' + group[key], key);
                }
            };

            //load textures
            loadFunc = Core.assets.loadTexture;
            loadAllIn(data.textures);

            //load sounds
            loadFunc = Core.assets.loadSound;
            loadAllIn(data.sounds);

            //load yamls
            loadFunc = Core.assets.loadYaml;
            loadAllIn(data.yamls);

            //load jsons
            loadFunc = Core.assets.loadJson;
            loadAllIn(data.jsons);

            Core.assets.on('loadingComplete', function () {
                _initControls();
                _addFilteredCanvas();
            }, { once: true });
        });
        /*
        Core.assets.loadTexture('assets/player.png', 'player');
        Core.assets.loadTexture('assets/tiles.png', 'tiles');
        Core.assets.loadTexture('assets/dust.png', 'dust');
        Core.assets.loadTexture('assets/impact_pop.png', 'impact_pop');
        Core.assets.loadTexture('assets/enemy_slime.png', 'enemy_slime');
        Core.assets.loadTexture('assets/enemy_bird.png', 'enemy_bird');

        Core.assets.loadJson('assets/levels/test.json', 'levels/test');
        Core.assets.loadJson('assets/levels/test2.json', 'levels/test2');
        Core.assets.loadJson('assets/levels/test3.json', 'levels/test3');

        Core.assets.loadYaml('assets/effects.yaml', 'effects');

        Core.assets.loadSound('assets/sfx/jump.wav', 'jump');

        //Core.assets.loadYaml('assets/entities/onewayplatform.yaml', 'entities/onewayplatform');
        Core.assets.on('loadingComplete', function () {
            _initControls();
            _addFilteredCanvas();
        }, { once: true });
        */
    });

});