let audioCtx, analyser, ampWindow, freqWindows;

class Thing {
  constructor() {
    this.size = 100;
    this.state = 0;
    this.rotation = 0;
    this.rotationVector = 0;
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
    this.deformations = [];
  }

}
let thing = new Thing();

function draw() {
  // Get the drawing context
  /** @type {CanvasRenderingContext2D} */
  const ctx = document.getElementById('canvas').getContext('2d');

  // Fill the canvas with cyan but at 5% opacity, to let movement smear
  ctx.fillStyle = 'rgba(0,255,255,0.05)';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // 1. Set the position of thing to be our point of reference
  ctx.save();
  ctx.translate(thing.x, thing.y);

  // 2. Rotate the whole canvas according to the object's rotation.
  //    this makes our job easier
  ctx.rotate(thing.rotation);

  // 3. Draw our thing (a square)
  ctx.beginPath();
  ctx.lineJoin = 'miter';
  ctx.moveTo(-thing.size / 2, -thing.size / 2); // Start top-left
  ctx.lineTo(thing.size / 2, -thing.size / 2); // Go top-right
  ctx.lineTo(thing.size / 2, thing.size / 2); // Down to bottom-right
  ctx.lineTo(-thing.size / 2, thing.size / 2); // To bottom-left
  ctx.lineTo(-thing.size / 2, -thing.size / 2); // And up to top-left
  ctx.stroke();

  ctx.restore(); // Undo translate & rotation transformations
  ctx.save();
  ctx.translate(thing.x, thing.y); // Just use translation again

  // 4. Draw some circles around it
  var angle = 0;
  var degreeSpacing = Math.PI * 2 / thing.deformations.length;
  ctx.beginPath();

  const defaultDeformation = 0.5;
  for (var i = 0; i < thing.deformations.length; i++) {
    var radius = (thing.deformations[i]) ? thing.deformations[i] : defaultDeformation;
    radius = (thing.size * radius) + thing.size;
    let x = radius * Math.cos(angle);
    let y = radius * Math.sin(angle);
    ctx.lineTo(x, y);
    angle += degreeSpacing;
  }
  ctx.closePath();
  ctx.stroke();

  // Undo transformations
  ctx.restore();
}


function behaviour() {
  // ---- Process the data first
  const bins = analyser.frequencyBinCount;
  var freq = new Float32Array(bins);
  var wave = new Float32Array(bins);
  analyser.getFloatFrequencyData(freq);
  analyser.getFloatTimeDomainData(wave);

  // Get the min, max & average of this slice of waveform data
  // max: absolute max, min: absolute min, avg: average of absolute data
  let waveD = getMinMaxAvg(wave);
  ampWindow.add(waveD.avg); // Keep track of average readings over time

  // Track each frequency bin
  for (var i = 0; i < analyser.fftSize / 2; i++) {
    freqWindows[i].add(freq[i]);
  }

  // ---- Now use the processed data to influence the thing
  // 1. Increase rotation if there's a burst of loudness compared to recent
  let diff = waveD.avg - ampWindow.avg(); // Will be positive if we're louder, negative if softer
  if (Math.abs(diff) > 0.00001 && diff > 0) { // Only move if there's enough of a difference & it's louder
    thing.rotationVector += diff;
  }

  // 2. Deform the body based on averaging of FFT bins
  for (var i = 0; i < freqWindows.length; i++) {
    const avg = freqWindows[i].avg();
    if (Number.isNaN(avg)) continue; // Don't have data yet

    // FFT bins are in dB (from -120 or so to 0)
    // Flip the scale so it's 0.0->1.0
    let d = 1.0 - (Math.abs(avg) / 100);
    d = clamp(d, 0, 1);

    // Increases deformation the longer it's there
    if (!thing.deformations[i]) thing.deformations[i] = 0; // Not yet set
    thing.deformations[i] += d;
  }

  let freqD = getMinMaxAvg(freq);

  // ---- Now apply the logic of the thing itself
  // 1. Rotation slows down to zero
  if (Math.abs(thing.rotationVector) < 0.001) {
    // if we're close enough to 0 set it to 0 to avoid oscillation
    thing.rotationVector = 0;
  } else if (thing.rotationVector != 0) {
    // If we're otherwise not zero, slowly reduce speed
    thing.rotationVector = (thing.rotationVector * 0.99) - 0.0001;
  }

  // 2. Deformations want to shrink. Each loop, reduce by 30%
  thing.deformations = thing.deformations.map(v => v * 0.7);

  // --- Make sure values are within right ranges
  thing.rotationVector = clamp(thing.rotationVector, -5, 5);
  thing.deformations = thing.deformations.map(v => clamp(v, 0, 5));

  // Apply rotation
  thing.rotation = thing.rotation + (thing.rotationVector * 0.1);
}

