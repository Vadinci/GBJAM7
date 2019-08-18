define('game/components/onewaysolid', [
    'game/components/solid'
], function (
    Solid
) {
    return function (settings) {
        let solid = new Solid(settings)

        let _oldOverlapsActor = solid.overlapsActor;

        solid.overlapsActor = function (actor, dx, dy) {
            if (actor.hitbox.bottom + dy - 1 > solid.hitbox.top) return false;
            return _oldOverlapsActor(actor, dx, dy);
        }

        return solid;
    }
});