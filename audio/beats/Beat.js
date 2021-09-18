import AudioBase from '../util/AudioBase.js';
import IntervalMeter from '../util/IntervalMeter.js';

export default class Beat extends AudioBase {
  constructor()  {
    super();
    
    // Set up the interval meter.
    // 5: number of samples to measure over
    // 200: millisecond expected length of pulse (to avoid counting several times for same sound). Setting this too high will mean that legit pulses will be ignored
    this.intervalMeter = new IntervalMeter(5, 200);
  }
  
  setup(audioCtx, stream) {
    console.log('Beat analyser setup');
    const analyser = audioCtx.createAnalyser();

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
    return analyser;
  }
  
  loop(analyser) {
    const a = this.analyser;
    const bins = analyser.frequencyBinCount;

    let result = { pulsed: false };
    
    // Get frequency and amplitude data
    const freq = new Float32Array(bins);
    const wave = new Float32Array(bins);
    a.getFloatFrequencyData(freq);
    a.getFloatTimeDomainData(wave);

    // In testing, with FFT size of 32, bucket #19 corresponds with metronome
    // ...but probably not your sound?
    const magicBucket = 18;

    // Determine pulse if frequency threshold is exceeded.
    // -60 was determined empirically, you'll need to find your own threshold
    let hit = freq[magicBucket] > -60;
    
    // An alternative approach is to check for a peak, regardless of freq
    // let hit = this.getWaveMax(wave) > 0.004;
    
    if (hit) {
       // Use the IntevalMeter (provided by util/IntervalMeter.js)
      // to track the time between pulses.

      // Returns TRUE if pulse was recorded, or FALSE if seems to be part of an already noted pulse
      result.pulsed = this.intervalMeter.pulse();
    }
    const intervalMs = this.intervalMeter.calculate();
    const bpm = intervalMs ? parseInt(1.0 / (intervalMs / 1000.0) * 60.0) : 0;
    result.intervalMs = intervalMs.toFixed();
    result.level = freq[magicBucket].toFixed();
    result.bpm = bpm;
    this.visualise(wave, freq);
    return result;
  }
}