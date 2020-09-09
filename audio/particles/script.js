let audioCtx, analyser, ampWindow = null;
const things = [];
const numberOfThings = 100;
const fftSize = 512;


/**
 * Draws a thing on the canvas
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {{mass,rotation,resonanceBand,size,tail,tilt,x,y,rotationSpeed}} t
 */
function draw(ctx, t) {
  // Draw thing
  ctx.save();

  // 1. Set the position of thing to be our point of reference
  ctx.translate(t.x - t.size / 2, t.y - t.size / 2);

  // 2. Rotate the whole canvas according to the object's rotation.
  //    this makes our job easier
  ctx.rotate(t.rotation);

  // 3. Draw weird little arrow
  ctx.beginPath();
  ctx.lineJoin = 'miter';
  ctx.moveTo(-t.size, 0);     // Start a little to the left
  ctx.lineTo(t.size * 2, 0);  // Horiz. base line
  ctx.lineTo(t.size / 2, -t.size / 2); // Draw angled line

  // 3. Width is based on 'tilt' 
  ctx.lineWidth = clamp(10 * t.tilt, 1, 1000);

  // 4. Opacity is based on 'tail'
  ctx.strokeStyle = 'rgba(0,0,0,' + (t.tail * 0.5) + ')';
  ctx.stroke();


  // This undoes the translate + rotate transformation, ready for next
  // thing to be drawn.
  ctx.restore();
}

/**
 * Applies sound data to things, and also computes a thing's own changes
 *
 * @param {{mass,rotation,size,tail,tilt,x,y,resonanceBand,rotationSpeed}} t
 * @param {{min,max,avg}} waveD
 * @param {{min,max,avg}} freqD
 *
 **/
function behaviour(t, wave, waveD, freq, freqD) {

  // Increase size of thing according to average amplitude
  t.size = t.size + (5 * waveD.avg);

  // Make it 'tilt' the greater difference there is between the min/max of the wave data
  //  this is somewhat similar to the average, but is indicative of a short transient sound vs. sustained sound
  const span = waveD.max - waveD.min; // With some testing, the span seems to be around 0.0001 for background sound, could be up to 1.0 in principle
  t.tilt = t.tilt + (span / 5.0); // Since span could be up to 1, we want to dampen it a little

  // Rotate faster if current average is faster than recent averages
  if (waveD.avg > ampWindow.avg() * 2) {
    t.rotationSpeed += (0.02 * t.mass);
  }

  // Change the size of the tail according to frequency bin thing was randomly paired with
  let f = 1.0 - (Math.abs(freq[t.resonanceBand]) / freqD.max); // Convert to a relative value
  t.tail = f;

  // -----------------------------------------------
  // Apply the thing's own logic, separate from sound
  // 1. object wants to collapse in size
  t.size = t.size - ((t.size * 0.01) * t.mass) - 0.2;

  // 2. object wants to return to balance (0.0)
  t.tilt = t.tilt - ((t.tilt * 0.2) * t.mass) - 0.001;

  // 3a. New rotation determined by rotation speed
  t.rotation += t.rotationSpeed;

  // 3b. It slows down
  t.rotationSpeed = t.rotationSpeed - (t.rotationSpeed * 0.1 * (1.0 - t.mass)) - 0.0005;

  // 4. Tail shrinks
  t.tail = t.tail - (t.tail * 0.2) - 0.001;

  // Final sanity checks & clean-up
  // 1. Don't let the size get too small or large
  t.size = clamp(t.size, 1, 1000)

  // 2. tilt should be between 0-1
  t.tilt = clamp(t.tilt, 0, 1);

  // 3. rotation speed between 0-1
  t.rotationSpeed = clamp(t.rotationSpeed, 0, 1);

  // 4. tail should be between 0-1
  t.tail = clamp(t.tail, 0, 1);
}

// Loops contunually, calling analyse and draw each time
function loop() {
  // Compute analysis
  const bins = analyser.frequencyBinCount;
  var freq = new Float32Array(bins);
  var wave = new Float32Array(bins);
  analyser.getFloatFrequencyData(freq);
  analyser.getFloatTimeDomainData(wave);

  // Get the min, max & average of this slice of waveform data
  // max: absolute max, min: absolute min, avg: average of absolute data
  let waveD = getMinMaxAvg(wave);
  ampWindow.add(waveD.avg); // Keep track of average readings over time

  let freqD = getMinMaxAvg(freq);

  // Get the drawing context
  const ctx = document.getElementById('canvas').getContext('2d');

  // Fill the canvas with cyan but at 5% opacity, to let movement smear
  ctx.fillStyle = 'rgba(0,255,255,0.05)';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Now, for each thing we have...
  for (var i = 0; i < things.length; i++) {
    // Draw it
    draw(ctx, things[i]);

    // Change its properties
    behaviour(things[i], wave, waveD, freq, freqD);
  }

  // Loop again!
  window.requestAnimationFrame(loop);
}


// Returns the min, max, span and average of an array
function getMinMaxAvg(data) {
  // Note: sign of data is ignored, so -5 is treated the same as 5.
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

/**
 * Creates a thing. Each thing is modified and drawn separately
 * We've made a up few random properties that each thing has.
 * How sound affects it or how it gets rendered to screen is determined later.
 * @returns
 */
function createThing() {
  return {
    size: 100,
    tilt: 0,
    tail: 0,
    resonanceBand: Math.floor(Math.random() * (fftSize / 2)), // Pick a random FFT bin
    rotation: 0,
    rotationSpeed: 0.1,
    mass: Math.random() * 0.5, // Random value between 0-0.5
    x: Math.random() * window.innerWidth, // Position randomly
    y: Math.random() * window.innerHeight
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

  // Create some things
  var spacing = 50;
  var x = 0;
  var y = spacing;
  for (var i = 0; i < numberOfThings; i++) {
    let newThing = createThing();

    if (x + spacing > window.innerWidth) {
      y += spacing;
      x = 0;
    }
    x += spacing;

    newThing.x = x;
    newThing.mass = newThing.resonanceBand / (fftSize / 2);
    newThing.y = y;
    things.push(newThing);
  }

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
  analyser.fftSize = fftSize;

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