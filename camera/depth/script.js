// @ts-nocheck
const cameraEl = document.getElementById('camera');

document.getElementById('btnCaptureCanvas').addEventListener('click', captureToCanvas);
document.getElementById('btnCaptureImg').addEventListener('click', captureToImg);

// Start default camera
startCamera();

// Demonstrates capturing a frame as an IMG element
function captureToImg() {
  const imagesEl = document.getElementById('captureImages');
  const offscreenCanvasEl = document.getElementById('offscreenCanvas');

  // 1. First we have to capture to a hidden canvas
  offscreenCanvasEl.width = cameraEl.videoWidth;
  offscreenCanvasEl.height = cameraEl.videoHeight;
  var c = offscreenCanvasEl.getContext('2d');
  c.drawImage(cameraEl, 0, 0, cameraEl.videoWidth, cameraEl.videoHeight);

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
  c.drawImage(cameraEl, 0, 0, cameraEl.videoWidth, cameraEl.videoHeight);
}

// ------------------------

function getDepthCamera(completion) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    return completion('enumerateDevices() not supported.');
  }

  // List cameras and microphones.
  navigator.mediaDevices.enumerateDevices()
    .then(function (devices) {
      devices.forEach(function (device) {
        if (device.label.indexOf('Depth') < 0) return;
        completion(false, device.deviceId);
      });
    })
    .catch(function (err) {
      completion(err.name + ': ' + err.message, null);
    });
}

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

  getDepthCamera((err, id) => {
    if (err) return cameraReady(err);
    console.log('Opening found depth camera: ' + id);
    navigator.getUserMedia({ video: { deviceId: id }, audio: false },
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
  });


}
