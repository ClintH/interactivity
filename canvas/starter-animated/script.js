function onDocumentReady() {
  // Set up event listeners
  window.addEventListener('resize', onResize);
  document.getElementById('canvas').addEventListener('pointermove', e=>{
    // Keep track of current pointer position
    window.pointerX = e.clientX;
    window.pointerY = e.clientY;
  });

  onResize(); // Manually trigger first time
  window.requestAnimationFrame(draw);
}

// Main draw loop
function draw() {
  let ctx = document.getElementById('canvas').getContext('2d');
  
  // Your drawing code here!
  drawDemo(ctx);

  // Loop
  window.requestAnimationFrame(draw);
 }

// Draws a demo animation
function drawDemo(ctx) {
  // Fade out the entire canvas
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);

  // Draw pointer
  let size = 10;
  ctx.fillStyle = 'black';

  // Translate to set 0,0 to be pointer position
  ctx.save();
  ctx.translate(window.pointerX, window.pointerY);
  
  // Draw circle roughly in the middle
  ctx.beginPath();
  ctx.arc(-(size/2),-(size/2),size,0,2*Math.PI);
  ctx.fill();

  ctx.restore();
}

// Resize canvas to match window
function onResize() {
  var canvas = document.getElementById('canvas');
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight;
}

if (document.readyState != 'loading'){
  onDocumentReady();
} else {
  document.addEventListener('DOMContentLoaded', onDocumentReady);
}