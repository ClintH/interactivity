/**
 * Records values sent to it via 'add'
 * Can compute the average, min and max of values seen
 * Use 'reset' to clear the tracker
 *
 * @class Tracker
 */
export default class Tracker {
  constructor(id = null) {
    this.reset();
    this.id = id;
  }

  add(sample) {
    if (!Number.isFinite(sample)) return;
    if (Number.isNaN(sample)) return;
    this._samples++;
    this._total += sample;
    this._min = Math.min(sample, this._min);
    this._max = Math.max(sample, this._max);
  }

  avg() {
    return this._total / this._samples;
  }

  min() {
    return this._min;
  }

  max() {
    return this._max;
  }

  reset(newId = null) {
    if (newId !== null) this.id = newId;
    this._min = Number.MAX_SAFE_INTEGER;
    this._max = Number.MIN_SAFE_INTEGER;
    this._total = 0;
    this._samples = 0;
  }
}
