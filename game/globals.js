define('game/globals', [

], function (

) {
    "use strict";

    let G = {};

    G.TILE_SIZE = 16;

    G.CollisionTags = {
    	PLAYER : 1 << 0,
    	ENEMY : 1 << 2,
    	EXIT : 1 << 3,
    	PLAYER_ATTACK : 1 << 4,
    	ENEMY_ATTACK : 1 << 5
    };

    return G;
});