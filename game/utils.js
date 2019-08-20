define('game/utils', [

], function () {
    return {
        sign: x => x === 0 ? 0 : x / Math.abs(x),
        step: function (from, to, maxStep) {
            if (Math.abs(from - to) < 0.0001) return to;
            if (from > to) {
                return Math.max(to, from - maxStep);
            } else {
                return Math.min(to, from + maxStep);
            }
        }
    };
});