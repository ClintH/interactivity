/**
 * Computes the interval between pulses
 * 'pulse' is called for every pulse, 'calculate' returns average interval
 * @class IntervalMeter
 */
export default class IntervalMeter {
  /**
   *Creates an instance of IntervalMeter.
   * @param {number} [max=100] Number of pulses used to calculate
   * @param {number} [pulseLengthMs=0] Minimum pulse speed, useful for filtering out mistaken pulses
   * @memberof IntervalMeter
   */
  constructor(max = 100, pulseLengthMs = 0) {
    this.max = max;
    this.pulseLengthMs = pulseLengthMs;
    this.store = [];
    this.next = 0;
  }

  pulse() {
    let now = performance.now();
    if (now < this.next) return false; // Pulse happened too soon, ignoring
    this.next = now + this.pulseLengthMs;
    this.store.push(now);
    if (this.store.length >= this.max) {
      this.store = this.store.slice(1);
    }
    return true;
  }


  // Return average interval between all samples in milliseconds
  calculate() {
    if (this.store.length == 0) return 0;
    let intervals = [];
    let total = 0;
    for (var i = 1; i < this.store.length; i++) {
      let interval = this.store[i] - this.store[i - 1];
      if (isNaN(interval)) debugger;
      intervals.push(interval);
      total += interval;
    }

    if (this.store[0] < performance.now() - 5000) {
      // Haven't received any pulses for a while, reset
      this.store = [];
      return 0;
    }
    if (total == 0) return 0;
    return total / (this.store.length - 1);
  }

}