const things = []; // Keeps track of the particles
// Keeps track of current pointer position
let pointerX = 0;
let pointerY = 0;

// Create a bunch of random things
function createThings() {
  for (let i = 0; i < 50; i++) {
    things.push({
      position: new Victor(randomInt(canvasSize.width), randomInt(canvasSize.height)),
      velocity: new Victor(random(-2, 2), random(-2, 2)),
      accel: new Victor(0, 0),
      size: 10,
      colour: `hsla(${Math.floor(Math.random() * 360)},100%,50%,0.7)`
    });
  }
}

function draw() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  // Fade out the entire canvas
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

  // Move and draw each thing
  things.forEach(thing => {
    moveThing(thing);
    drawThing(thing, ctx);
  });

  window.requestAnimationFrame(draw);
}

// Apply changes to position/velocity for a given thing
function moveThing(thing) {
  // Start with a vector based on pointer coordinate
  thing.accel = new Victor(pointerX, pointerY)
    // Subtract current thing position, yielding the 'gap' between
    // where the thing is and where it should be
    .subtract(thing.position)
    // Normalise throws away magnitude and just leaves us with direction
    .normalize()
    // Add a constant velocity - this helps to avoid them clumping up
    .multiply(new Victor(0.2, 0.2));

  // Add this acceleration to our current velocity
  thing.velocity.add(thing.accel);

  // Make sure things don't get too crazy
  // If any part is greater than 5, halve it
  thing.velocity.limit(5, 0.5); // limit(max, multiplier)

  // Set new position based on calculated velocity
  thing.position.add(thing.velocity);
}

// Draws a given thing
function drawThing(thing, ctx) {
  ctx.fillStyle = thing.colour;
  ctx.beginPath();
  ctx.arc(thing.position.x, thing.position.y, thing.size, 0, 2 * Math.PI);
  ctx.fill();
}

function onResize() {
  const canvas = document.getElementById('canvas');

  // Size canvas to match actual pixels
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight;

  // Cache size
  canvasSize = {width: canvas.width, height: canvas.height};
}

// ---------------------
// Helper functions

function onDocumentReady() {
  // Set up event listeners
  window.addEventListener('resize', onResize);
  document.getElementById('canvas').addEventListener('pointermove', e => {
    pointerX = e.clientX;
    pointerY = e.clientY;
  });

  onResize(); // Manually trigger first time
  createThings();

  // Change the function name here to pick a different demo
  window.requestAnimationFrame(draw);
}
if (document.readyState != 'loading') {
  onDocumentReady();
} else {
  document.addEventListener('DOMContentLoaded', onDocumentReady);
}

function randomInt(max, min = 0) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function random(max, min = 0) {
  return Math.random() * (max - min) + min;
}