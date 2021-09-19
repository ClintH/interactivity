// See AudioBase.md for documentation on some of the helper functions used here.
import AudioBase from '../util/AudioBase.js';

export default class Threshold extends AudioBase {
  constructor() {
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

    let result = {};

    // Get frequency and amplitude data
    const freq = new Float32Array(bins);
    const wave = new Float32Array(bins);

    a.getFloatFrequencyData(freq);
    a.getFloatTimeDomainData(wave);

    const freqArray = Array.from(freq);

    // Get highest point between frequency range (0-80Hz)
    result.freq = this.getFrequencyRangeMax(0, 80, freq).toFixed(0); // getFrequencyRangeMax is provided by AudioBase

    // Test whether we hit an arbitrary threshold of -70dB 
    result.threshold = result.freq >= -70;

    // Find most intense frequency bin
    const highestBin = this.getHighestBin(freqArray);

    // Convert array index to frequency using AudioBase's getFrequencyAtIndex helper
    result.highestFreq = this.getFrequencyAtIndex(highestBin);

    // Get highest point in waveform (getWaveMax provided by AudioBase)
    result.wave = this.getWaveMax(wave).toFixed(5);

    // Test whether we hit an peak threshold (this can be a short burst of sound)
    result.peak = result.wave >= 0.9;

    // Test whether we hit a sustained (average) level
    // This must be a longer, sustained noise.

    result.waveAvg = this.getWaveAvg(wave).toFixed(5); // getWaveAvg provided by AudioBase
    result.sustained = result.waveAvg >= 0.3;

    this.visualise(wave, freq);
    return result;
  }

  getHighestBin(freq) {
    // freq is array of values: [-20,-40,-18...]

    // Associate values with array indexes to get:
    // [[-20, 0], [-40, 1], [-18, 2] ...]
    const freqAndIndex = freq.map((db, index) => [db, index]);

    // Now we can sort by the db value (ie. 0th)
    // Sort will be ascending
    const sorted = freqAndIndex.sort((a, b) => a[0] - b[0]);

    // So the highest value will be last
    const highest = sorted[sorted.length - 1];

    // And the index is in 1st index
    return highest[1];
  }

}