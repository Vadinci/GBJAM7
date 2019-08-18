define('game/modules/frame', [

], function (

) {
    return function (texture, sx, sy, w, h, ox, oy) {

    	ox = ox || 0;
    	oy = oy || 0;

        let draw = function (target) {
            target.drawImage(texture, sx, sy, w, h, -ox, -oy, w, h);
        };

        let drawAt = function (target, tx, ty) {
            target.drawImage(texture, sx, sy, w, h, x - ox, y - oy, w, h);
        };

        let self = {
            draw: draw,
            drawAt: drawAt
        };
        return self;
    };
});