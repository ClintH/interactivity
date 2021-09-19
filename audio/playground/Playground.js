import AudioBase from '../util/AudioBase.js';

export default class Playground extends AudioBase {
  constructor(opts) {
    super(opts);
  }

  setup(audioCtx, stream) {
    console.log('Playground analyser setup');
    const analyser = audioCtx.createAnalyser();

    const lowPassFilter = audioCtx.createBiquadFilter();
    lowPassFilter.type = 'lowpass';
    lowPassFilter.gain.value = -100;
    lowPassFilter.frequency.value = 24000;

    const highPassFilter = audioCtx.createBiquadFilter();
    highPassFilter.type = 'highpass';
    highPassFilter.gain.value = -100;
    highPassFilter.frequency.value = 1;

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

    this.lowPassFilter = lowPassFilter;
    this.highPassFilter = highPassFilter;
    return analyser;
  }

  loop(analyser) {
    const a = this.analyser;
    const bins = analyser.frequencyBinCount;

    let result = {};

    // Get frequency and amplitude data
    const freq = new Float32Array(bins);
    const wave = new Float32Array(bins);
    a.getFloatFrequencyData(freq);
    a.getFloatTimeDomainData(wave);

    // Visualise
    this.visualise(wave, freq);
    return result;
  }
}