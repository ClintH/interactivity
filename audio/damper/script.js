let audioCtx, analyser, visualiser, freqDamper, waveDamper = null;

if (document.readyState != 'loading') {
  onDocumentReady();
} else {
  document.addEventListener('DOMContentLoaded', onDocumentReady);
}

// Main initialisation, called when document is loaded and ready.
function onDocumentReady() {
  freqDamper = new Damper();
  waveDamper = new Damper();
  visualiser = new Visualiser(document.getElementById('visualiser'));

  // Wire up buttons
  document.getElementById('btnStart').addEventListener('click', () => {
    // Start sampling after a moment to avoid capturing lingering sound from physical click
    setTimeout(() => { freqDamper.startSampling(4000); waveDamper.startSampling(4000); }, 200);
  });
  document.getElementById('btnReset').addEventListener('click', () => { freqDamper.reset(); waveDamper.reset(); });

  // Initalise microphone
  navigator.getUserMedia(
    { audio: true },
    onMicSuccess, // Call this when microphone is ready
    error => { console.error('Could not init microphone', error); });
}

// Microphone successfully initalised, now have access to audio data
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
  analyser.smoothingTimeConstant = 0.9;

  // Microphone -> analyser
  const micSource = audioCtx.createMediaStreamSource(stream);
  micSource.connect(analyser);

  // Start loop
  window.requestAnimationFrame(analyse);
}

function analyse() {
  const bins = analyser.frequencyBinCount;

  // Get frequency and amplitude data
  var freq = new Float32Array(bins);
  var wave = new Float32Array(bins);
  analyser.getFloatFrequencyData(freq);
  analyser.getFloatTimeDomainData(wave);

  // Pass it through the dampening logic
  freq = freqDamper.push(freq);

  // Now because wave data is indexed by time, it doesn't make sense to
  // pass it in as-is. We can however sort the data to get some impression
  // of the decay of sound.
  wave = wave.map(v => Math.abs(v)); // Convert to absolute values
  wave = wave.sort(); // Sort
  wave = waveDamper.push(wave); // now send 

  // Optional rendering of data
  visualiser.renderWave(wave, true);
  visualiser.renderFreq(freq);

  // If you're interested in seeing the average recorded by the damper:
  //visualiser.renderFreq(freqDamper.getDamper());
  //visualiser.renderWave(waveDamper.getDamper(), true);

  // Run again
  window.requestAnimationFrame(analyse);

}
