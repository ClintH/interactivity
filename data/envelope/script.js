import {EnvelopeGenerator} from './EnvelopeGenerator.mjs'

const ballSize = 10;
/** @type {HTMLCanvasElement} */
let canvas = document.getElementById('canvas');

let manualEnv = new EnvelopeGenerator({
  attack: 1000, attackLevel: 1.0,
  sustain: 5000, sustainLevel: 0.9,
  decay: 100,
  release: 1000, releaseLevel: 0.1,
  looping: true
});
manualEnv.useCallPulse(); // Progress thru envelope with each call to calculate()

// Make a counter function that counts up slowly, resetting at 1
// this is used to shift the hue of dots over time
let colourTick = counter(0.001);

// Draw a dot corresponding to wave value
function draw() {
  /** @type {CanvasRenderingContext2D} */
  let ctx = canvas.getContext('2d');
  ctx.filter = 'blur(2px)'; /* added sizzle. Doesn't work in Safari */

  // Copy and paint entire canvas a little to the left
  //  this produces the scrolling, smearing effect
  ctx.drawImage(canvas,
    0, 0, canvas.width, canvas.height,
    -ballSize / 2, 0, canvas.width - ballSize / 2, canvas.height);

  ctx.filter = 'none';

  // Fade out the entire canvas
  ctx.fillStyle = 'rgba(255,255,255,0.01)'; // change opacity prevent fade out
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const v = wave.calculate(); // scale is 0->1
  const vInPixels = (1 - v) * canvas.height; // invert and apply to height, now 800->0 for example

  const x = canvas.width - ballSize;
  const y = vInPixels;

  // Increment and compute HSL colour
  ctx.fillStyle = computeColour(colourTick());

  // Draw circle at coordinates
  ctx.beginPath();
  ctx.arc(x, y, ballSize, 0, 2 * Math.PI);
  ctx.fill();

  window.requestAnimationFrame(draw); // Run draw again
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
