//This is mostly salvaged from my GBJAM5 project and if it works
//I don't think I remember how or why
define('game/gamecanvas', [
    'engine/core',
    'engine/canvas',

    'game/shaders/vert',
    'game/shaders/frag'
], function (
    Core,
    Canvas,

    VertShader,
    FragShader
) {
    "use strict";

    //TODO auto-fitting

    let canvas;
    let gl;

    let sourceCanvas;
    let paletteCanvas;

    let vertexShader;
    let fragmentShader;
    let program;

    let positionLocation;
    let texCoordLocation;
    let sourceTextureLocation;
    let paletteTextureLocation;
    let resolutionLocation;

    let texCoordBuffer;
    let dimensionBuffer;

    let sourceTexture;
    let paletteTexture;

    let _initCanvas = function () {
        //TODO autoscaler
        canvas = document.createElement('canvas');
        canvas.width = sourceCanvas.width * 2;
        canvas.height = sourceCanvas.height * 2;

        document.body.append(canvas);
    };

    let _initGL = function () {
        gl = canvas.getContext('webgl');
        if (!gl) return;
    };

    let _initShaders = function () {
        vertexShader = _createShader(gl.VERTEX_SHADER, VertShader);
        fragmentShader = _createShader(gl.FRAGMENT_SHADER, FragShader);

        program = _createProgram(vertexShader, fragmentShader);
        gl.useProgram(program);

        // look up where the vertex data needs to go.
        positionLocation = gl.getAttribLocation(program, "a_position");
        texCoordLocation = gl.getAttribLocation(program, "a_texcoord");

        // provide texture coordinates for the rectangle.
        texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0
        ]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(texCoordLocation);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

        //create our source texture
        sourceTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, sourceTexture);

        // Set the parameters so we can render any size image.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        //create our palette texture
        paletteTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, paletteTexture);

        // Set the parameters so we can render any size image.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);


        // look up the sampler locations.
        sourceTextureLocation = gl.getUniformLocation(program, "u_currentFrame");
        paletteTextureLocation = gl.getUniformLocation(program, "u_palette");

        // set which texture units to render with.
        gl.uniform1i(sourceTextureLocation, 0); // texture unit 0
        gl.uniform1i(paletteTextureLocation, 1); // texture unit 1

        // Set each texture unit to use a particular texture.
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, sourceTexture);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, paletteTexture);

        //look up uniforms
        resolutionLocation = gl.getUniformLocation(program, "u_resolution");

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        // set the resolution
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

        // Create a buffer for the position of the rectangle corners.
        dimensionBuffer = gl.createBuffer();

       gl.bindBuffer(gl.ARRAY_BUFFER, dimensionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0.0, 0.0,
            canvas.width, 0.0,
            0.0, canvas.height,
            0.0, canvas.height,
            canvas.width, 0.0,
            canvas.width, canvas.height
        ]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    };

    let _createShader = function (type, source) {
        let shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }

        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    };

    let _createProgram = function (vs, fs) {
        let program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        let success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        }

        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    };

    let setPalette = function (colors) {
        if (!paletteCanvas) {
            paletteCanvas = new Canvas({
                size: { x: 64, y: 16 }
            });
            document.body.append(paletteCanvas.getCanvasElement());
        }
        for (let ii = 0; ii < 4; ii++) {
            let col = (colors[ii] || "#f0f");
            paletteCanvas.drawRect(col, 16 * ii, 0, 16, 16, true);
        }


        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, paletteTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, paletteCanvas.getCanvasElement());
    };

    let render = function () {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, sourceTexture);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceCanvas);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    let init = function (settings) {
        settings = settings || {};
        sourceCanvas = Core.canvas.getCanvasElement();
        _initCanvas();
        _initGL();
        if (!gl) {
            //TODO handle this
        }
        _initShaders();

        setPalette(settings.palette || ['#000', '#555', '#aaa', "#fff"]);
    };


    let module = {
        init: init,
        setPalette: setPalette,
        render: render
    };
    return module;
});