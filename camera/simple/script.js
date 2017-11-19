const cameraEl = document.getElementById('camera');

document.getElementById('btnCaptureCanvas').addEventListener('click', captureToCanvas);
document.getElementById('btnCaptureImg').addEventListener('click', captureToImg);

startCamera();

// Demonstrates capturing a frame as an IMG element
function captureToImg() {
  const imagesEl = document.getElementById('captureImages');
  const offscreenCanvasEl = document.getElementById('offscreenCanvas');
  
  // 1. First we have to capture to a hidden canvas
  offscreenCanvasEl.width = cameraEl.videoWidth;
  offscreenCanvasEl.height = cameraEl.videoHeight;
  var c = offscreenCanvasEl.getContext('2d');
  c.drawImage(cameraEl, 0, 0, cameraEl.videoWidth , cameraEl.videoHeight);

  // 2. Then we grab the data from the hidden canvas, and set it as the
  // source of a new IMG element
  var img = document.createElement('img');
  img.src = offscreenCanvasEl.toDataURL('image/jpeg');
  imagesEl.appendChild(img); // Add it to a DIV
}

// Demonstrates drawing a frame to a canvas
function captureToCanvas() {
  const canvasEl = document.getElementById('captureCanvas');
  canvasEl.width = cameraEl.videoWidth;
  canvasEl.height = cameraEl.videoHeight;
  var c = canvasEl.getContext('2d');
  c.drawImage(cameraEl, 0, 0, cameraEl.videoWidth , cameraEl.videoHeight);
}

// ------------------------


// Reports outcome of trying to get the camera ready
function cameraReady(err) {
  if (err) {
    console.log('Camera not ready: ' + err);
    return;
  }
}

// Tries to get the camera ready, and begins streaming video to the cameraEl element.
function startCamera() {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  if (!navigator.getUserMedia) {
    cameraReady('getUserMedia not supported');
    return;
  }
  navigator.getUserMedia({video:true}, 
    (stream) => {
      cameraEl.src = window.URL.createObjectURL(stream);
      cameraReady();
    },
    (error) => {
      cameraReady(error);
    });
}