require([
    'engine/core',

    'game/gamecanvas',
    'game/utils/recorder',

    'engine/utils/keycodes',
    'engine/core/entity',

    'game/managers/screen'
], function (
    Core,

    GameCanvas,
    Recorder,

    KeyCodes,
    Entity,

    ScreenManager
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

        canvas.getCanvasElement().style.width = '320px';
        canvas.getCanvasElement().style.height = '288px';
        document.body.append(canvas.getCanvasElement());
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
                ScreenManager.showTitleScreen();
            }, { once: true });
        });
    });

});