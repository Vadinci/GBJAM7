//polyfill for requestAnimationFrame
define('engine/animationframe', [], function() {
    var requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    window.requestAnimFrame = requestAnimFrame;
});