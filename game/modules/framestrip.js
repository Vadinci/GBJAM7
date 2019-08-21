define('game/modules/framestrip', [
    'game/modules/frame'
], function (
    Frame
) {
    return function (texture, sx, sy, w, h, cols, rows, ox, oy) {
        "use strict";

        let _frames = [];

        for (let ir = 0; ir < rows; ir++) {
            for (let ic = 0; ic < cols; ic++) {
                _frames.push(new Frame(
                    texture,
                    sx + ic * w, sy + ir * h,
                    w, h,
                    ox || 0, oy || 0
                ));
            }
        };

        let getFrames = function (indices) {
            indices = [].concat(indices);
            let result = [];
            for (let ii = 0; ii < indices.length; ii++) {
                let idx = indices[ii];
                if (idx < 0 || idx >= cols * rows) {
                    console.warn('frame index out of bounds');
                    continue;
                }
                result.push(_frames[idx]);
            }
            return result;
        };

        let self = {
            getFrames: getFrames
        };
        return self;
    };
});