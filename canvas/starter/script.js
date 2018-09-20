function onDocumentReady() {
  window.addEventListener('resize', onResize);

  onResize(); // Manually trigger first time
}

// Call draw() whenever you want to update the canvas
// In this demo, draw() is automatically called when first loaded or when
// the browser is resized
function draw() {
  let ctx = document.getElementById('canvas').getContext('2d');

  // Your drawing code here!

  // these functions demonstrate a few basics:
  drawCircle(ctx);
  drawCorners(ctx);
  drawText(ctx);
}

// Draws squares at corners
function drawCorners(ctx) {
  const size = 10;
  const canvas = ctx.canvas;
  ctx.fillStyle = 'red';

  // Usage: fillRect(x, y, width, height)
  ctx.fillRect(0, 0, size, size); // Top-left
  ctx.fillRect(canvas.width - size, 0, size, size); // Top-right
  ctx.fillRect(0, canvas.height - size, size, size); // Bottom-left
  ctx.fillRect(canvas.width - size, canvas.height - size, size, size); // Bottom-right
}

function drawText(ctx) {
  ctx.fillStyle = 'yellow';
  ctx.font = '48px serif';
  // Usage: fillText(text, x, y)
  ctx.fillText('Canvas drawing', 10, 100);
}

// Draws a circle
function drawCircle(ctx) {
  const canvas = ctx.canvas;

  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 3,
    0,
    2 * Math.PI
  );
  ctx.fill();
}

// Resize canvas according to window size
function onResize() {
  const canvas = document.getElementById('canvas');
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight;
  draw();
}

if (document.readyState != 'loading') {
  onDocumentReady();
} else {
  document.addEventListener('DOMContentLoaded', onDocumentReady);
}
