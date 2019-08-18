define('engine/core/texture', [

], function(

){
	"use strict";
	let cache = {};

	let load = function(path, onLoad, onError){
		onLoad = onLoad || function(){};
		onError = onError || function(e){};

		let onTextureLoad = function(e){
			data.loaded = true;
			onLoad(data, e);
			data.texture.removeEventListener("load", onTextureLoad);
			data.texture.removeEventListener("error", onTextureError);
		};

		let onTextureError = function(e){
			data.failed = true;
			onError(data, e);
			data.texture.removeEventListener("load", onTextureLoad);
			data.texture.removeEventListener("error", onTextureError);
		};

		let data = {};
		if (cache[path]){
			data = cache[path];
		} else {
			data.path = path;
			data.texture = new Image();
			data.loaded = false;
			data.failed = false;
			data.dev = 0;

			cache[path] = data;
		}
		if (!data.loaded && !data.failed){
			data.texture.addEventListener('load', onTextureLoad);
			data.texture.addEventListener('error', onTextureError);

			if(!data.texture.src){
				data.texture.src = path;
			}
		} else if (data.loaded){
			onLoad(data, {});
		}
	};

	let reloadCachedFile = function(path){
		if (!cache[path]){
			return;
		}
		//adding a query will force the browser to reload the asset. Obviously only use this in development environments
		cache[path].texture.src = path+"?dev="+(cache[path].dev++);
	};

	//not sure if this actually works
	let removeFromCache = function(path){
		if (!cache[path]){
			return;
		}
		//replace image with a teeny tiny gif
		cache[path].texture.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
		cache[path] = null;
	}

	let clearCache = function(path){
		let key;
		for (let key in cache){
		    if (cache.hasOwnProperty(key)){
		    	removeFromCache(key);
		    }
		}
	};

	let module = {
		load : load,

		unload : removeFromCache,
		removeFromCache : removeFromCache,

		reload : reloadCachedFile,
		reloadCachedFile : reloadCachedFile,

		clearCache : clearCache
	};
	return module;
});