if (document.readyState != 'loading') onDocumentReady();
else document.addEventListener('DOMContentLoaded', onDocumentReady);

var lastX = 0;
var lastY = 0;
var isPressed = false;

function handleData(obj) {
  const thing = document.getElementById('thing');

  // Convert sensor values into percentages that range from -1.0 to 1.0
  const { x, y } = getRelativeValues(obj);

  // Ignore repeated values
  if (obj.pressed != isPressed) {
    isPressed = obj.pressed;
    if (isPressed) thing.classList.add('pressed');
    else thing.classList.remove('pressed');
  }
  if (x == lastX && y == lastY) return;

  // Relate relative values to viewport
  let halfWidth = window.innerWidth / 2;
  let halfHeight = window.innerHeight / 2;

  let xPos = parseInt(x * halfWidth + halfWidth);
  let yPos = parseInt(y * halfHeight + halfHeight);

  // Update position of element

  centerElement(thing, xPos, yPos);

  lastX = x;
  lastY = y;
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

  // Round the data a little to reduce jitter
  x = parseFloat(x.toFixed(3)); // 3 here is the number of decimal places
  y = parseFloat(y.toFixed(3));

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
