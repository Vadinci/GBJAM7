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

    let _initControls = function(){
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
            x : 80,
            y : 70
        }));

        console.log(Core.assets.getYaml('entities/onewayplatform'));
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
        Core.assets.loadTexture('assets/player.png', 'player');
        Core.assets.loadTexture('assets/tiles.png', 'tiles');
        Core.assets.loadTexture('assets/enemy_slime.png', 'enemy_slime');
        Core.assets.loadJson('assets/levels/test.json', 'levels/test');
        Core.assets.loadJson('assets/levels/test2.json', 'levels/test2');
        Core.assets.loadJson('assets/levels/test3.json', 'levels/test3');
        //Core.assets.loadYaml('assets/entities/onewayplatform.yaml', 'entities/onewayplatform');
        Core.assets.on('loadingComplete', function () {
            _initControls();
            _addFilteredCanvas();
        }, { once: true });
    });

});