if (document.readyState != 'loading') onDocumentReady();
else document.addEventListener('DOMContentLoaded', onDocumentReady);

// Set up a moving window for 1000 samples
// Try reducing or increasing this number to see how it affects responsiveness/jitter
let movingWindowX = new MovingWindow(1000);
let currentHue = 0;

// A smaller window is used for the Y-axis to track speed
let movingWindowY = new MovingWindow(200);
let currentSpeed = 0; // updated in handleY

function handleData(obj) {
  handleX(obj.x);
  handleY(obj.y);
}

// Handle the values for X-axis
// We use an averaging function to smooth the data
function handleX(x) {
  movingWindowX.push(x);
  const smoothed = movingWindowX.compute();

  // Smoothed value is within range of 0...1023,
  // just like the data we put into it
  var relative = smoothed / 1023;

  // Convert percentage into a hue value (0..360)
  var hue = parseInt(relative * 360);

  // For performance, we avoid changing CSS unless there's an actual change
  if (hue == currentHue) return;

  // Set background
  document.body.style.backgroundColor = 'hsl(' + hue + ',40%,70%)';

  currentHue = hue;
}

// Handle values for Y-axis
// For this axis, we want to detect movement rather than position
function handleY(y) {
  movingWindowY.push(y);

  // Calculate and set to a variable
  const difference = y - movingWindowY.compute();

  // Difference is in sensor units (0...1023),
  // and we want it in a relative %
  currentSpeed = difference / 1023;
}

// Repaint the canvas
function updateCanvas(ctx) {
  // Fade out the entire canvas
  ctx.fillStyle = 'rgb(255,255,255,0.05)';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.fillStyle = 'black';

  // Draw a horizontal line according to speed
  let halfCanvas = ctx.canvas.height / 2;
  let y = currentSpeed * halfCanvas;
  y += halfCanvas; // offset so 0 is in the middle
  ctx.fillRect(0, y, ctx.canvas.width, 1);
}

function onDocumentReady() {
  var socket = new ReconnectingWebsocket('ws://' + location.host + '/serial');

  window.requestAnimationFrame(draw);

  // Handle incoming messages
  socket.onmessage = function(evt) {
    var d = evt.data.trim();
    var obj = {};
    try {
      obj = JSON.parse(d);
    } catch (e) {
      console.log(e);
      console.log('Received: ' + d);
      return;
    }

    handleData(obj);
  };
  socket.onopen = function(evt) {
    console.log('Socket opened');
  };
}

function draw() {
  let ctx = document.getElementById('canvas').getContext('2d');

  updateCanvas(ctx);

  // Loop
  window.requestAnimationFrame(draw);
}
