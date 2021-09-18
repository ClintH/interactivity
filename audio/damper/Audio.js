import AudioBase from '../util/AudioBase.js';

export default class Audio extends AudioBase {
  constructor()  {
    super();
  }
  
  setup(audioCtx, stream) {
    console.log('Damper analyser setup');
  
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
    let freq = new Float32Array(bins);
    let wave = new Float32Array(bins);
    a.getFloatFrequencyData(freq);
    a.getFloatTimeDomainData(wave);

    // Send frequency distribution & waveform
    result.freq = Array.from(freq);
    result.wave = Array.from(wave);
    
    this.visualise(wave, freq);
    return result;
  }
}