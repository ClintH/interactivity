if (document.readyState != 'loading') onDocumentReady();
else document.addEventListener('DOMContentLoaded', onDocumentReady);

var isPressed = false;
var thing = null;

function handleData(obj) {
  // Convert sensor values into percentages that range from -1.0 to 1.0
  const { x, y } = getRelativeValues(obj);

  if (obj.pressed != isPressed) {
    isPressed = obj.pressed;
    if (isPressed) thing.classList.add('pressed');
    else thing.classList.remove('pressed');

    if (isPressed) onPressed();
  }

  // Get current x,y
  const currentX = parseInt(thing.style.left);
  const currentY = parseInt(thing.style.top);

  // Nudge by up to 5 pixels
  let xPos = currentX + x * 5;
  let yPos = currentY + y * 5;

  // Make sure coordinates don't go crazy - keep it within window
  let bounds = thing.getBoundingClientRect();
  xPos = clamp(xPos, 0, window.innerWidth - bounds.width);
  yPos = clamp(yPos, 0, window.innerHeight - bounds.height);

  thing.style.left = xPos + 'px';
  thing.style.top = yPos + 'px';
}

function clamp(val, minVal, maxVal) {
  if (val < minVal) return minVal;
  if (val > maxVal) return maxVal;
  return val;
}

function onPressed() {
  // Center element
  let halfWidth = window.innerWidth / 2;
  let halfHeight = window.innerHeight / 2;
  centerElement(thing, halfWidth, halfHeight);
}

function getRelativeValues(obj) {
  // Transform into percentages (max sensor value is 1023)
  let x = obj.x / 1023;
  let y = obj.y / 1023;

  // Home position is around 49% (on my module at least)
  // We want to transform this so home is 0, and the extremes are negative or positive
  x = x - 0.49;
  y = y - 0.49;

  // Double everything to get back scale (since earlier we -0.49)
  x *= 2.0;
  y *= 2.0;

  // We do quite extreme rounding to reduce jitter
  x = parseFloat(x.toFixed(1)); // 1 here is the number of decimal places
  y = parseFloat(y.toFixed(1));

  // Make sure values don't exceed 1.0
  x = Math.min(x, 1.0);
  y = Math.min(y, 1.0);

  return { x: x, y: y };
}

// Positions an element by its center
function centerElement(el, x, y) {
  let bounds = el.getBoundingClientRect();
  x = x - bounds.width / 2;
  y = y - bounds.height / 2;
  el.style.left = x + 'px';
  el.style.top = y + 'px';
}

function onDocumentReady() {
  thing = document.getElementById('thing');

  onPressed();

  var socket = new ReconnectingWebsocket('ws://' + location.host + '/serial');

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
