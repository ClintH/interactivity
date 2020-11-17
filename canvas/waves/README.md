# wave generator

This sketch shows the wave generator. Basic usage is:

```
// Create a default generator that uses a 2000ms sawtooth wave.
let wave = new WaveGenerator();
let value = wave.calculate();
```

Call `calculate` to get the value of the wave at that instant. In this sketch, we do this every time the canvas is drawn, so maybe something like 60 times per second.

The default generator returns values from 0 to 1.

# Setting wave shape

Functions allow setting a different wave shape:
```
wave.useSawtooth(); // Default
wave.useSine();
wave.useTriangle();
wave.useRamp();
wave.useSquare();
```

# Options

Passing in an object when creating the generator can customise it.

`WaveGenerator(amplitude = 1, offset = 0, looping = true)`

Amplitude allows scaling calculated values, eg:

```
let wave = new WaveGenerator(800);
let value = wave.calculate(); // will produce values from 0-800.
```

Offset adds a minimum to all values, shifting the range. 

```
let wave = new WaveGenerator(1, 100);
let value = wave.calculate(); // will produce values from 100-101.
```

Offset is typically combined with amplitude:

```
let wave = new WaveGenerator(800, 800);
let value = wave.calculate(); // will produce values from 800-1600.
```

Set `looping` to false if you just want one cycle of the wave.

# Synchronisation

Use `useTimePulse` to synchronise the generator to time. Pass in the milliseconds for one wave. Eg, `useTimePulse(1000)` will mean a 'loop' of the wave every one second.

If the interval of the wave cycles is shorter than the frequency that `calculate` is called, the effect will be a stepped wave, or maybe it won't resemble the desired wave shape at all.

Alternatively, use `useCallPulse` to synchronise the generator to each call of `calculate`. This means that the wave is frozen, moving a little only when requested. Rather than time, pass in the number of calls necessary for one cycle. Eg `useCallPulse(100)` means a cycle after 100 calls to `calculate`.

# Things to try

* Use the EnvelopeGenerator class to dampen the calculated wave value. This could be used to change the amplitude of the wave over time - swelling from a small wave to a large one, for example.
