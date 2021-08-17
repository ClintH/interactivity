/**
 * Calculates an ADSR envelope value. Can use millisecond-based cycle times or
 * stepwise, according to each call to calculate(). Envelope automatically progresses
 * through stages of ADSR. If `-1` is used as the period of a stage, it will stay there
 * until release() is called. Use reset() to reset envelope back to attack stage.
 * 
 * Examples:
 * ```
 * const env = new EnvelopeGenerator({
 *    attack: 1000, attackLevel: 1.0,
 *    decay: 100,
 *    sustain: 5000, sustainLevel: 0.9,
 *    release: 1000, releaseLevel: 0.1,
 *    amplitude = 1, offset = 0,
 *    looping: true
 * });
 * env.useCallPulse(); // Progress thru envelope with each call to calculate()
 * env.useTimePulse(); // Progress thru envelope over time
 * let y = env.calculate();
 * ```
 * Helper function to make a simple rise over 1000ms to value of 1.0 and then down to 0 over 2000ms
 * ```const triEnv = EnvelopeGenerator.triangle(1000, 1, 2000);```
 * 
 * Helper function to ramp up to 1 over 1000ms:
 * ```const rampEnv = EnvelopeGenerator.ramp(1000, 1);```
 * 
 * Supplying an `amplitude` will multiply calculated value by this amount - scaling the output.
 * `offset` raises the minimum value by the provided amount.
 * 
 * Pass a function as `onComplete` to get notified when the envelope finishes
 * 
 * @class EnvelopeGenerator
 * @author Clint Heyer 2020
 */
export default class EnvelopeGenerator {
  static Stages = {
    Attack: 0,
    Decay: 1,
    Sustain: 2,
    Release: 3,
    Complete: 4
  }
  /**
   * Returns an envelope for a time-based ramp to max value
   *
   * @static
   * @param {number} period Period of ramp (millis)
   * @param {number} max Value to reach
   * @returns {EnvelopeGenerator} EnvelopeGenerator
   * @memberof EnvelopeGenerator
   */
  static ramp(period, max = 1) {
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
   * @returns {EnvelopeGenerator} EnvelopeGenerator
   * @memberof EnvelopeGenerator
   */
  static triangle(upPeriod, downPeriod, max = 1) {
    return new EnvelopeGenerator({
      attack: upPeriod, attackLevel: max,
      decay: 0, release: downPeriod, releaseLevel: 0, sustain: 0
    })
  }

  /**
   * Creates an instance of EnvelopeGenerator.
   * @param {*} [{ attack = 10, attackLevel = 1,
   *     sustain = 10, sustainLevel,
   *     decay = 10,
   *     release = 10, releaseLevel = 0,
   *     amplitude = 1, offset = 0,
   *     looping = false }={}]
   * @memberof EnvelopeGenerator
   */
  constructor({attack = 10, attackLevel = 1,
    sustain = 10, sustainLevel,
    decay = 10,
    release = 10, releaseLevel = 0,
    amplitude = 1,
    offset = 0,
    onComplete,
    looping = false} = {}
  ) {
    // If sustain level is not defined, use attack level
    if (sustainLevel === undefined) sustainLevel = attackLevel;
    // If attack level is not defined, use sustain level
    if (attackLevel === undefined) attackLevel = sustainLevel;
    this.onComplete = onComplete;
    this.periods = [attack, decay, sustain, release];
    this.levels = [attackLevel, sustainLevel, sustainLevel, releaseLevel];
    this.stage = 0;
    this.amplitude = amplitude;
    this.offset = offset;
    this.looping = looping;
    this.useTimePulse();
  }


  set(stageIndex, amp, period) {
    if (stageIndex >= this.periods.length) throw Error('stageIndex out of range');
    if (isNaN(amp)) throw Error('amp is NaN');
    if (isNaN(period)) throw Error('period is NaN');

    this.periods[stageIndex] = period;
    if (stageIndex !== EnvelopeGenerator.Stages.Decay)
      this.levels[stageIndex] = amp;
  }

  get(stageIndex) {
    return [this.periods[stageIndex], this.levels[stageIndex]];
  }

  getMaxPeriod() {
    return Math.max(...this.periods);
  }

  getTotalPeriod() {
    return this.periods.reduce((x, culm) => x + culm, 0);
  }
  getMaxLevel() {
    return Math.max(...this.levels);
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

  lerp(a, b, amt) {
    return a * (1 - amt) + b * amt;
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

    // If complete, make callback
    if (this.isComplete()) {
      if (this.onComplete) this.onComplete(this);
    }
    return this.levels[this.stage - 1];
  }

  scale(v) {
    return v * this.amplitude + this.offset;
  }


  /**
   * Calculates the envelope value
   *
   * @returns Value between 0 and 1
   * @memberof EnvelopeGenerator
   */
  calculate() {
    if (this.stage >= this.levels.length) {
      // Finished all stages
      if (!this.looping) { // Not looping, return release level
        return this.scale(this.levels[this.levels.length - 1]);
      } else { // Reset!
        this.reset();
      }
    }

    let p = this.pulseFunc();

    if (p == -1) {
      // End of stage, shift to next
      if (this.periods[this.stage] == -1) {
        // Locked in stage until manual release
        return this.scale(this.levels[this.stage]);
      } else {
        // Move to next stage
        return this.scale(this.nextStage());
      }
    }

    let v = 0;
    switch (this.stage) {
      case 0:
        v = this.levels[this.stage] * p; // attack
        break;
      case 1:
      case 2:
      case 3: // Rest of stages have same logic
        v = this.lerp(this.levels[this.stage - 1], this.levels[this.stage], p);
        break;
    }
    return this.scale(v);
  }

  isComplete() {
    return this.stage == 4;
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
      case 4:
        return "Complete";
    }
  }
}
