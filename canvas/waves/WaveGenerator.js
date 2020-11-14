
/**
 * Multi-purpose wave generator. Default is a sawtooth of 2,000ms duration.
 * 
 * Select the waveform with: `useSine(), useSawtooth(), useSquare(), useTriangle, useRamp()`
 * Select time-based or pulse based with: `useTimePulse(durationMs) or useCallPulse(cycleCount)`
 * 
 * Example usage
 * ```
 * let sineWave = new WaveGenerator();
 * sineWave.useSine();
 * sineWave.useTimePulse(500);
 * let v = sineWave.calculate(); // Get value of wave
 * ```
 * 
 * Use `raw()` to get the value without amplitude or offset applied (0->1.0)
 * @class WaveGenerator
 */
class WaveGenerator {
  /**
   * Creates a default sawtooth, looping wave of 2,000ms duration
   * @param {number} amplitude Maximum value of wave (defaults to 1)
   * @param {number} [offset=0] Offset value (default none)
   * @param {boolean} [looping=true] Loops wave (defaults to true)
   * @memberof TimeFunction
   */
  constructor(amplitude = 1, offset = 0, looping = true) {
    this.amplitude = amplitude;
    this.offset = offset;
    this.looping = looping;

    // Default: sawtooth of 2,000ms duration
    this.useSawtooth();
    this.useTimePulse(2000);
  }

  /**
   * Sets wave to progress with time
   *
   * @param {number} cycleMs Milliseconds per cycle
   * @memberof WaveGenerator
   */
  useTimePulse(cycleMs = 1000) {
    const startedAt = new Date().getTime();
    this.pulseFunc = () => {
      const elapsed = (new Date().getTime() - startedAt);
      if (elapsed > cycleMs && !this.looping) return 0;
      return (elapsed % cycleMs) / cycleMs;
    }
  }
  /**
   * Sets wave to progress with calls to calculate() rather than time.
   *
   * @param {number} cycleCount Number of calls in a cycle
   * @memberof WaveGenerator
   */
  useCallPulse(cycleCount = 100) {
    let count = 0;
    this.pulseFunc = () => {
      if (count == cycleCount && !this.looping) return 0;
      if (count > cycleCount) count = 0;
      return count++ / cycleCount;
    }
  }

  useSquare() {
    this.func = (x) => {
      if (x <= 0.5) return 0;
      return 1;
    }
  }

  useTriangle() {
    this.func = (x) => {
      if (x < 0.5) {
        // Increasing
        return x * 2;
      } else {
        // Decreasing
        return (1.0 - x) * 2;
      }
    }
  }


  /**
   * Returns the calculated value blended with that from another wave generator
   *
   * @param {WaveGenerator[]} waveGen Wave generator(s) to blend
   * @param {number} amount Amount to blend (0.0 to 1.0)
   * @returns Blended result according to amplitude and offset
   * @memberof WaveGenerator
   */
  blend(amount, ...waveGen) {
    let us = this.raw();
    let c = 0;
    for (let i = 0; i < waveGen.length; i++) {
      let other = waveGen[i].raw();
      c = (us + (other * amount));
    }
    c = c / waveGen.length;
    if (c > 1) c = 1;
    else if (c < 0) c = 0;
    return this.amplitude * c + this.offset;
  }

  /**
   * Use a sawtooth wave
   *
   * @memberof WaveGenerator
   */
  useSawtooth() {
    this.func = (x) => x;
  }


  useRamp() {
    this.func = (x) => 1 - x;
  }

  useSine() {
    this.func = (x) => {
      return (Math.sin(x * 2 * Math.PI) / 2) + 0.5;
    }
  }

  raw() {
    const cycle = this.pulseFunc();
    return this.func(cycle);
  }

  /**
   * Returns wave value, according to amplitude and offset
   *
   * @returns Wave value
   * @memberof WaveGenerator
   */
  calculate() {
    const cycle = this.pulseFunc();
    let a = this.func(cycle);
    if (a > 1) a = 1;
    else if (a < 0) a = 0;
    const b = this.amplitude * a + this.offset;
    //console.log("cycle: " + cycle + " a: " + a + " amp: " + this.amplitude + " offset: " + this.offset + " final: " + b);
    return b;
  }
}