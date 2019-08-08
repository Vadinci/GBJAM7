//TODO improve on the addToElement property

define('engine/canvas', [

], function(

){
	/*
	*settings:
	*canvas
	*canvasID
	*size,
	*addToElement
	*/
	return function(settings){
		var canvas;
		var context;
		var width = 0;
		var height = 0;

		var init = function(_settings){
			if (_settings.canvas){
				canvas = _settings.canvas;
			} else if (_settings.canvasID){
				canvas = document.getElementById(_settings.canvasID);
			} else if (_settings.size){
				canvas = document.createElement('canvas');
				canvas.width = _settings.size.x;
				canvas.height = _settings.size.y;
				if (_settings.addToElement){
					var element = document.getElementById(_settings.addToElement);
					element = element || document.body;
					element.appendChild(canvas);
				}
			}
			if (canvas){
				context = canvas.getContext('2d');
				width = canvas.width;
				height = canvas.height;
			}

		};

		init(settings);

		var clear = function(){
			context.clearRect(0, 0, width, height);
		};

		var save = function(){
			context.save();
		};

		var restore = function(){
			context.restore();
		};

		var translate = function(x, y){
			context.translate(x, y);
		};

		var scale = function(sx, sy){
			context.scale(sx, sy);
		};

		var rotate = function(angle){
			context.rotate(angle);
		};

		var drawCircle = function(color, x, y, r, filled, lineWidth){
			if (filled){
				context.fillStyle = color;
			} else {
				context.strokeStyle = color;
				context.lineWidth = lineWidth;
			}

			context.beginPath();
			context.arc(x, y, r, 0, Math.PI*2);

			if (filled){
				context.fill();
			} else {
				context.stroke();
			}
			context.closePath();

			context.fillStyle = null;
			context.strokeStyle = null;
			context.lineWidth = 0;
		};

		var drawRect = function(color, x, y, w, h, filled, lineWidth){
			if (filled){
				context.fillStyle = color;
			} else {
				context.strokeStyle = color;
				context.lineWidth = lineWidth;
			}

			if (filled){
				context.fillRect(x, y, w, h);
			} else {
				context.strokeRect(x, y, w, h);
			}

			context.fillStyle = null;
			context.strokeStyle = null;
			context.lineWidth = 0;
		};

		var drawPolygon = function(color, points, originX, originY, filled, lineWidth){
			points = points || [];
			if (points.length < 3){
				return;
			}
			var ii;

			translate(originX, originY);
			if (filled){
				context.fillStyle = color;
			} else {
				context.strokeStyle = color;
				context.lineWidth = lineWidth;
			}

			context.beginPath();

			context.beginPath();
			context.moveTo(points[0].x, points[0].y);
			for (ii = 1; ii < points.length; ii++){
				context.lineTo(points[ii].x, points[ii].y);
			}
			context.lineTo(points[0].x, points[0].y);

			if (filled){
				context.fill();
			} else {
				context.stroke();
			}
			context.closePath();

			context.fillStyle = null;
			context.strokeStyle = null;
			context.lineWidth = 0;

			translate(-originX, -originY);
		};

		var drawImage = function(img, sx, sy, sw, sh, x, y, w, h) {
            context.drawImage(img, sx, sy, sw, sh, x, y, w, h);
        };

		var drawImageSimple = function(img, x, y) {
            context.drawImage(img, x, y);
        };

		var setComposite = function(operation){
			context.globalCompositeOperation = operation;
		};

		var setAlpha = function(alpha){
			context.globalAlpha = alpha;
		};

		var addAlpha = function(alpha){
			if (alpha < 0){
				alpha = -1/alpha;
			};

			context.globalAlpha *= alpha;
		};

		var getAlpha = function(){
			return context.globalAlpha;
		};

		var getContext = function(){
			return context;
		};

		var getCanvasElement = function(){
			return canvas;
		};

		var addEventListener = function(){
			canvas.addEventListener.apply(canvas, arguments);
		};

		var module = {
			clear : clear,

			save : save,
			restore : restore,

			translate : translate,
			scale : scale,
			rotate : rotate,

			drawCircle : drawCircle,
			drawRect : drawRect,
			drawPolygon : drawPolygon,

			drawImage : drawImage,
			drawImageSimple : drawImageSimple,

			setComposite : setComposite,

			setAlpha : setAlpha,
			addAlpha : addAlpha,
			getAlpha : getAlpha,

			getContext : getContext,
			getCanvasElement : getCanvasElement,

			addEventListener : addEventListener
		};

		Object.defineProperty(module, 'width', {
			get : function(){ return width; },
			set : function(val) { }
		});

		Object.defineProperty(module, 'height', {
			get : function(){ return height; },
			set : function(val) { }
		});

		return module;
	};
});