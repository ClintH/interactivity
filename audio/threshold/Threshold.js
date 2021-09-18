import AudioBase from '../util/AudioBase.js';

export default class Threshold extends AudioBase {
  constructor()  {
    super();
  }
  
  setup(audioCtx, stream) {
    console.log('Threshold analyser setup');
    const analyser = audioCtx.createAnalyser();

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
    return analyser;
  }
  
  loop(analyser) {
    const a = this.analyser;
    const bins = analyser.frequencyBinCount;

    let result = { };
    
    // Get frequency and amplitude data
    const freq = new Float32Array(bins);
    const wave = new Float32Array(bins);
    a.getFloatFrequencyData(freq);
    a.getFloatTimeDomainData(wave);

    // result.freq = freq;
    // result.wave = wave;
    // Test whether we hit a threshold between 0-80Hz (bass region)
    result.freq = this.getFrequencyRangeMax(0, 80, freq).toFixed(0);
    result.threshold = result.freq >= -70;
   
    // Test whether we hit an peak threshold (this can be a short burst of sound)
    result.wave = this.getWaveMax(wave).toFixed(5);
    result.peak = result.wave >= 0.9;
     
    // Test whether we hit a sustained (average) level
    // This must be a longer, sustained noise.
    result.waveAvg = this.getWaveAvg(wave).toFixed(5);
    result.sustained = this.waveAvg >= 0.3;
    
    this.visualise(wave, freq);
    return result;
  }
}