let things = [];

function onDocumentReady() {
  window.addEventListener('resize', onResize);
  document.getElementById('canvas').addEventListener('pointermove', e=>{
    // Keep track of pointer
    window.pointerX = e.clientX;
    window.pointerY = e.clientY;
  });

  onResize(); // Manually trigger first time
  createThings();

  // Change the function name here to pick a different demo
  window.requestAnimationFrame(draw);
}

// Create a bunch of random things
function createThings() {
  let canvas = document.getElementById('canvas');

  for (let i=0;i<50;i++) {
    things.push({
      position: new Victor(randomInt(canvas.width),randomInt(canvas.height)),
      velocity: new Victor(random(-2,2),random(-2,2)),
      size: 10,
      colour: 'hsla(' + Math.floor(Math.random()*360) + ',100%,50%,0.7)'
    });
  }
}

// Main drawing loop
function draw() {
  let ctx = document.getElementById('canvas').getContext('2d');

  // Fade out the entire canvas
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);

  // Move and draw each thing
  things.forEach(thing => {
    moveThing(thing);
    drawThing(thing,ctx);
  });

  window.requestAnimationFrame(draw);
 }

 // Calculate position for a thing
 function moveThing(thing) {
  let canvas = document.getElementById('canvas');  

  // Compute new position
  thing.position.add(thing.velocity);
  
  // Wrap around canvas if edge is hit
  if (thing.position.x > canvas.width) thing.position.x = 0;
  else if (thing.position.x < 0) thing.position.x = canvas.width;
  if (thing.position.y > canvas.height) thing.position.y = 0;
  else if (thing.position.y < 0) thing.position.y = canvas.height;
}

// Draw a thing
function drawThing(thing, ctx) {
  ctx.fillStyle = thing.colour;
  ctx.beginPath();
  ctx.arc(thing.position.x, thing.position.y,thing.size,0,2*Math.PI);
  ctx.fill();
}

// Resize canvas to match window
function onResize() {
  var canvas = document.getElementById('canvas');
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight;
}

// ---------------------
// Helper functions
if (document.readyState != 'loading'){
  onDocumentReady();
} else {
  document.addEventListener('DOMContentLoaded', onDocumentReady);
}

// Return an integer between min and max
function randomInt(max, min = 0) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// Return a float between min and max
function random(max, min = 0) {
  return Math.random() * (max - min) + min;
}