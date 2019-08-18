define('game/modules/animation', [

], function (

) {
    return function (frames, fps, looping, frameSpeeds) {
        if (frames.length === 0) {
            console.error("can't define an animation with 0 frames!");
        }

        let _frameIdx = 0;
        let _currentFrame = frames[0];

        let update = function () {
            //TODO implement framespeeds
            _frameIdx = _frameIdx + (fps / 60);

            if (_frameIdx >= frames.length) {
                if (looping) {
                    _frameIdx -= frames.length;
                    //TODO emit event?
                } else {
                    _frameIdx = frames.length - 1;
                }
            }

            _currentFrame = frames[_frameIdx | 0];
        };

        let draw = function (target) {
            _currentFrame.draw(target);
        };

        let drawAt = function (target, x, y) {
            _currentFrame.drawAt(target, x, y);
        };

        let setFrame = function (f) {
            _frameIdx = f % frames.length;
            _currentFrame = frames[_frameIdx | 0];
        };

        let self = {
            update: update,
            draw: draw,
            drawAt: drawAt,

            setFrame: setFrame,

            clone: () => console.warn('not implemented')
        };
        return self;
    };
});