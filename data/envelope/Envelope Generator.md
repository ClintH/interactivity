# Envelope Generator

Calculates an ADSR envelope value. Can use millisecond-based cycle times or stepwise, according to each call to `calculate()`. Envelope automatically progresses through stages of ADSR. If `-1` is used as the period of a stage, it will stay there until `release()` is called. Use `reset()` to reset envelope back to attack stage.


Example:

```js
const env = new EnvelopeGenerator({
 // Attack period of 1000, amplitude of 1 (100%)
 attack: 1000, attackLevel: 1.0,
 // Decay doesn't have a level, just period
 decay: 100,
 sustain: 5000, sustainLevel: 0.9,
 release: 1000, releaseLevel: 0.1,
 amplitude = 1, offset = 0,
 looping: true
});
//env.useCallPulse(); // Progress thru envelope with each call to calculate()
//env.useTimePulse(); // Progress thru envelope over time (default)

// Whenever you want the value of the envelope:
let y = env.calculate(); // y is the value of the envelope at that moment
```

## Units

The unit of periods depends on whether the envelope is time based (default), or call-based. Call `useCallPulse` to switch to the latter mode.

Time-based means the units are given in milliseconds. An attack of 100 means that it takes 100 milliseconds (one tenth of a second) to complete the attack phase of the envelope.

Call-based is useful if you want to manually step through the envelope, eg to synchronise with each received message, rather than a clock. An attack of 100 means that `calculate` has to be called 100 times in order to complete the attack phase.

The level or amplitude of values the envelope produces are effectively percentages. Eg, an attack level of 1 means at the end of the attack phase, the envelope will yield 100%. A typical envelope has a release level of 0, meaning that the envelope finishes on 0%.

## Helpers

Helper function to make a simple rise over 1000ms to value of 1.0 and then down to 0 over 2000ms

```js
const triEnv = EnvelopeGenerator.triangle(1000, 1, 2000);
```
 
Helper function to ramp up to 1 over 1000ms:

```js
const rampEnv = EnvelopeGenerator.ramp(1000, 1);
```

## Options

When creating an envelope, supplying an `amplitude` will multiply calculated value by this amount - scaling output. `offset` raises the minimum value by the provided amount.

```js
// This envelope should yield values from 100-1380
const env = new EnvelopeGenerator({
 ...
 amplitude:1280,
 offset: 100
});
```
 
Pass a function as `onComplete` to get notified when the envelope finishes.