var player;
var lastX = 0;
var lastY = 0;

function onDocumentReady() {
  document.addEventListener('pointermove', onPointerMove);
}

// Function to map a percent 0..1 to a min/max range
function mapRelative(percent, min, max) {
  return percent * (max - min) + min;
}

function onPointerMove(e) {
  // Convert pixel coordinates into amounts relative
  // to window size. Using Math.min to make sure we don't exceed 1.0
  const relativeX = Math.min(1, e.clientX / document.body.clientWidth);
  const relativeY = Math.min(1, e.clientY / document.body.clientHeight);

  // Cancel existing animation if it's there
  if (player != null) player.cancel();

  // Map relative values to useful ranges for YTAS + YOPQ
  var newX = parseInt(mapRelative(relativeX, 700, 1000));
  var newY = parseInt(mapRelative(relativeY, 8, 102));

  // Two keyframes: beginning and end
  const keyframes = [
    { fontVariationSettings: '\'YTAS\' ' + lastX + ', \'YOPQ\' ' + lastY },
    { fontVariationSettings: '\'YTAS\' ' + newX + ', \'YOPQ\' ' + newY }
  ];

  // Keep track of last values so we can
  // start new animations from old position
  lastX = newX;
  lastY = newY;

  let el = document.getElementById('pangram');
  player = el.animate(keyframes, {
    fill: 'forwards',
    duration: 300,
    easing: 'ease-in'
  });
}

if (document.readyState != 'loading') {
  onDocumentReady();
} else {
  document.addEventListener('DOMContentLoaded', onDocumentReady);
}
