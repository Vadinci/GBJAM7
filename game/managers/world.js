define('game/managers/world', [

], function (

) {
    "use strict";

    let _actors = [];
    let _solids = [];

    let addActor = function (actor) {
        let idx = _actors.indexOf(actor);
        if (idx !== -1) {
            console.warn("actor already added to world");
            return;
        }

        _actors.push(actor);
    };
    let removeActor = function (actor) {
        let idx = _actors.indexOf(actor);
        if (idx === -1) {
            console.warn("actor wasn't added to world");
            return;
        }

        _actors.splice(idx, 1);
    };
    let getActors = function () {
        return [].concat(_actors);
    };

    let addSolid = function (solid) {
        let idx = _solids.indexOf(solid);
        if (idx !== -1) {
            console.warn("solid already added to world");
            return;
        }

        _solids.push(solid);
    };
    let removeSolid = function (solid) {
        let idx = _solids.indexOf(solid);
        if (idx === -1) {
            console.warn("solid wasn't added to world");
            return;
        }

        _solids.splice(idx, 1);
    };
    let getSolids = function () {
        return [].concat(_solids);
    };

    let manager = {
        addActor: addActor,
        removeActor: removeActor,
        getActors: getActors,

        addSolid: addSolid,
        removeSolid: removeSolid,
        getSolids: getSolids
    };
    return manager;
});