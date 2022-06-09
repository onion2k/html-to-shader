import * as twgl from 'twgl.js';
import './style.css';

/*

This does work... but only if you change the source. Just hit return here.

*/

// grab the SVG
const svg = document.getElementById('svg');
svg.style.display = 'none';

// turn the SVG data in to a string
const svgString = new XMLSerializer().serializeToString(svg);
const u64SvgString = btoa(unescape(encodeURIComponent(svgString)));

// Render the SVG data to an image
let image = new Image();
image.setAttribute('src', 'data:image/svg+xml;base64,' + u64SvgString);

// create a canvas
const c2 = document.createElement('canvas');
c2.width = 1024;
c2.height = 1024;

// copy the image to the canvas
const ctx2 = c2.getContext('2d');
ctx2.drawImage(image, 0,0);

// set up some twgl boilerplate
const mX = 1,
const mY = 1;
const canvas = document.getElementById('c');

const  gl = twgl.getWebGLContext(canvas);
const  programInfo = twgl.createProgramInfo(gl, ['vs', 'fs']);

// set up a texture uniform using the canvas of the image of the SVG of the HTML
let imgTex = twgl.createTexture(gl, {
  src: ctx2.canvas,
  crossOrigin: '',
  mag: gl.NEAREST,
  wrap: gl.REPEAT,
  flipY: true,
});

const  arrays = {
  position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
};

const  bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

// make it all wibbly
function render(time) {
  twgl.resizeCanvasToDisplaySize(gl.canvas);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  const  uniforms = {
    u_time: time * 0.001,
    u_resolution: [gl.canvas.width, gl.canvas.height],
    u_texture: imgTex,
  };

  gl.useProgram(programInfo.program);

  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  twgl.setUniforms(programInfo, uniforms);
  twgl.drawBufferInfo(gl, bufferInfo);

  requestAnimationFrame(render);
}

//Get this party started
requestAnimationFrame(render);
