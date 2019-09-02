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

console.log('Loading coco-ssd model')
cocoSsd.load().then(m => {
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
  model.detect(canvasEl).then(predictions => {
    //console.log('Predictions: ', predictions);

    // As a demo, draw each prediction
    predictions.forEach(p => drawPrediction(p, c));
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
 class (string)
 score (0..1)
 bbox[x1,y1,x2,y2]
*/
function drawPrediction(prediction, canvasContext) {
  // Get bounding box coordinates
  var [x1, y1, x2, y2] = prediction.bbox;

  // Draw a white and black offset rectangle around the prediction.
  // Two are used so that rectangle appears in dark or light images
  canvasContext.strokeStyle = 'black';
  canvasContext.strokeRect(x1 + 1, y1 + 1, x2 + 1, y2 + 1);
  canvasContext.strokeStyle = 'white';
  canvasContext.strokeRect(x1, y1, x2, y2);

  // Create a debug string showing prediction
  let msg = prediction.class + ' (' + Math.floor(prediction.score * 100) + ')';

  // Measure how long this will be in pixels
  canvasContext.textBaseline = 'top';
  let metrics = canvasContext.measureText(msg);
  let textHeight = 10;

  // Draw rectangle behind text, now we know how wide
  canvasContext.fillStyle = 'rgba(0,0,0,0.5)';
  canvasContext.fillRect(x1, y1 - textHeight - 2,
    metrics.width + 6,
    textHeight + 4);

  // Draw text on top of rect
  canvasContext.fillStyle = 'white';
  canvasContext.fillText(msg, x1 + 2, y1 - textHeight - 1);

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
