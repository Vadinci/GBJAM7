/**
 * Seeded random
 */
define('engine/math/random', [

], function (

) {
    'use strict';
    var M = 0xffffffff; //modulus - 2^32 or 4 bytes
    var A = 1664525; //multiplier
    var C = 1013904223; //increment

    var Random = function (_seed) {
        var seed;
        var z;

        var setSeed = function (newSeed) {
            seed = newSeed || Math.round(Math.random() * M); //get a random seed using Math.random();
            seed = seed % M;
            z = seed;
        };

        var getSeed = function () {
            return seed;
        };

        var getNext = function () {
            z = (A * z + C) % M;
            return z;
        };

        var getRandom = function () {
            return getNext() / M;
        };

        var getFloat = function (a, b) {
            if (!b) {
                b = a;
                a = 0;
            }
            if (!b) {
                b = 1;
            }

            return a + getRandom() * (b - a);
        };

        var getInt = function (a, b) {
            a = a || 0;
            b = b || 0;
            if (b < a) {
                var t = a;
                a = b;
                b = t;
            }
            return Math.floor(getFloat(a, b + 1));
        };

        var getBool = function (chance) {
            chance = chance === undefined ? 0.5 : chance;
            return (getRandom() < chance);
        };

        var pick = function (arr) {
            var idx = Math.floor(getRandom() * arr.length);
            return arr[idx];
        };

        //https://en.wikipedia.org/wiki/Marsaglia_polar_method
        var __ndSpare;
        var normalDistribution = function (mean, stdDev) {
            var u;
            var v;
            var s;
            if (__ndSpare !== undefined) {
                s = __ndSpare;
                __ndSpare = undefined;
                return mean + s * stdDev;
            }

            do {
                u = getRandom() * 2 - 1;
                v = getRandom() * 2 - 1;
                s = u * u + v * v
            } while (s > 1 || s === 0);

            var mul = Math.sqrt(-2 * Math.log(s) / s);
            __ndSpare = u * mul;
            return mean + v * mul * stdDev;
        };

        setSeed(_seed);

        var mod = {
            setSeed: setSeed,
            getSeed: getSeed,

            next: getNext,
            getNext: getNext,

            getRandom: getRandom,
            random: getRandom,

            getFloat: getFloat,
            float: getFloat,
            range: getFloat,

            getInt: getInt,
            int: getInt,

            getBool: getBool,
            boolean: getBool,
            bool : getBool,

            pick: pick,

            normalDistribution: normalDistribution
        };

        Object.defineProperty(mod, "seed", {
            get: getSeed,
            set: setSeed
        });

        return mod;
    };

    Random.global = new Random();

    return Random;
});