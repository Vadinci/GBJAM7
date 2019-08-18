define('game/shaders/frag', [

], function (

) {
    "use strict";
    return `
		precision mediump float;
		uniform sampler2D u_currentFrame;
		uniform sampler2D u_palette;
		varying vec2 v_texcoord;
		void main() {
			float greyValue = texture2D(u_currentFrame, v_texcoord).r;
			gl_FragColor = texture2D(u_palette, vec2(greyValue, 0.5));
			//gl_FragColor = texture2D(u_currentFrame, v_texcoord);
		}
    `;
});