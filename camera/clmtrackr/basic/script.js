// @ts-nocheck
/* eslint-disable no-undef */
const cameraEl = document.getElementById('camera');
const canvasEl = document.getElementById('canvas');
const tracker = new clm.tracker();

startCamera();

cameraEl.addEventListener('play', () => {
  // Resize everything to match video frame size
  canvasEl.width = cameraEl.videoWidth;
  canvasEl.height = cameraEl.videoWidth;
  cameraEl.width = cameraEl.videoWidth;
  cameraEl.height = cameraEl.videoHeight;

  // Init and start tracker
  tracker.init();
  tracker.start(cameraEl);

  // Process a frame
  window.requestAnimationFrame(renderFrame);
});


// Processes the last frame from the camera
function renderFrame() {
  var c = canvasEl.getContext('2d');

  // If tracking, p is an array of track points
  var p = tracker.getCurrentPosition();

  if (p) {
    c.drawImage(cameraEl, 0, 0);
    tracker.draw(canvasEl);

    // Label each point
    for (var i = 0; i < p.length; i++) {
      c.fillText(i, p[i][0], p[i][1]);
    }
  }

  // Repeat!
  window.requestAnimationFrame(renderFrame);
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
  const constraints = {
    audio: false,
    video: { width: 640, height: 480 }
  };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      cameraEl.srcObject = stream;
      cameraReady();
    })
    .catch(function (err) {
      cameraReady(err); // Report error
    });
}
