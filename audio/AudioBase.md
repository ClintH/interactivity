# AudioBase

This class offers some boilerplate functionality.

To use, make your own class that extends it and implements `setup`, `loop` methods.

```js
import AudioBase from '../util/AudioBase.js';

export default class MyClass extends AudioBase {
  constructor() {
    super();
  }

  // Called when audio connection is set up (optional)
  setup(audioCtx, stream) {
    // This must create and return an audio analyser
    // See a sample sketch for how to do this.
    
  }

  // This is called repeatedly after each analysis
  loop(analyser) {
    // This must return a simple analysis result
    // This is usually a reduction of the raw analysis
    
  }
}
```

The constructor supports options to configure the in-built analyser setup:

```js
super({
 fftSize: 1024,
 smoothingTimeConstant: 0.9
});
```

If the `setup` method is omitted, it will use a analyser with default settings. If `loop`  is omitted, it will yield the frequency distribution data.

To respond to results generated from analysis, use the `onData` callback:

```js
let mc = new MyClass();
mc.onData = (result) => {
  // process result
}
```

## Functions

`setPaused(state)`: If `state` is true, audio processing is stopped, saving CPU. Call with false to begin again.

`getFrequencyRangeMax(lowFreq, highFreq, freqData)`: This returns the maximum value in the given frequency range.

```js
// Get max value between 1k and 10k
const  max = this.getFrequencyRangeMax(1000, 10000, freq);
```

`getWaveMax(waveData)`: Returns the highest normalised waveform value (ie amplitude peak)

`getWaveAvg(waveData)`: Returns normalised average of waveform

`sampleData(lowFreq, highFreq, freqData)`: This returns a new array containing only the frequency bins that overlap with supplied frequency range. Number of elements will depend on FFT size

```js
const bass = this.sampleData(0, 100, freq);
```

`getFrequencyAtIndex(index)`: Returns the start frequency for a given FFT bins

`getIndexForFrequency(freq)`: Returns the FFT bin for a given frequency. This allows you to map frequency values to array index values.

## Visualiser

If a HTML element exists with id 'visualiser', it will add an audio visualiser to the page.

Data can be manually sent to the visualiser with `visualise(wave,freq)`. This is normally done at the end of subclass's `loop` function:

```js
loop(a) {
  // Get frequency and amplitude data
  const freq = new Float32Array(bins);
  const wave = new Float32Array(bins);
  a.getFloatFrequencyData(freq);
  a.getFloatTimeDomainData(wave);

  this.visualise(wave, freq)
}
```