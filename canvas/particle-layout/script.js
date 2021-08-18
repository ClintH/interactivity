const things = [];
const thingWidthHeight = 3;
const thingMargin = 3;
let anim = null;

function onDocumentReady() {
  // Set up event listeners
  window.addEventListener('resize', onResize);

  onResize(); // Manually trigger first time
  createThings();

  layout();

  // Change the function name here to pick a different demo
  window.requestAnimationFrame(draw);
}

// Create a bunch of random things
function createThings() {
  const totalThings = 7000;
  const colourScale = chroma.scale(['yellow', '008ae5']).domain([0, totalThings]);

  var id = 0;
  for (let i = 0; i < totalThings; i++) {
    let x = randomInt(canvasSize.width);
    let y = randomInt(canvasSize.height);
    things.push({
      x: x,
      y: y,
      destX: x,
      destY: y,
      colour: colourScale(id),
      id: id++
    });
  }
}

// Called whenever layout needs to be recomputed (eg after a resize)
function layout() {
  const canvas = document.getElementById('canvas');

  // Stop existing animation
  if (anim != null) anim.pause();

  // Perform layout: Here are three options
  //gridLayout(things);
  phyllotaxisLayout(things, canvas.width / 2, canvas.height / 2);
  //randomLayout(things);

  // Use the 'anime' library to transition to destination
  anim = anime({
    targets: things,
    duration: 20000,
    x: function (thing, index, length) {
      return thing.destX;
    },
    y: function (thing, index, length) {
      return thing.destY;
    },
    complete: function () {
      console.log("Complete");
    },
    autoplay: true
  });
}

// Lays out particles in a uniform grid
function gridLayout(things) {
  const canvas = document.getElementById('canvas');

  // Assume all things are the same size
  const thingHeight = thingWidthHeight + thingMargin;
  const thingWidth = thingWidthHeight + thingMargin;

  // How many things can we fit per row?
  const thingsPerRow = Math.floor(canvas.width / thingWidth);

  // Set destX and destY for each
  things.forEach((thing, i) => {
    thing.destX = thingWidth * (i % thingsPerRow);
    thing.destY = thingHeight * Math.floor(i / thingsPerRow);
  });
  return things;
}

// Lays our particles randomly
function randomLayout(things) {
  const canvas = document.getElementById('canvas');

  things.forEach((thing, i) => {
    thing.destX = randomInt(canvas.width);
    thing.destY = randomInt(canvas.height);
  });
}

// Computes where each particle should be
// Don't worry about understanding the math, the key thing is that
// it sets destX and destY for each thing
function phyllotaxisLayout(things, xOffset = 0, yOffset = 0, iOffset = 0) {
  // Theta determines the spiral of the layout
  const theta = Math.PI * (3 - Math.sqrt(5));
  const thingRadius = (thingWidthHeight + thingMargin) / 2;

  things.forEach((thing, i) => {
    const index = (i + iOffset) % things.length;
    const phylloX = thingRadius * Math.sqrt(index) * Math.cos(index * theta);
    const phylloY = thingRadius * Math.sqrt(index) * Math.sin(index * theta);

    thing.destX = xOffset + phylloX - thingRadius;
    thing.destY = yOffset + phylloY - thingRadius;
  });
  return things;
}

function draw() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  // Clear it first
  ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

  // Draw each thing
  things.forEach(thing => {
    drawThing(thing, ctx);
  });

  window.requestAnimationFrame(draw);
}

function drawThing(thing, ctx) {
  ctx.fillStyle = thing.colour;
  ctx.fillRect(thing.x, thing.y, thingWidthHeight, thingWidthHeight);
}

function onResize() {
  const canvas = document.getElementById('canvas');

  // Size canvas to match actual pixels
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight;

  // Cache size
  window.canvasSize = {width: canvas.width, height: canvas.height};

  if (things.length > 0)
    layout();
}

// ---------------------
// Helper functions
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