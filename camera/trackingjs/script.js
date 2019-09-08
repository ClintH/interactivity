// @ts-nocheck
const cameraEl = document.getElementById('camera');
let colours = null;
let videoWidth = 0;
let videoHeight = 0;

startCamera();

// Video stream started, set up the tracker
cameraEl.addEventListener('play', () => {
  videoHeight = cameraEl.videoHeight;
  videoWidth = cameraEl.videoWidth;
  cameraEl.style.width = videoWidth;
  cameraEl.style.height = videoHeight;

  // You can register your own custom colour tracking
  // pass an identifier as well as a function which returns true/false
  tracking.ColorTracker.registerColor('green', (r, g, b) => {
    if (r < 50 && g > 200 & b < 50) return true;
    return false;
  });

  // You can choose: magenta, cyan or yellow as the colours to track
  // or your own custom function, such as 'green' here.
  colours = ['magenta', 'green', 'cyan', 'yellow'];
  let tracker = new tracking.ColorTracker(colours);

  // Create an element for each colour we're tracking
  createColourElements();

  // Use this method to limit the size of tracked objects
  // (useful for eliminating false positives)
  // tracker.setMinDimension(10);

  // Listen for tracking data
  tracker.addListener('track', onTrack);

  // Tell the tracker to watch the video element
  tracking.track(cameraEl, tracker);
});


function onTrack(evt) {

  // Loop through each of the colours we're tracking
  colours.forEach(c => {
    // As a demo, we move a bunch of coloured elements around
    let el = document.getElementById('colour-' + c);
    let trackResult = evt.data.find(r => r.color == c);
    if (trackResult == null) {
      // Colour wasn't found
      el.style.opacity = 0.2;
    } else {
      // Colour was found!
      el.style.opacity = 1.0;

      // Position and scale element to match what was found
      // in video frame. Note that coordinates are relative
      // to the video frame size, and not the viewport

      // Use the same coordinates/size as video frame
      // el.style.left = trackResult.x + 'px';
      // el.style.top = trackResult.y + 'px';
      // el.style.width = trackResult.width + 'px';
      // el.style.height = trackResult.height + 'px';

      // ... or, we could scale these coordinates to the size of the viewport:
      var ratioW = window.innerWidth / videoWidth;
      var ratioH = window.innerHeight / videoHeight;

      el.style.left = (trackResult.x * ratioW) + 'px';
      el.style.top = (trackResult.y * ratioH) + 'px';
      el.style.width = (trackResult.width * ratioW) + 'px';
      el.style.height = (trackResult.height * ratioH) + 'px';
    }
  });
}

// Creates a coloured DIV for each colour being tracked
function createColourElements() {
  colours.forEach(c => {
    var t = document.createElement('DIV');
    t.id = 'colour-' + c; // Give each element an id so we can get it later
    t.style.backgroundColor = c;
    t.classList.add('colour');
    document.body.appendChild(t);
  });
}

// Helper function that maps v, with a given low and high range,
// to a new low and high range.
function map(v, low1, high1, low2, high2) {
  return low2 + (v - low1) * (high2 - low2) / (high1 - low1);
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

  // Note the request parameters given to `getUserMedia`.
  //  Modifying this can allow you to select a different camera or the source resolution.
  //  For more details: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  // Examples:
  //  { video: { width: 1280, height: 720}, audio: false }
  //  { video: { facingMode: 'environment' }, audio: false}
  //  { video: { deviceId: '23e18d4292203610ee41e983b24c54fb7e30f98c62340d8004c66ecf885cab54' }, audio: false}
  // { video: true, audio: false }
  navigator.getUserMedia({ video: true, audio: false },
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
