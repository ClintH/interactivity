import {WaveGenerator} from './WaveGenerator.mjs'
const ballSize = 10;
/** @type {HTMLCanvasElement} */
let canvas = document.getElementById('canvas');

let wave = new WaveGenerator();
wave.useSine();

// Try different wave shapes:
// wave.useTriangle();
// wave.useRamp();
// wave.useSawtooth();
//wave.useSquare();

// Synchronise wave with time
//  ie: Duration of wave cycle is 2 seconds
wave.useTimePulse(2000);

// Or: synchronise manually based on pulses
//  ie: Duration of a wave cycle is calling 'calculate' 100 times.
//      In this sketch this corresponds to the speed of drawing
//wave.useCallPulse(100);

// Make a counter function that counts up slowly, resetting at 1
// this is used to shift the hue of dots over time
let colourTick = counter(0.001);


// Draw loop
function draw() {
  /** @type {CanvasRenderingContext2D} */
  let ctx = canvas.getContext('2d');
  smearCanvas(ctx, ballSize / 2);
  drawDot(ctx);
  window.requestAnimationFrame(draw); // Run draw again
}

/**
 * Draws a dot based on wave value
 * 
 * @param {CanvasRenderingContext2D} ctx
 */
function drawDot(ctx) {
  // Get current position of wave
  const v = wave.calculate(); // scale is 0->1
  const vInPixels = (1 - v) * canvas.height; // invert and apply to height, now 800->0 for example

  // Position will be edge of canvas, with Y according to wave
  const x = canvas.width - ballSize;
  const y = vInPixels;

  // Increment and compute HSL colour
  ctx.fillStyle = computeColour(colourTick());

  // Draw circle at coordinates
  ctx.beginPath();
  ctx.arc(x, y, ballSize, 0, 2 * Math.PI);
  ctx.fill();
}

/**
 * Smears canvas
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} amount
 */
function smearCanvas(ctx, amount) {
  ctx.filter = 'blur(2px)'; /* added sizzle. Doesn't work in Safari */

  // Copy and paint entire canvas a little to the left
  //  this produces the scrolling, smearing effect
  ctx.drawImage(canvas,
    0, 0, canvas.width, canvas.height,
    -amount, 0, canvas.width - amount, canvas.height);

  ctx.filter = 'none';

  // Fade out the entire canvas
  ctx.fillStyle = 'rgba(255,255,255,0.01)'; // change opacity prevent fade out
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

}

function onDocumentReady() {
  const onResize = function () {
    canvas.width = document.body.offsetWidth;
    canvas.height = document.body.offsetHeight;
  }
  window.addEventListener('resize', onResize);

  onResize(); // Trigger event handler to match canvas size to window
  window.requestAnimationFrame(draw); // Kick off draw loop
}

function counter(delta, startAt = 0, resetAt = 1) {
  let v = startAt;
  return function () {
    v += delta;
    if (v > resetAt) v = startAt;
    return v;
  };
}

function computeColour(percentage) {
  if (percentage < 0) percentage = 0;
  if (percentage > 1) percentage = 1;
  return 'hsl(' + Math.floor(360 * percentage) + ',100%,50%)';
}

// Initialise
onDocumentReady();
