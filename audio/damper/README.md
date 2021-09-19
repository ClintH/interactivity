# damper

This sketch shows the use of a simple dampening technique. It relies on the generic `remote` sketch for sending full frequency and waveform data.

See `script-mini.js` for a simple example of applying dampening on received data without all the other UI/visualisation stuff going on.

The idea is to sample frequency distributions for some time (4 seconds) to calculate an average for each frequency bin. Once recorded, the averages can be subtracted from current values, thereby helping to remove constant background noise.

In the example sketch, wave data is also dampened, but it mostly makes sense for frequency. The averages are reloaded when the sketch starts, and saved after sampling completes.


```
// Create a damper, giving it the name 'test' (this is important if you want to save/reload data)
const damper = new Damper('test');

// Start/stop
damper.startSampling();
damper.stopSampling();

// Push data
// When sampling, data will be remembered and later used after stopSampling is called
// When not sampling, function will return a 'damped' copy of the data you provide
someArrayOfValues = damper.push(someArrayOfValues);
```

You can also use the damper to take an average snapshot by starting, feeding it data, stopping, and then calling `getDamper`. You can see some commented-out lines that demonstrate this.

Sampling can be automatically stopped by giving a millisecond value to `startSampling`. This way you can avoid sounds such as clicks being recorded.

It only makes sense to use the dampener for values where array positions have consistent meaning. It's great for FFT frequency bins because array position 100, for example, always represents the same band of data, assuming the number of bins is constant. It doesn't work for wave data from the analyser because array positions correspond to time. Therefore the sketch transforms the data, converting all the dB readings to positive and sorting by size.

# Map

index.html: provides some basic buttons for controlling dampener

script.js: processes audio
* Uses the `Damper` helper class to record frequency distribution over time
* Passes received data from the remote to the dampener
* Saves/loads in the browser
* Shows dampening before/after in visualiser
* Wires up UI
  
script-mini.js: a minimal demo of dampening received data

# Things to try

* Try adding the dampening functionality to an existing sketch, such as Threshold. In that case, you'll need to add it to the 'remote' script, Threshold.js
* The wave data processing could be useful for other purposes. For example to suggest whether a sound is short and sharp or softer and sustained.
