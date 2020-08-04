let audioCtx, analyser, lowPassFilter, highPassFilter = null;
let visualiser = null;

if (document.readyState != 'loading') {
  onDocumentReady();
} else {
  document.addEventListener('DOMContentLoaded', onDocumentReady);
}

// Main initialisation, called when document is loaded and ready.
function onDocumentReady() {


  document.getElementById('lowPassFreq').addEventListener('input', (e) => {
    let value = parseInt(e.target.value);
    document.getElementById('lowPassFreqLabel').innerText = value.toLocaleString('en');
    lowPassFilter.frequency.value = value;
  });
  document.getElementById('highPassFreq').addEventListener('input', (e) => {
    let value = parseInt(e.target.value);
    document.getElementById('highPassFreqLabel').innerText = value.toLocaleString('en');
    highPassFilter.frequency.value = value;
  });

  document.getElementById('fftSize').addEventListener('change', (e) => {
    analyser.fftSize = parseInt(e.target.value);
  });
  document.getElementById('smoothingTimeConstant').addEventListener('input', (e) => {
    analyser.smoothingTimeConstant = parseInt(e.target.value) / 100.0;
    console.log('Smoothing time constant is: ' + analyser.smoothingTimeConstant);
  });
  visualiser = new Visualiser(document.getElementById('visualiser'));

  // Initalised microphone
  navigator.getUserMedia(
    { audio: true },
    onMicSuccess,
    error => { console.error('Could not init microphone', error); });
}


// Microphone successfully initalised,
// we now have access to audio data
function onMicSuccess(stream) {
  audioCtx = new AudioContext();

  // When the context starts 'running', initalise microphone
  audioCtx.addEventListener('statechange', () => {
    console.log('Audio context state: ' + audioCtx.state);
  });

  lowPassFilter = audioCtx.createBiquadFilter();
  lowPassFilter.type = 'lowpass';
  lowPassFilter.gain.value = -100;
  lowPassFilter.frequency.value = 24000;

  highPassFilter = audioCtx.createBiquadFilter();
  highPassFilter.type = 'highpass';
  highPassFilter.gain.value = -100;
  highPassFilter.frequency.value = 1;

  analyser = audioCtx.createAnalyser();

  // fftSize must be a power of 2. Higher values slower, more detailed
  // range is 32-32768
  analyser.fftSize = 1024;

  // smoothingTimeConstant ranges from 0.0 to 1.0
  // 0 = no averaging. Fast response, jittery
  // 1 = maximum averaging. Slow response, smooth
  analyser.smoothingTimeConstant = 0.9;

  // Microphone -> filters -> analyser
  const micSource = audioCtx.createMediaStreamSource(stream);
  micSource.connect(lowPassFilter);
  lowPassFilter.connect(highPassFilter);
  highPassFilter.connect(analyser);

  // Start rendering loop
  window.requestAnimationFrame(analyse);
}

function analyse() {
  const bins = analyser.frequencyBinCount;

  // Get freq data - values are in dB
  const freq = new Float32Array(bins);
  analyser.getFloatFrequencyData(freq);

  // Optional rendering of frequency data
  visualiser.renderFreq(freq);

  // Get snapshot of waveform
  const wave = new Float32Array(bins);
  analyser.getFloatTimeDomainData(wave);

  // We don't care about positive/negative cycle of wave
  for (var i = 0; i < bins; i++) {
    wave[i] = Math.abs(wave[i]);
  }

  // Optional rendering of waveform data
  visualiser.renderWave(wave, false);


  // Run again
  window.requestAnimationFrame(analyse);

}





