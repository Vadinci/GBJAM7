require([
    'engine/core',

    'game/gamecanvas',
    'engine/utils/keycodes',
    'engine/core/entity',

    'game/modules/frame',
    'game/modules/animation',
    'game/modules/tiledmap',
    'game/components/sprite',
    'game/components/transform',
    'game/components/actor',
    'game/components/hitbox',

    'game/entities/player',
    'game/entities/walls',
    'game/entities/tilelayer',
    'game/entities/cameracontroller',

    'game/managers/camera'
], function (
    Core,

    GameCanvas,
    KeyCodes,
    Entity,

    Frame,
    Animation,
    TiledMap,
    Sprite,
    Transform,
    Actor,
    Hitbox,

    Player,
    Walls,
    TileLayer,
    CameraController,

    Camera
) {
    "use strict";

    let addFilteredCanvas = function () {
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
        GameCanvas.setPalette(palettes[0]);

        Core.input.on('keyDown-P', () => {
            GameCanvas.setPalette(Core.random.pick(palettes));
        });


        let player = new Player({ x: 30, y: 60 });
        Core.add(player);

        let map = new TiledMap('levels/test2');

        let walls = new Walls({
            map: map
        });
        Core.add(walls);

        let tileLayer = new TileLayer({
            map: map
        });
        Core.add(tileLayer);

        Camera.enable();

        Camera.setBounds(0, 0, 16 * map.width, 16 * map.height);

        let controller = new Entity({});
        controller.addComponent({
            name: 'controller',
            update: function () {
                if (Core.input.keyDown(KeyCodes.A)) Camera.move(-1, 0);
                if (Core.input.keyDown(KeyCodes.D)) Camera.move(1, 0);
                if (Core.input.keyDown(KeyCodes.W)) Camera.move(0, -1);
                if (Core.input.keyDown(KeyCodes.S)) Camera.move(0, 1);
            }
        });
        Core.add(controller);

        Core.add(new CameraController({
            player: player
        }));

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
        Core.assets.loadTexture('assets/player.png', 'player');
        Core.assets.loadTexture('assets/tiles.png', 'tiles');
        Core.assets.loadJson('assets/levels/test.json', 'levels/test');
        Core.assets.loadJson('assets/levels/test2.json', 'levels/test2');
        Core.assets.on('loadingComplete', function () {
            addFilteredCanvas();
        }, { once: true });
    });

});