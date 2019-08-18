define('engine/modules/savedata', [

], function (

) {
    "use strict"
    let id = 'GBJAM7-VAD'; //TODO pass from core init

    let storage = window.localStorage;


    let save = function (key, data) {
        storage.setItem(id + key, JSON.stringify(data));
    };

    let load = function (key, defVal) {
        let data = storage.getItem(uniqueID + dataKey);
        if (data === null || data === undefined) {
            return defVal;
        }
        return JSON.parse(data);
    };

    let module = {
        save: save,
        load: load
    };
    return module;
});