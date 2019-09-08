// @ts-nocheck
const cameraEl = document.getElementById('camera');
const canvasEl = document.getElementById('captureCanvas');
const offscreenCanvasEl = document.getElementById('offscreenCanvas');
let oldFrame = null;
let oldFrameCapturedAt = 0;

startCamera();

cameraEl.addEventListener('play', () => {
  console.log('Video stream started');
  offscreenCanvasEl.width = cameraEl.videoWidth;
  offscreenCanvasEl.height = cameraEl.videoHeight;
  canvasEl.width = cameraEl.videoWidth;
  canvasEl.height = cameraEl.videoHeight;

  // Start processing frames
  window.requestAnimationFrame(renderFrame);
});

function renderFrame() {
  let offscreenC = offscreenCanvasEl.getContext('2d');
  let c = canvasEl.getContext('2d');

  // 1. Capture to offscreen buffer
  offscreenC.drawImage(cameraEl, 0, 0);
  let frame = offscreenC.getImageData(0, 0, offscreenCanvasEl.width, offscreenCanvasEl.height);

  // Keep track of how many pixels have changed
  let diffCount = 0;

  let totalPixels = frame.data.length / 4;   // 4 is used here since frame is represented as RGBA

  // If we've already processed a frame, compare the new frame with it
  if (oldFrame !== null) {
    // Iterate over each pixel
    for (let pixelIndex = 0; pixelIndex < totalPixels; pixelIndex++) {
      // Compare this pixel between two frames
      if (comparePixel(frame, oldFrame, pixelIndex)) {
        // If true, it means they are the same, so set transparent
        frame.data[pixelIndex * 4 + 3] = 0;
        diffCount++; // Keep track of how many we find
      }
    }
  }

  // Draw something in the background so transparency is more obvious
  var gradient = c.createLinearGradient(0, 0, canvasEl.width, canvasEl.height);
  gradient.addColorStop(0, 'deeppink');
  gradient.addColorStop(1, 'palegreen');
  c.fillStyle = gradient;
  c.fillRect(0, 0, canvasEl.width, canvasEl.height);

  // Write modified frame back to offscreen buffer
  offscreenC.putImageData(frame, 0, 0);

  // Write contents of buffer to visible canvas
  c.drawImage(offscreenCanvasEl, 0, 0);

  // Give a numerical readout of proportion of pixels that have changed
  diffCount = 100 - Math.floor(100 * (diffCount / totalPixels));
  c.fillStyle = 'white';
  c.font = '48px "Fira Code", Monaco, "Andale Mono", "Lucida Console", "Bitstream Vera Sans Mono", "Courier New", Courier, monospace';
  c.fillText(diffCount + '%', 100, 100);

  let now = Date.now();
  let keepFrame = true;

  // At the moment we always compare to the last frame from the camera,
  // but we could make a logic so comparison frames are only kept every second, for example:
  //if (now-oldFrameCapturedAt < 1000) keepFrame = false;

  // Or, this only keeps the first frame and never updates it
  // if (oldFrame !== null) keepFrame = false;

  // Remember last frame
  if (keepFrame) {
    oldFrame = frame;
    oldFrameCapturedAt = now;
  }

  // Repeat!
  window.requestAnimationFrame(renderFrame);
}

// Function compares a pixel in two frames, returning true if
// pixel is deemed to be equal
function comparePixel(frameA, frameB, i) {
  let rA = frameA.data[i * 4 + 0];
  let gA = frameA.data[i * 4 + 1];
  let bA = frameA.data[i * 4 + 2];
  let bwA = (rA + gA + bA) / 3.0; // B&W value

  let rB = frameB.data[i * 4 + 0];
  let gB = frameB.data[i * 4 + 1];
  let bB = frameB.data[i * 4 + 2];
  let bwB = (rB + gB + bB) / 3.0; // B&W value

  // Compare B&W values
  // Use Math.abs to make negative values positive
  // (we don't care if the new value is higher or lower, just that it's changed)
  let diff = Math.abs(bwA - bwB);
  if (diff < 5) return true;
  return false;
}



// ------------------------

// Reports outcome of trying to get the camera ready
function cameraReady(err) {
  if (err) {
    console.log('Camera not ready: ' + err);
    return;
  }
  console.log('Camera ready');
}

// Tries to get the camera ready, and begins streaming video to the cameraEl element.
function startCamera() {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  if (!navigator.getUserMedia) {
    cameraReady('getUserMedia not supported');
    return;
  }
  navigator.getUserMedia({ video: true },
    (stream) => {
      try {
        cameraEl.srcObject = stream;
      } catch (error) {
        cameraEl.srcObject = window.URL.createObjectURL(stream);
      }
      cameraReady();
    },
    (error) => {
      cameraReady(error);
    });
}
