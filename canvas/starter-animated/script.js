// Two variables to keep track of where the pointer is
let pointerX = 0;
let pointerY = 0;

// Main draw loop
function draw() {
  /** @type {CanvasRenderingContext2D} */
  const ctx = document.getElementById('canvas').getContext('2d');

  // Your drawing code here!
  drawDemo(ctx);

  // Loop
  window.requestAnimationFrame(draw);
}

/**
 * Demo drawing
 *
 * @param {CanvasRenderingContext2D} ctx
 */
function drawDemo(ctx) {
  // Fade out the entire canvas by drawing
  // an almost translucent white rectangle
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Translate to set 0,0 to be pointer position
  ctx.save();
  ctx.translate(pointerX, pointerY);

  const size = 10;
  ctx.fillStyle = 'black';
  ctx.beginPath();

  // Draw circle at 0,0 (this works because the canvas itself is translated)
  // Syntax: arc(x, y, radius, startAngle, endAngle)
  ctx.arc(0, 0, size, 0, 2 * Math.PI);
  ctx.fill();

  // Turn off the translation
  ctx.restore();
}

// Resize canvas to match window
function onResize() {
  const canvas = document.getElementById('canvas');
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight;
}

function onDocumentReady() {
  // Set up event listeners
  window.addEventListener('resize', onResize);
  document.getElementById('canvas').addEventListener('pointermove', e => {
    // Keep track of current pointer position
    pointerX = e.clientX;
    pointerY = e.clientY;
  });

  onResize(); // Manually trigger first time
  window.requestAnimationFrame(draw); // Kick off drawing
}

if (document.readyState != 'loading') {
  onDocumentReady();
} else {
  document.addEventListener('DOMContentLoaded', onDocumentReady);
}