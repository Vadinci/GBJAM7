define('game/utils', [

], function () {
    return {
        sign: x => x === 0 ? 0 : x / Math.abs(x)
    };
});