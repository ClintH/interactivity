# Envelope Generator

Calculates an ADSR envelope value. Can use millisecond-based cycle times or stepwise, according to each call to `calculate()`. Envelope automatically progresses through stages of ADSR. If `-1` is used as the period of a stage, it will stay there until `release()` is called. Use `reset()` to reset envelope back to attack stage.

Example:

```js
const env = new EnvelopeGenerator({
 attack: 1000, attackLevel: 1.0,
 decay: 100,
 sustain: 5000, sustainLevel: 0.9,
 release: 1000, releaseLevel: 0.1,
 amplitude = 1, offset = 0,
 looping: true
});
env.useCallPulse(); // Progress thru envelope with each call to calculate()
env.useTimePulse(); // Progress thru envelope over time
let y = env.calculate(); // y is the value of the envelope at that moment
```

Helper function to make a simple rise over 1000ms to value of 1.0 and then down to 0 over 2000ms

```js
const triEnv = EnvelopeGenerator.triangle(1000, 1, 2000);
```
 
Helper function to ramp up to 1 over 1000ms:

```js
const rampEnv = EnvelopeGenerator.ramp(1000, 1);
```
 
Supplying an `amplitude` will multiply calculated value by this amount - scaling the output.
`offset` raises the minimum value by the provided amount.
 
Pass a function as `onComplete` to get notified when the envelope finishes.

## Playground

The `playground` sketch visualises the envelope shape and allows you to edit it live and see the results. Click 'Print settings to console' to get the parameters for the envelope you can use in your own code. 

Remember: the code for the playground is not meant to be built upon 

