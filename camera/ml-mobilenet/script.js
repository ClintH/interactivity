// @ts-nocheck
const cameraEl = document.getElementById('camera');
const canvasEl = document.getElementById('canvas');
const resultsEl = document.getElementById('results');

let model = null;

document.getElementById('btnFreeze').addEventListener('click', evt => {
  if (cameraEl.paused) {
    cameraEl.play();
  } else {
    cameraEl.pause();
  }
});

console.log('Loading mobilenet model')
mobilenet.load().then(m => {
  model = m;
  console.log('Model loaded, starting camera');
  startCamera();
});


cameraEl.addEventListener('play', () => {
  // Resize canvas to match camera frame sie
  canvasEl.width = cameraEl.videoWidth;
  canvasEl.height = cameraEl.videoHeight;

  // Start processing!
  window.requestAnimationFrame(process);
});

// Processes the last frame from camera
function process() {

  // Draw frame to canvas
  var c = canvasEl.getContext('2d');
  c.drawImage(cameraEl, 0, 0, cameraEl.videoWidth, cameraEl.videoHeight);

  // Run through model
  model.classify(canvasEl).then(predictions => {
    //console.log('Predictions: ', predictions);

    // As a demo, draw each prediction
    resultsEl.innerHTML = '';
    predictions.forEach(p => appendPrediction(p));
  });

  // Repeat, if not paused
  if (cameraEl.paused) {
    console.log('Paused processing');
    return;
  }
  window.requestAnimationFrame(process);
}

/**
Prediction consists of:
 className (string)
 probability (0..1)
*/
function appendPrediction(p) {
  resultsEl.innerHTML += '<li>' + p.className + ' (' +
    Math.floor(p.probability * 100) + ')</li>';
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
