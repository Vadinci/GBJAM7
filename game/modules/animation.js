define('game/modules/animation', [
    'engine/core/dispatcher'
], function (
    Dispatcher
) {
    return function (frames, fps, looping, frameSpeeds) {
        if (frames.length === 0) {
            console.error("can't define an animation with 0 frames!");
        }

        let _dispatcher = new Dispatcher();

        let _frameIdx = 0;
        let _currentFrame = frames[0];
        let _firedFinish = false;

        let update = function () {
            //TODO implement framespeeds
            _frameIdx = _frameIdx + (fps / 60);

            if (_frameIdx >= frames.length) {
                if (looping) {
                    _frameIdx -= frames.length;
                    _dispatcher.emit('loop');
                } else {
                    _frameIdx = frames.length - 1;
                    if (!_firedFinish) {
                        _dispatcher.emit('finish');
                        _firedFinish = true;
                    }
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
            _firedFinish = false;
        };

        let self = {
            update: update,
            draw: draw,
            drawAt: drawAt,

            setFrame: setFrame,

            on : _dispatcher.on,
            off : _dispatcher.off,

            clone: () => console.warn('not implemented')
        };
        return self;
    };
});