// Loops contunually, calling analyse and draw each time
function loop() {
  // Draw thing
  draw();

  // Change its properties
  behaviour();

  // Loop again!
  window.requestAnimationFrame(loop);
}


// Returns the min, max, span and average of an array
function getMinMaxAvg(data) {
  // Note: sign of data is ignored for min max, so -5 is treated the same as 5.
  let max = Number.MIN_SAFE_INTEGER;
  let min = Number.MAX_SAFE_INTEGER;
  let total = 0.0;
  for (var i = 0; i < data.length; i++) {
    let d = Math.abs(data[i]);
    max = Math.max(max, d);
    min = Math.min(min, d);
    total += d;
  }

  return {
    min: min,
    max: max,
    avg: total / data.length
  }
}

// Main initialisation, called when document is loaded and ready.
function onDocumentReady() {
  window.addEventListener('resize', onResize);

  // Initalise microphone
  navigator.getUserMedia(
    { audio: true },
    onMicSuccess, // Call this when microphone is ready
    error => { console.error('Could not init microphone', error); });

  thing = new Thing();

  onResize(); // Initial fitting of canvas
}

// Clamps a value to be within a min and max
function clamp(v, min, max) {
  // eg: clamp(101, 0, 100) returns 100, because the max is 100
  // eg: clamp(-5, 0, 100) returns 0, because the minimum is 0
  // eg: clamp(60, 0, 100) returns 60, because it's within the bounds
  if (v < min) return min;
  if (v > max) return max;
  return v;
}

// Scales an input value from a source range to a destination range.
function scale(v, sourceMin, sourceMax, destMin, destMax) {
  // eg: scale(70, 0, 70, 0, 5) = 70 is 100% on the scale of 0-70. Mapping that to the destination range of 0-5 gives 5 (100%)
  // eg: scale(70, 60, 80, 0, 5) = 70 is 50% on the scale of 60-80. Mapping that to the same destination of 0-5 gives 2.5 instead (50%)
  return (v - sourceMin) * (destMax - destMin) / (sourceMax - sourceMin) + destMin;
}

// Microphone successfully initalised, now have access to audio data
function onMicSuccess(stream) {
  audioCtx = new AudioContext();

  audioCtx.addEventListener('statechange', () => {
    console.log('Audio context state: ' + audioCtx.state);
  });

  analyser = audioCtx.createAnalyser();

  // Keep track of the last few amplitude readings
  ampWindow = new SlidingWindow(10);

  // fftSize must be a power of 2. Higher values slower, more detailed
  // Range is 32-32768
  analyser.fftSize = 64;

  // Track the trend of each frequency bin as well
  freqWindows = [];
  for (var i = 0; i < analyser.fftSize / 2; i++) {
    freqWindows[i] = new SlidingWindow(20);
  }

  // smoothingTimeConstant ranges from 0.0 to 1.0
  // 0 = no averaging. Fast response, jittery
  // 1 = maximum averaging. Slow response, smooth
  analyser.smoothingTimeConstant = 0.9;

  // Microphone -> analyser
  const micSource = audioCtx.createMediaStreamSource(stream);
  micSource.connect(analyser);

  // Start loop
  window.requestAnimationFrame(loop);
}

// Called whenever the window resizes. Fit canvas
function onResize() {
  var canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

if (document.readyState != 'loading') {
  onDocumentReady();
} else {
  document.addEventListener('DOMContentLoaded', onDocumentReady);
}