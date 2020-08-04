let audioCtx, analyser;
let visualiser = null;
// Set up the interval meter.
// 5: number of samples to measure over
// 200: millisecond expected length of pulse (to avoid counting several times for same sound)
//      setting this too high will mean that legit pulses will be ignored
let intervalMeter = new IntervalMeter(5, 200);

if (document.readyState != 'loading') {
  onDocumentReady();
} else {
  document.addEventListener('DOMContentLoaded', onDocumentReady);
}

// Main initialisation, called when document is loaded and ready.
function onDocumentReady() {
  visualiser = new Visualiser(document.getElementById('visualiser'));
  visualiser.setExpanded(false); // Collapse at startup

  // Initalise microphone
  navigator.getUserMedia(
    { audio: true },
    onMicSuccess, // call this when ready
    error => { console.error('Could not init microphone', error); });

  setInterval(updateDisplay, 300);
}

// Microphone successfully initalised, we now have access to audio data
function onMicSuccess(stream) {
  audioCtx = new AudioContext();

  audioCtx.addEventListener('statechange', () => {
    console.log('Audio context state: ' + audioCtx.state);
  });

  analyser = audioCtx.createAnalyser();

  // fftSize must be a power of 2. Higher values slower, more detailed
  // Range is 32-32768
  analyser.fftSize = 1024;

  // smoothingTimeConstant ranges from 0.0 to 1.0
  // 0 = no averaging. Fast response, jittery
  // 1 = maximum averaging. Slow response, smooth
  analyser.smoothingTimeConstant = 0.5;

  // Low and high shelf filters. Gain is set to 0 so they have no effect
  // could be useful for excluding background noise.
  const lowcut = audioCtx.createBiquadFilter();
  lowcut.type = "lowshelf";
  lowcut.frequency.value = 3000;
  lowcut.gain.value = 0;

  const highcut = audioCtx.createBiquadFilter();
  highcut.type = "highshelf";
  highcut.frequency.value = 10000;
  highcut.gain.value = 0;

  // Microphone -> filters -> analyser
  const micSource = audioCtx.createMediaStreamSource(stream);
  micSource.connect(lowcut);
  lowcut.connect(highcut);
  highcut.connect(analyser);

  // Start loop
  window.requestAnimationFrame(analyse);
}

function analyse() {
  const bins = analyser.frequencyBinCount;

  // Get frequency and amplitude data
  const freq = new Float32Array(bins);
  const wave = new Float32Array(bins);
  analyser.getFloatFrequencyData(freq);
  analyser.getFloatTimeDomainData(wave);

  // In testing, with FFT size of 32, bucket #19 correspnds with metronome
  // ...but probably not your sound.
  const magicBucket = 18;

  // Determine pulse if frequency threshold is exceeded.
  // -60 was determined empirically, you'll need to find your own threshold
  let hit = (freq[magicBucket] > -60);

  // An alternative approach is to check for a peak, regardless of freq
  // let hit = thresholdPeak(wave, 0.004);


  if (hit) {
    // Use the IntevalMeter (provided by util.js)
    // to track the time between pulses.

    // Returns TRUE if pulse was recorded, or FALSE if seems to be part of an already noted pulse
    let pulsed = intervalMeter.pulse();

    if (pulsed) {
      // Debug
      // let avgMs = intervalMeter.calculate();
      // let avgBpm = 1.0 / (avgMs / 1000.0) * 60.0;
      // console.log('level: ' + freq[magicBucket] +
      //   '\tms: ' + avgMs +
      //   '\tbpm: ' + avgBpm);
      document.getElementById('hit').classList.add('hit');
    }
  } else {
    document.getElementById('hit').classList.remove('hit');
  }

  // Optional rendering of data
  visualiser.renderWave(wave, true);
  visualiser.renderFreq(freq);

  // Run again
  window.requestAnimationFrame(analyse);
}

// Sets background colour and prints out interval info
function updateDisplay() {
  // Calculate interval and derive BPM (if interval is above 0)
  const currentIntervalMs = intervalMeter.calculate();
  const currentBpm = currentIntervalMs ? parseInt(1.0 / (currentIntervalMs / 1000.0) * 60.0) : 0;

  // Use 300ms as an arbitrary limit (ie. fastest)
  let relative = 300 / currentIntervalMs;

  // Clamp value beteen 0.0->1.0
  if (relative > 1.0) relative = 1; if (relative < 0) relative = 0;

  // Make some hue and lightness values from this percentage
  const h = relative * 360;
  const l = relative * 80;

  // Update text readout
  document.getElementById('intervalMs').innerText = parseInt(currentIntervalMs) + ' ms.';
  document.getElementById('intervalBpm').innerText = currentBpm + ' bpm.';

  // Set colour
  document.body.style.backgroundColor = 'hsl(' + h + ', 100%, ' + l + '%)';
}

// Returns TRUE if the threshold value is hit between the given frequency range
// Note that FFT size & smoothing has an averaging effect
function thresholdFrequency(lowFreq, highFreq, freqData, threshold) {
  const samples = sampleData(lowFreq, highFreq, freqData);
  let max = Number.MIN_SAFE_INTEGER;
  for (var i = 0; i < samples.length; i++) {
    if (samples[i] > threshold) return true;
    max = Math.max(max, samples[i]);
  }

  // For debugging it can be useful to see maximum value within range
  //console.log('Freq max: ' + max);
  return false;
}

// Returns TRUE if the data hits a peak threshold at any point
// Higher FFT sizes are needed to detect shorter pulses.
function thresholdPeak(waveData, threshold) {
  let max = Number.MIN_SAFE_INTEGER;
  for (var i = 0; i < waveData.length; i++) {
    // Need to use Math.abs to swap negatives into positive
    if (Math.abs(waveData[i]) > threshold) return true;
    max = Math.max(max, Math.abs(waveData[i]));
  }
  // For debugging it can be useful to see maximum value within range
  //console.log('Peak max: ' + max * 10000);
  return false;
}

// Returns TRUE if the average amplitude is above threshold across the whole snapshot
// Smaller FFT sizes will have a similar averaging effect
function thresholdSustained(waveData, threshold) {
  let total = 0;
  for (var i = 0; i < waveData.length; i++) {
    // Use Math.abs to swap negatives into positive
    total += Math.abs(waveData[i]);
  }
  const avg = total / waveData.length;

  // For debugging it can be useful to see computed average values
  // console.log('Sustained avg: ' + avg);
  return avg >= threshold;
}

function sampleData(lowFreq, highFreq, freqData) {
  // getIndexForFrequency is a function from util.js
  // it gives us the array index for a given freq
  const lowIndex = getIndexForFrequency(lowFreq, analyser);
  const highIndex = getIndexForFrequency(highFreq, analyser);

  // Grab a 'slice' of the array between these indexes
  const samples = freqData.slice(lowIndex, highIndex);
  return samples;
}
