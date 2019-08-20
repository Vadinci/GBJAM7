define('game/components/enemy', [
    'game/globals',
    'game/utils'
], function (
    G,
    Utils
) {
    return function (settings) {
        let _entity;
        let _collider = settings.collider;
        let _physics;

        let self = {
            name: 'enemy',

            start: function (data) {
                _entity = data.entity;


                _collider = _collider || _entity.getComponent('collider');
                if (!_collider) throw "enemy needs a collider component";
                _collider.addTag(G.CollisionTags.ENEMY);

                _collider.addCheck(G.CollisionTags.PLAYER_ATTACK);

                _entity.on('collision', data => {
                    if (data.otherCollider.tags & G.CollisionTags.PLAYER_ATTACK){
                        //TODO take damage and whatnot
                    }
                });

                //TODO get physics
            },
            die: function () {

            }
        };

        return self;
    }
});