define('engine/core/sound', [

], function (

) {
    "use strict";
    var cache = {};

    var load = function (path, onLoad, onError) {
        onLoad = onLoad || function () {};
        onError = onError || function (e) {};

        var onSoundLoad = function (e) {
            data.loaded = true;
            data.play = play.bind(null, data.sound);

            onLoad(data, e);
            data.sound.removeEventListener("load", onSoundLoad);
            data.sound.removeEventListener("error", onSoundError);

        };

        var onSoundError = function (e) {
            data.failed = true;
            onError(data, e);
            data.sound.removeEventListener("load", onSoundLoad);
            data.sound.removeEventListener("error", onSoundError);
        };

        var data = {};
        if (cache[path]) {
            data = cache[path];
        } else {
            data.path = path;
            data.sound = new Audio();
            data.loaded = false;
            data.failed = false;
            data.dev = 0;

            cache[path] = data;
        }

        if (!data.loaded && !data.failed) {
            data.sound.addEventListener('canplay', onSoundLoad);
            data.sound.addEventListener('error', onSoundError);

            if (!data.sound.src) {
                data.sound.src = path;
            }
        } else if (data.loaded) {
            onLoad(data, {});
        }
    };

    var reloadCachedFile = function (path) {
        if (!cache[path]) {
            return;
        }
        //adding a query will force the browser to reload the asset. Obviously only use this in development environments
        cache[path].sound.src = path + "?dev=" + (cache[path].dev++);
    };

    var play = function (sound, looping, volume) {
        if (typeof sound === "String") {
            sound = cache[sound];
            if (!sound) {
                return;
            }
        }
        if (sound.sound) {
            sound = sound.sound;
        };

        var instance = sound.cloneNode();
        instance.volume = (volume !== undefined) ? volume : 1;
        instance.looping = instance.loop = looping || false;

        var soundInstance = new SoundInstance(instance);
        soundInstance.play();
        return soundInstance;
    };

    var SoundInstance = function (instance) {
        this.instance = instance;
        this.isPlaying = false;
    };

    //TODO I hate everything about this. This only happens
    //because of the "don't autoplay" policy and I feel
    //like there should be a way to get that info immediately instead of
    //through a promise rejection
    SoundInstance.prototype.play = function (onRejected) {
        let p = this.instance.play();
        let self = this;
        if (p) {
            p.then(function(){
            	self.isPlaying = true;
            }).catch(function (e) {
                self.isPlaying = false;
            });
        } else {
        	self.isPlaying = false;
        }
    };

    SoundInstance.prototype.pause = function () {
        return this.instance.pause();
    };

    SoundInstance.prototype.stop = function () {
        this.instance.currentTime = 0;
        return this.instance.pause();
    };

    Object.defineProperty(SoundInstance, "looping", {
        get: function () { return this.instance.looping; },
        set: function (val) { this.instance.looping = this.instance.loop = val; }
    });

    Object.defineProperty(SoundInstance, "volume", {
        get: function () { return this.instance.volume; },
        set: function (val) { this.instance.volume = val; }
    });

    var mod = {
        load: load,

        reloadCachedFile: reloadCachedFile,
        reload: reloadCachedFile,

        play: play
    };

    return mod;
});