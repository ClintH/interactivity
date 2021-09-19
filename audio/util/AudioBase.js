import Visualiser from './Visualiser.js';

export default class AudioBase {

  constructor(opts = {}) {
    if (!opts.showVis) opts.showVis = false;
    if (!opts.fftSize) opts.fftSize = 1024;
    if (!opts.smoothingTimeConstant) opts.smoothingTimeConstant = 0.9;

    this.opts = opts;
    this.onData = this.defaultHandler.bind(this);
    this.init();
    this.paused = false;

    const visualiserEl = document.getElementById('visualiser');
    if (visualiserEl) {
      const visualiser = new Visualiser(visualiserEl, this);
      visualiser.setExpanded(opts.showVis);
      this.visualiser = visualiser;
    }
  }

  init() {
    // Initalise microphone
    const getUserMedia = () => {
      return navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.mzGetUserMedia
    }
    // getUserMedia({ audio: true }, 
    //   this.onMicSuccess.bind(this), 
    //   (error) => this.error(error));
    navigator.mediaDevices.getUserMedia({audio: true})
      .then(stream => {
        this.onMicSuccess(stream);
      })
      .catch(err => {
        console.error(err);
      })
  }

  setPaused(v) {
    if (v == this.paused) return;
    this.paused = v;
    if (!v) {
      console.log('Unpaused');
      window.requestAnimationFrame(this.analyseLoop.bind(this));
    }
  }

  setup(audioCtx, stream) {
    const analyser = audioCtx.createAnalyser();

    // fftSize must be a power of 2. Higher values slower, more detailed
    // Range is 32-32768
    analyser.fftSize = this.opts.fftSize;

    // smoothingTimeConstant ranges from 0.0 to 1.0
    // 0 = no averaging. Fast response, jittery
    // 1 = maximum averaging. Slow response, smooth
    analyser.smoothingTimeConstant = this.opts.smoothingTimeConstant;

    // Microphone -> analyser
    const micSource = audioCtx.createMediaStreamSource(stream);
    micSource.connect(analyser);
    return analyser;
  }

  // Microphone successfully initalised, now have access to audio data
  onMicSuccess(stream) {
    const audioCtx = new AudioContext();

    audioCtx.addEventListener('statechange', () => {
      console.log('Audio context state: ' + audioCtx.state);
    });

    this.audioCtx = audioCtx;
    this.analyser = this.setup(audioCtx, stream);

    // Start loop
    window.requestAnimationFrame(this.analyseLoop.bind(this));
  }

  loop(analyser) {
    const a = this.analyser;
    const bins = analyser.frequencyBinCount;

    let result = {
      bins: bins,
      msg: 'Hi, you gotta write a loop function'
    };

    return result;
  }

  analyseLoop() {
    if (this.paused) {
      console.log('Paused');
      return;
    }

    try {
      // Perform analysis
      const result = this.loop(this.analyser);

      // Post the outcome of the analysis
      if (result) this.onData(result);
    } catch (e) {
      console.error(e);
    }

    // Run again
    window.requestAnimationFrame(this.analyseLoop.bind(this));
  }

  visualise(wave, freq) {
    if (!this.visualiser) return;
    this.visualiser.renderWave(wave, true);
    this.visualiser.renderFreq(freq);
  }

  // Returns the maximum FFT value within the frequency range.
  getFrequencyRangeMax(lowFreq, highFreq, freqData) {
    const samples = this.sampleData(lowFreq, highFreq, freqData);
    let max = Number.MIN_SAFE_INTEGER;
    for (var i = 0; i < samples.length; i++) {
      max = Math.max(max, samples[i]);
    }
    return max;
  }

  // Returns TRUE if the data hits a peak threshold at any point
  // Higher FFT sizes are needed to detect shorter pulses.
  getWaveMax(waveData) {
    let max = Number.MIN_SAFE_INTEGER;
    for (var i = 0; i < waveData.length; i++) {
      max = Math.max(max, Math.abs(waveData[i]));
    }
    return max;
  }

  getWaveAvg(waveData) {
    let total = 0;
    for (var i = 0; i < waveData.length; i++) {
      total += Math.abs(waveData[i]);
    }
    const avg = total / waveData.length;
    return avg;
  }

  // Returns a subsampling of frequency data between the given frequencies
  // eg: sampleData(10000,15000, data);
  sampleData(lowFreq, highFreq, freqData) {
    const lowIndex = this.getIndexForFrequency(lowFreq, this.analyser);
    const highIndex = this.getIndexForFrequency(highFreq, this.analyser);

    // Grab a 'slice' of the array between these indexes
    const samples = freqData.slice(lowIndex, highIndex);
    return samples;
  }

  defaultHandler(d) {
    // noop
  }

  // Returns freq for a given index
  getFrequencyAtIndex(index) {
    return index * this.audioCtx.sampleRate / (this.analyser.frequencyBinCount * 2);
  }

  // Returns array index for a given freq
  getIndexForFrequency(freq) {
    const nyquist = this.analyser.context.sampleRate / 2.0;
    let index = Math.round(freq / nyquist * this.analyser.frequencyBinCount);
    if (index < 0) index = 0;
    if (index >= this.analyser.frequencyBinCount) index = this.analyser.frequencyBinCount - 1;
    return index;
  }
}