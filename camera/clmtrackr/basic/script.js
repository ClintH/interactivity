const cameraEl = document.getElementById('camera');
const canvasEl = document.getElementById('canvas');
const tracker = new clm.tracker();

startCamera();

cameraEl.addEventListener('play', () => {
  // Resize everything to match the actual
  // video frame size
  canvasEl.width = cameraEl.videoWidth;
  canvasEl.height = cameraEl.videoWidth;
  cameraEl.width = cameraEl.videoWidth;
  cameraEl.height = cameraEl.videoHeight;

  tracker.init();
  tracker.start(cameraEl);
  window.requestAnimationFrame(renderFrame);  
});

function renderFrame() {
  var c = canvasEl.getContext('2d');
  var p = tracker.getCurrentPosition();
  
  if (p) {
    // Optional visual feedback of tracker
    c.drawImage(cameraEl, 0, 0);
    tracker.draw(canvasEl);
  }

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