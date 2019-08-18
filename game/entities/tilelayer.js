define('game/entities/tilelayer', [
    'engine/core',
    'engine/canvas',
    'engine/core/entity',

    'game/components/transform'
], function (
    Core,
    Canvas,
    Entity,

    Transform
) {
    "use strict";
    let canvas;
    let canvasElement;

    return function (settings) {
        settings = settings || {};

        let map = settings.map;
        if (!map) throw "tilelayer entity needs a map";


        if (!canvas) {
            canvas = new Canvas({
                size: { width: 160, height: 144 }
            });
            canvasElement = canvas.getCanvasElement();
        };

        canvas.width = map.width * 16;
        canvas.height = map.height * 16;
        canvas.clear();

        let tileLayer = new Entity({
            z: 0,
            priority: 100,
            name: 'tileLayer'
        });

        tileLayer.addComponent(new Transform());

        let tilesLayer = map.getTileLayer('tiles');
        let tileTexture = Core.assets.getTexture('tiles');
        let texWidth = tileTexture.width / 16;

        for (let ix = 0; ix < map.width; ix++) {
            for (let iy = 0; iy < map.height; iy++) {
                if (!tilesLayer[ix][iy]) continue;
                let idx = tilesLayer[ix][iy].idInSet;

                let texCol = idx % texWidth;
                let texRow = Math.floor(idx / texWidth);

                canvas.drawImage(tileTexture, texCol * 16, texRow * 16, 16, 16, ix * 16, iy * 16, 16, 16);
            }
        }

        tileLayer.addComponent({
            name: 'tileRenderer',
            draw: function (data) {
                data.canvas.drawImageSimple(canvasElement, 0, 0);
            }
        });


        return tileLayer;
    };
});