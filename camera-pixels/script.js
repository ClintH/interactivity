const cameraEl = document.getElementById('camera');
const canvasEl = document.getElementById('captureCanvas');
const offscreenCanvasEl = document.getElementById('offscreenCanvas');

cameraEl.addEventListener('play', () => {
  console.log("Video stream started");
  offscreenCanvasEl.width = cameraEl.videoWidth;
  offscreenCanvasEl.height = cameraEl.videoHeight;
  canvasEl.width = cameraEl.videoWidth;
  canvasEl.height = cameraEl.videoHeight;

  // Grab the first frame from the camera now that the stream has started
  window.requestAnimationFrame(renderFrame);  
});

startCamera();

// Demonstrates a mediated rendering of video frames
function renderFrame() {
  let offscreenC = offscreenCanvasEl.getContext('2d');
  let c = canvasEl.getContext('2d');

  // 1. Capture to offscreen canvas
  offscreenC.drawImage(cameraEl, 0, 0);
  
  // 2. Do whatever processing we want to the this buffer
  // Example from: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Manipulating_video_using_canvas
  let frame = offscreenC.getImageData(0, 0, offscreenCanvasEl.width, offscreenCanvasEl.height);

  let blueCount = 0;

  // 4 is used here since frame is represented as R G B A
  let l = frame.data.length / 4;  
  for (let i = 0; i < l; i++) {
    let r = frame.data[i * 4 + 0];
    let g = frame.data[i * 4 + 1];
    let b = frame.data[i * 4 + 2];

    // If pixel values exceed a threshold, set it to transparent
    // Here, throwing away pixels which are low in blue
    if (b < 150) {
      frame.data[i * 4 + 3] = 0; // Set alpha to 0, transparent
      blueCount++;
    }
  }

  // Draw something in the background
  var gradient = c.createLinearGradient(0,0, canvasEl.width, canvasEl.height);
  gradient.addColorStop(0, 'deeppink');
  gradient.addColorStop(1, 'palegreen');
  
  c.fillStyle = gradient;
  c.fillRect(0, 0, canvasEl.width, canvasEl.height);

  // Write image data to destination context
  offscreenC.putImageData(frame, 0, 0);

  c.drawImage(offscreenCanvasEl, 0, 0);

  // % of image that is 'blue enough'
  let blueValue = 100 - parseInt(100*(blueCount / (frame.data.length /4)));
  c.fillStyle = 'white';
  c.font = '48px "Fira Code", Monaco, "Andale Mono", "Lucida Console", "Bitstream Vera Sans Mono", "Courier New", Courier, monospace';
  c.fillText(blueValue +"%", 100, 100);

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