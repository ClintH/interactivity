import AudioBase from '../util/AudioBase.js';
/*
This class produces an analysis with frequency distribution and waveform
data. It could be a good starting point for your own signal processing.

At the moment, not much processing happens except for FFT work. This
allows you to process it at the receiving end. This is however at the
cost of broadcasting so much data. Where possible, only send what is
needed by the receiver.
*/

export default class Audio extends AudioBase {
  // Initialisation
  constructor()  {
    super();
    this.computeFreq = true;
    this.computeWave = true;
  }
  
  setup(audioCtx, stream) {
    console.log('General remote analyser setup');
  
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
    // Range is 32-32768
    analyser.fftSize = 1024;

    // smoothingTimeConstant ranges from 0.0 to 1.0
    // 0 = no averaging. Fast response, jittery
    // 1 = maximum averaging. Slow response, smooth
    analyser.smoothingTimeConstant = 0.9;

    // Microphone -> analyser
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
    let result = { };
    
    // Add frequency distribution
    let freq = null;
    if (this.computeFreq) {
      freq = new Float32Array(bins);
      a.getFloatFrequencyData(freq);
      result.freq = Array.from(freq);
    } 
    
    // Add wave data
    let wave = null;
    if (this.computeWave) {
      wave = new Float32Array(bins);
      a.getFloatTimeDomainData(wave);
      result.wave = Array.from(wave);
    }

    // Send data to visualiser if it's there
    this.visualise(wave, freq);
    return result;
  }
}