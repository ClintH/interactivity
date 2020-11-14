/**
 * Calculates an ADSR envelope value. Can use millisecond-based cycle times or
 * stepwise, according to each call to calculate(). Envelope automatically progresses
 * through stages of ADSR. If `-1` is used as the period of a stage, it will stay there
 * until release() is called. Use reset() to reset envelope back to attack stage.
 * 
 * Examples:
 * ```
 * let env = new EnvelopeGenerator({
 *    attack: 1000, attackLevel: 1.0,
 *    sustain: 5000, sustainLevel: 0.9,
 *    decay: 100,
 *    release: 1000, releaseLevel: 0.1,
 *    looping: true
 * });
 * env.useCallPulse(); // Progress thru envelope with each call to calculate()
 * env.useTimePulse(); // Progress thru envelope over time
 * let y = env.calculate();
 * ```
 * Helper function to make a simple up over 1000ms to value of 1.0 and then down to 0 over 2000ms
 * ```const triEnv = EnvelopeGenerator.triangle(1000, 1, 2000);```
 * 
 * Helper function to ramp up to 1 over 1000ms:
 * ```const rampEnv = EnvelopeGenerator.ramp(1000, 1);```
 * @class EnvelopeGenerator
 */
class EnvelopeGenerator {

  /**
   * Returns an envelope for a time-based ramp to max value
   *
   * @static
   * @param {number} period Period of ramp (millis)
   * @param {number} max Value to reach
   * @returns
   * @memberof EnvelopeGenerator
   */
  static ramp(period, max) {
    return new EnvelopeGenerator({
      attack: period, attackLevel: max,
      decay: 0, release: 0, sustain: 0, releaseLevel: max
    });
  }
  /**
   * Returns an envelope for a time-based up and down
   *
   * @static
   * @param {number} upPeriod Period to reach max (millis)
   * @param {*} max Value to reach
   * @param {*} downPeriod Period to go down to zero again (millis)
   * @returns
   * @memberof EnvelopeGenerator
   */
  static triangle(upPeriod, max, downPeriod) {
    return new EnvelopeGenerator({
      attack: upPeriod, attackLevel: max,
      decay: 0, release: downPeriod, releaseLevel: 0, sustain: 0
    })
  }

  /**
   * Creates an instance of EnvelopeGenerator.
   * @param {*} [{ attack = 10, attackLevel = 1,
   *     sustain = 10, sustainLevel = 0.9,
   *     decay = 10,
   *     release = 10, releaseLevel = 0,
   *     looping = false }={}]
   * @memberof EnvelopeGenerator
   */
  constructor({ attack = 10, attackLevel = 1,
    sustain = 10, sustainLevel = 0.9,
    decay = 10,
    release = 10, releaseLevel = 0,
    looping = false } = {}
  ) {
    this.periods = [attack, decay, sustain, release];
    this.levels = [attackLevel, sustainLevel, sustainLevel, releaseLevel];
    this.stage = 0;
    this.looping = looping;
    this.useTimePulse();
  }

  /**
   * Time-based envelope. Cycle units are milliseconds
   *
   * @memberof EnvelopeGenerator 
   */
  useTimePulse() {
    this.resetPulse = (periodMs) => {
      const startedAt = new Date().getTime();
      this.pulseFunc = () => {
        const elapsed = (new Date().getTime() - startedAt);
        if (elapsed > periodMs) return -1;
        return (elapsed % periodMs) / periodMs;
      }
    }
    this.resetPulse(this.periods[this.stage]);
  }

  /**
   * Pulse-based envelope. Cycle units are quantity
   *
   * @memberof EnvelopeGenerator
   */
  useCallPulse() {
    this.resetPulse = (cycleCount) => {
      let count = 0;
      this.pulseFunc = () => {
        if (count > cycleCount) return -1;
        return count++ / cycleCount;
      }
    }
    this.resetPulse(this.periods[this.stage]);
  }

  step(a, b, amt) {
    // eg 100, 50, 0.5 = 75
    let x = (a - b) * amt;
    if (b < a) return a - x;
    else return b + x;
  }

  /**
   * Call to release a manual stage
   *
   * @memberof EnvelopeGenerator
   */
  release() {
    this.nextStage();
  }

  /**
   * Reset the envelope to attack stage
   *
   * @memberof EnvelopeGenerator
   */
  reset() {
    this.stage = 0;
    this.resetPulse(this.periods[this.stage]);
  }

  nextStage() {
    this.stage++;
    this.resetPulse(this.periods[this.stage]);
    return this.levels[this.stage - 1];
  }
  /**
   * Calculates the envelope value
   *
   * @returns Value between 0 and 1
   * @memberof EnvelopeGenerator
   */
  calculate() {
    if (this.stage >= this.levels.length) {
      if (!this.looping) return this.levels[this.levels.length - 1];
      else this.reset();
    }

    let p = this.pulseFunc();

    if (p == -1) {
      // End of period, shift to next stage
      if (this.periods[this.stage] == -1) {
        // Locked in stage until manual release
        return this.levels[this.stage];
      } else {
        return this.nextStage();
      }

    }

    let v = 0;
    switch (this.stage) {
      case 0:
        // attack
        v = this.levels[this.stage] * p;
        break;
      case 1:
      case 2:
      case 3:
        v = this.step(this.levels[this.stage - 1], this.levels[this.stage], p);
    }
    return v;
  }

  /**
   * Get text description of current stage
   *
   * @returns {string} Attack|Decay|Sustain|Release
   * @memberof EnvelopeGenerator
   */
  getStage() {
    switch (this.stage) {
      case 0:
        return "Attack";
      case 1:
        return "Decay";
      case 2:
        return "Sustain";
      case 3:
        return "Release";
    }
  }
}