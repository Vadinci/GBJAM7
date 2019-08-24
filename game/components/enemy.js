define('game/components/enemy', [
    'engine/core',

    'game/globals',
    'game/utils'
], function (
    Core,

    G,
    Utils
) {
    return function (settings) {
        let _entity;
        let _collider = settings.collider;
        let _physics;

        let onCollision = function (data) {
            if (data.otherCollider.tags & G.CollisionTags.PLAYER_ATTACK) {
                _entity.emit('hurt', data);
            }
        }

        let self = {
            name: 'enemy',

            start: function (data) {
                _entity = data.entity;


                _collider = _collider || _entity.getComponent('collider');
                if (!_collider) throw "enemy needs a collider component";
                _collider.addTag(G.CollisionTags.HARM);

                _collider.addCheck(G.CollisionTags.PLAYER_ATTACK);

                _entity.on('collisionStart', onCollision);
            },
            die: function () {
                _collider.removeTag(G.CollisionTags.HARM);
                _collider.removeCheck(G.CollisionTags.PLAYER_ATTACK);

                _entity.off('collisionStart', onCollision);
            }
        };

        return self;
    }
});