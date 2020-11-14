



// let wave1 = new WaveGenerator();
// wave1.useSine();

// let wave2 = new WaveGenerator();
// wave2.useSine();
// wave2.useTimePulse(500);

// const env = new EnvelopeGenerator({
//   attack: 1000, attackLevel: 1.0,
//   sustain: 5000, sustainLevel: 0.9,
//   decay: 100,
//   release: 1000, releaseLevel: 0.1,
//   looping: true
// });

const env = EnvelopeGenerator.triangle(1000, 1, 2000);
/**
 * Draw result
 *
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} ctx
 */
function draw(canvas, ctx) {

  // Copy and paint entire canvas a little to the left
  const shiftHorizBy = 5;
  ctx.drawImage(canvas,
    0, 0, canvas.width, canvas.height,
    -shiftHorizBy, 0, canvas.width - shiftHorizBy, canvas.height);

  // Fade out the entire canvas
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  let size = 10;
  ctx.fillStyle = 'black';

  ctx.save();

  const x = canvas.width - size;
  const y = canvas.height * (1 - env.calculate());
  // const y = wave1.blend(0.5, wave2);
  //const y = 0;
  ctx.translate(x, y);

  // Draw circle roughly in the middle
  ctx.beginPath();
  ctx.arc(-(size / 2), -(size / 2), size, 0, 2 * Math.PI);
  ctx.fill();

  ctx.restore();
}



// Main draw loop
function drawLoop() {
  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');
  draw(canvas, ctx);
  window.requestAnimationFrame(drawLoop);
}

function onDocumentReady() {
  // Set up event listeners
  window.addEventListener('resize', onResize);

  onResize(); // Manually trigger first time
  window.requestAnimationFrame(drawLoop);
}

// Resize canvas to match window
function onResize() {
  var canvas = document.getElementById('canvas');
  document.addEventListener('click', () => {
    env.release();
  });
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight;
  // wave1.amplitude = canvas.height;
  // wave1.offset = 0;
  // wave2.amplitude = wave1.amplitude;
}

if (document.readyState != 'loading') {
  onDocumentReady();
} else {
  document.addEventListener('DOMContentLoaded', onDocumentReady);
}