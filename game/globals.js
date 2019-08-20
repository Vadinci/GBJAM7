define('game/globals', [

], function (

) {
    "use strict";

    let G = {};

    G.TILE_SIZE = 16;

    G.CollisionTags = {
    	PLAYER : 1 << 0,
    	HARM : 1 << 2,
    	EXIT : 1 << 3,
    	PLAYER_ATTACK : 1 << 4
    };

    return G;
});