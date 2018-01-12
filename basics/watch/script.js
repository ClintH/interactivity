let watch = null;
let watchBounds = null;

function onDocumentReady() {
  watch = document.getElementById('watch');
  watchBounds = watch.getBoundingClientRect();

  // TODO: Add event handlers to 'watch' to listen for things happening inside the circle...

  // Demonstrates functions
  centerElement(document.getElementById('centered'));

  // Position 'threeOclock' at 90 degrees, and at the full edge (1.0 == 100%)
  positionAtAngle(document.getElementById('threeOclock'), 90, 1.0);

  // Position 'nine0clcok' at 270 degrees, halfway from the center (0.5 = 50%)
  // Note that this element has style 'position:static' and thus doesn't move during a scroll
  staticPositionAtAngle(document.getElementById('nineOclock'), 270, 0.5);
}

// Positions 'el' in the center of #watch
// Note: 'el' should have style 'position:absolute'
function centerElement(el) {
  let bounds = el.getBoundingClientRect();
  el.style.left = (watchBounds.width/2 - bounds.width/2) + "px";
  el.style.top = (watchBounds.height/2 - bounds.height/2) + "px";
}

// Positions 'el' at 'angle' (0-359), at 'distance'% from center of #watch
// Note: 'el' should have style 'position:absolute'
function positionAtAngle(el, angleDegrees = 0, distance = 0) {
  // Make sure values are sane
  if (distance > 1.0) distance = 1.0;
  if (distance < 0.0) distance = 0;
  if (angleDegrees > 359) angleDegrees = 359;
  if (angleDegrees < 0) angleDegrees = 0;

  let elBounds = el.getBoundingClientRect();

  let centerX = watchBounds.width/2;
  let centerY = watchBounds.height/2;

  // -90 to get something more familiar. Eg, degrees=circular clock
  //     0=12:00, 90=3:00, 180=6:00, 270=9:00
  let angleRad = degreesToRadians(angleDegrees-90); 

  // Convert distance % into pixels, based on radius of watch
  distance = distance * watchBounds.width/2;

  // Calculate position
  let pos = polarToCartesian(angleRad, distance, centerX, centerY);

  // Position from center of element
  pos.x = pos.x - elBounds.width/2;
  pos.y = pos.y - elBounds.height/2;

  // Set position
  el.style.left = pos.x +"px";
  el.style.top = pos.y + "px";
}

// Positions 'el' at 'angle' (0-359), at 'distance'% from center of #watch
// Note #1 'el' should have style 'position:static'
// Note #2 elements will need to be repositioned if the browser resizes
function staticPositionAtAngle(el, angleDegrees = 0, distance = 0) {
  // Make sure values are sane
  if (distance > 1.0) distance = 1.0;
  if (distance < 0.0) distance = 0;
  if (angleDegrees > 359) angleDegrees = 359;
  if (angleDegrees < 0) angleDegrees = 0;

  let elBounds = el.getBoundingClientRect();

  // Add position of container, since we're not going to place 'el'
  // relatively
  let centerX = watchBounds.left+(watchBounds.width/2);
  let centerY = watchBounds.top+(watchBounds.height/2);
 
  // -90 to get something more familiar. Eg, degrees=circular clock
  //     0=12:00, 90=3:00, 180=6:00, 270=9:00
  let angleRad = degreesToRadians(angleDegrees-90); 

  // Convert distance % into pixels, based on radius of watch
  distance = distance * watchBounds.width/2;

  // Calculate position
  let pos = polarToCartesian(angleRad, distance, centerX, centerY);

  // Position from center of element
  pos.x = pos.x - elBounds.width/2;
  pos.y = pos.y - elBounds.height/2;

  // Set position
  el.style.left = pos.x +"px";
  el.style.top = pos.y + "px";
}

if (document.readyState != 'loading'){
  onDocumentReady();
} else {
  document.addEventListener('DOMContentLoaded', onDocumentReady);
}

// Convert polar coordinates (ie angular distance from a point) to cartestian (x,y)
function polarToCartesian(radians, distance, x, y) {
  return {
      x: distance*Math.cos(radians) + x,
      y: distance*Math.sin(radians) + y
  }
}

// Convert degrees to radians
function degreesToRadians(deg) {
  return deg * Math.PI / 180;
}