define('game/globals', [

], function (

) {
    "use strict";

    let G = {};

    G.TILE_SIZE = 16;

    G.CollisionTags = {
    	PLAYER : 1 << 0,

    	EXIT : 1 << 3,
    };

    return G;
});