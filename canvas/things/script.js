let things = [];

function onDocumentReady() {
  window.addEventListener('resize', onResize);

  createThings();
  onResize(); // Manually trigger first time
  
  // Change the function name here to pick a different demo
  window.requestAnimationFrame(draw);
}

// Create a bunch of random things
function createThings() {
  for (let i=0;i<100;i++) {
    things.push({
      speed: Math.random()*5,
      angle: randomInt(360), // randomInt is a helper function
      originX: randomInt(50),
      originY: randomInt(50),
      distance: Math.random(),
      size: randomInt(50),
      colour: 'hsla(' + randomInt(360) + ',100%,50%,0.7)'
    });
  }
}

let scaleBounce = valueBounce(0.5,5,0.001); // Very slowly zoom in and our

function draw() {
  let ctx = document.getElementById('canvas').getContext('2d');

  // Fade out the entire canvas
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);

  // Set 0,0 to be center of canvas
  ctx.save();
  ctx.translate(canvas.width/2, canvas.height/2);

  // Compute & apply a new scale value
  let scale = scaleBounce();
  ctx.scale(scale,scale);
  
  // Draw each thing
  things.forEach(x=>drawThing(x,ctx));
  ctx.restore();
  
  // Repeat!
  window.requestAnimationFrame(draw);
 }

// Draws a thing
function drawThing(thing, ctx) {
  let size = thing.size;
  let distance = thing.distance * ctx.canvas.width / 3;

  // Compute location of thing according to current angle around its own origin point
  let pointCoord = polarToCartesian(degreesToRadians(thing.angle%360), distance, thing.originX, thing.originY);
  
  // Draw dot at location
  ctx.fillStyle = thing.colour;
  ctx.beginPath();
  ctx.arc(pointCoord.x, pointCoord.y,size,0,2*Math.PI);
  ctx.fill();

  // Increment angle
  thing.angle += thing.speed;
}

// Resize canvas to match window & reset transformation matrix
function onResize() {
  var canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');
  
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight;
  
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

// ---------------------
// Helper functions

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

// Keeps track of a value and 'bounces' it between low and high bounds
function valueBounce(low, high, incr) {
  let current = low;
  return function() {
    if (current > high || current < low) incr *= -1.0;  
    current += incr;
    return current;
  }
}
// return a random integer between min and max
function randomInt(max, min = 0) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}