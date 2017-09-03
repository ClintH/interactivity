//import {gpgpu_util, GPGPUContext, NDArrayMathCPU, NDArrayMathGPU} from './deeplearnjs/dist/src/';
//import * as imagenet_util from './deeplearnjs/dist/demos/models/imagenet_util.js';
//import {SqueezeNet} from './deeplearnjs/dist/demos/models/';

// Code is adapted from https://github.com/PAIR-code/deeplearnjs/tree/master/demos/imagenet
export default function() { 
  const IMAGE_SIZE = 227;
  const TOP_K_CLASSES = 5;
  const cameraEl = document.getElementById('camera');
  const canvasEl = document.getElementById('captureCanvas');
  const inferenceEl = document.getElementById('inferenceCanvas');
  const resultsEl = document.getElementById('results');
  let math, mathCPU, squeeze, gl, gpgpu = null;

  // Initialise WebGL stuff
  gl = deeplearn.gpgpu_util.createWebGLContext(inferenceEl);
  gpgpu = new deeplearn.GPGPUContext(gl);
  math = new deeplearn.NDArrayMathGPU(gpgpu);
  mathCPU = new deeplearn.NDArrayMathCPU();
  squeeze = new squeezenet.SqueezeNet(gpgpu, math);
  squeeze.loadVariables().then(() => {
    console.log("squeezeNet ready");
    startCamera();
  });

  cameraEl.addEventListener('play', () => {
    // Video stream started
    window.requestAnimationFrame(renderFrame)
  });

// Demonstrates a mediated rendering of video frames
function renderFrame() {
  let layerNames = null;
  let canvasTextureShape = [ IMAGE_SIZE, IMAGE_SIZE];
  let canvasTexture = math.getTextureManager().acquireTexture(canvasTextureShape);
  gpgpu.uploadPixelDataToTexture(canvasTexture, cameraEl);
  math.scope((keep, track) => {
    var x = squeeze.preprocessColorTextureToArray3D(canvasTexture, canvasTextureShape);
    const preprocesssedInput = track(x);
    const inferenceResult = squeeze.infer(preprocesssedInput);
    const namedActivations = inferenceResult.namedActivations;
    layerNames = Object.keys(namedActivations);
    layerNames.forEach(layerName => track(namedActivations[layerName]));

    const topClassesToProbability = squeeze.getTopKClasses(inferenceResult.logits, TOP_K_CLASSES);
    var r = "";
    Object.keys(topClassesToProbability).forEach(layerName => r += layerName + " = " + topClassesToProbability[layerName] + "<br />");
    resultsEl.innerHTML = r;
  });
  math.getTextureManager().releaseTexture(canvasTexture, canvasTextureShape);

  
  // Repeat!
 window.requestAnimationFrame(renderFrame); 
}


// ------------------------

// Reports outcome of trying to get the camera ready
function cameraReady(err) {
  if (err) {
    console.log("Camera not ready: " + err);
    return;
  }
  console.log("Camera ready");
}

// Tries to get the camera ready, and begins streaming video to the cameraEl element.
function startCamera() {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  if (!navigator.getUserMedia) {
    cameraReady("getUserMedia not supported");
    return;
  }
  navigator.getUserMedia({video:true}, 
    (stream) => {
      cameraEl.src = window.URL.createObjectURL(stream);
      cameraReady();
    },
    (error) => {
      cameraNotReady(error);
    }
  );
}
}