define('game/managers/collision', [
    'engine/core'
], function (
    Core
) {
    "use strict";
    let _colliders = [];

    let _update = function () {
        let colliders = [].concat(_colliders);
        let count = colliders.length;

        for (let ii = 0; ii < count - 1; ii++) {
            let a = colliders[ii];
            if (a.tag === 0 && a.collideAgainst === 0) {
                //this collider doesn't collide with anything
                continue;
            }

            for (let jj = ii + 1; jj < count; jj++) {
                let b = colliders[jj];

                if ((a.tags & b.checkAgainst) === 0 && (b.tags & a.checkAgainst) === 0) {
                    //these colliders do not care about each other
                    continue;
                }

                if (a.collidesWith(b)) {
                    a.handleCollisionWith(b);
                    b.handleCollisionWith(a);
                }
            }
        }
    };

    let addCollider = function (col) {
        let idx = _colliders.indexOf(col);
        if (idx !== -1) throw "collider already added!";

        _colliders.push(col);
    };

    let removeCollider = function (col) {
        let idx = _colliders.indexOf(col);
        if (idx === -1) throw "collider wasn't added!";

        _colliders.splice(idx, 1);
    };

    let manager = {
        enable: function () {
            Core.engine.on('postUpdate', _update);
        },
        disable: function () {
            Core.engine.off('postUpdate', _update);
        },

        addCollider: addCollider,
        removeCollider: removeCollider,
    };
    return manager;

});