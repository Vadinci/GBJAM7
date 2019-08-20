define('game/modules/state', [

], function (

) {
    const NOTHING = function(){};

    return function (settings) {
        let name = settings.name;
        if (!name) throw "state needs a name";

        let self = {
            name : name,
            create : settings.create || NOTHING,
            start : settings.start || NOTHING,
            update : settings.update || NOTHING,
            stop : settings.stop || NOTHING,
            destroy : settings.destroy || NOTHING
        };
        return self;
    };
});