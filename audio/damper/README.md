# damper

This sketch shows the use of a simple dampening technique.

The idea is to sample data for some time (in this case started and stopped by a user, but it could be based on time) and record the average. Once recorded, this value can be used to transform subsequent data, subtracting it for example.

```
// Create
const damper = new Damper();

// Start/stop
damper.startSampling();
damper.stopSampling();

// Push data
// When sampling, data will be remembered and later used after stopSampling is called
// When not sampling, function will return a 'damped' copy of the data you provide
someArrayOfValues = damper.push(someArrayOfValues);
```

You can also use the damper to take an average snapshot by starting, feeding it data, stopping, and then calling `getDamper`.

Sampling can be automatically stopped by giving a millisecond value to `startSampling`. This way you can avoid sounds such as clicks being recorded.

Note: it only makes sense to use this for values where array positions have consistent meaning. It's great for FFT frequency bins because array position 100, for example, always represents the same band of data. It doesn't work for wave data from the analyser because array positions correspond to time. Therefore the sketch transforms the data, converting all the dB readings to positive and sorting by size.

# Things to try

* The wave data processing could be useful for other purposes. For example to suggest whether a sound is short and sharp or softer and sustained. 