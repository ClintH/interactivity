/**
 * Keeps track of the last X number of values.
 * Can compute the average of these. If you want to
 * average an array of values, use ArraySlidingWindow
 *
 * To use:
 * const w = new SlidingWindow(10); // keep 10 samples
 * w.add(1); // Adds the value 1
 * w.add(v); // Adds the value of variable v
 * w.avg(); // Calculate the average over 10 samples
 * w.getMinMaxAvg(); // Returns an object with the min, max and avg values
 * w.clear(); // Reset the window
 * w.getLength(); // Get the number of samples stored
 * @class SlidingWindow
 */
export default class SlidingWindow {
  constructor(max = 100) {
    this.store = [];
    this.max = max;
  }

  clear() {
    this.store = [];
  }

  add(sample) {
    if (!Number.isFinite(sample)) return;
    if (Number.isNaN(sample)) return;

    this.store.push(sample);
    if (this.store.length >= this.max) {
      this.store = this.store.slice(1);
    }
  }
  
  getLength() {
    return this.store.length;
  }

  getMinMaxAvg() {
    const data = this.store;
    
    let max = Number.MIN_SAFE_INTEGER;
    let min = Number.MAX_SAFE_INTEGER;
    let total = 0.0;
    for (var i = 0; i < data.length; i++) {
      let d = data[i];
      max = Math.max(max, d);
      min = Math.min(min, d);
      total += d;
    }

    return {
      min: min,
      max: max,
      avg: total / data.length
    }
  }

  
  avg() {
    let counted = 0;
    let total = 0;
    for (var i = 0; i < this.store.length; i++) {
      counted++;
      total += this.store[i];
    }
    if (counted == 0) return Number.NaN;
    return total / counted;
  }
}