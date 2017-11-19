let things = [];

function onDocumentReady() {
  // Set up event listeners
  window.addEventListener('resize', onResize);
  document.getElementById('canvas').addEventListener('pointermove', e=>{
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
      position: new Victor(randomInt(canvasSize.width),randomInt(canvasSize.height)),
      velocity: new Victor(random(-2,2),random(-2,2)),
      accel: new Victor(0,0),
      size: 10,
      colour: 'hsla(' + Math.floor(Math.random()*360) + ',100%,50%,0.7)'
    });
  }
}

function draw() {
  let canvas = document.getElementById('canvas');    
  let ctx = canvas.getContext('2d');

  // Fade out the entire canvas
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(0,0, canvasSize.width,canvasSize.height);

  // Move and draw each thing
  things.forEach(thing => {
    moveThing(thing);
    drawThing(thing,ctx);
  });

  window.requestAnimationFrame(draw);
 }

 function moveThing(thing) {
  thing.accel = new Victor(window.pointerX, window.pointerY)
    .subtract(thing.position)
    .normalize()
    .multiply(new Victor(0.2, 0.2));
  
  thing.velocity.add(thing.accel);
  thing.velocity.limit(5, 0.5);
  thing.position.add(thing.velocity);
}

function drawThing(thing, ctx) {
  ctx.fillStyle = thing.colour;
  ctx.beginPath();
  ctx.arc(thing.position.x, thing.position.y,thing.size,0,2*Math.PI);
  ctx.fill();
}

function onResize() {
  var canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');
  
  // Size canvas to match actual pixels
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight;

  // Cache size
  window.canvasSize = { width: canvas.width, height: canvas.height};
}

// ---------------------
// Helper functions
if (document.readyState != 'loading'){
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