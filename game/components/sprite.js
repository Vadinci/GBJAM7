define('game/components/sprite', [

], function (

) {
    return function (animations) {
        let _animations = {};
        let _currentAnimation;

        let _init = function () {
            //TODO parse incoming animations
        };

        let addAnimation = function (key, animation) {
            if (_hasAnimation(key)) return;
            _animations[key] = animation;
        };

        let _hasAnimation = function (key) {
            if (!_animations[key]) {
                return false;
            }
            return true;
        };

        let setAnimation = function (key) {
            if (!_hasAnimation(key)) return;

            if (_currentAnimation === _animations[key]) return;
            _currentAnimation = _animations[key];
            _currentAnimation.setFrame(0);
        };

        let getAnimation = function (key) {
            if (!_hasAnimation(key)) return;
            return _animations[key];
        };

        let getCurrentAnimation = function () {
            return _currentAnimation;
        }

        let removeAnimation = function (key) {
            if (!_hasAnimation(key)) return;
            if (_currentAnimation === _animations[key]) {
                _currentAnimation = undefined;
            }
            _animations[key] = undefined;
            delete _animations[key];
        };

        let update = function () {
            if (!_currentAnimation) return;

            _currentAnimation.update();
        };

        //TODO how does target get here?
        let draw = function (data) {
            if (!_currentAnimation) return;

            _currentAnimation.draw(data.canvas);
        };

        let self = {
            name: 'sprite',

            addAnimation: addAnimation,
            setAnimation: setAnimation,
            getAnimation: getAnimation,
            getCurrentAnimation: getCurrentAnimation,
            removeAnimation: removeAnimation,

            update: update,
            draw: draw
        };

        _init();

        return self;
    };
});