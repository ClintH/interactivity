// Returns freq for a given index
function getFrequencyAtIndex(index) {
  return index * audioCtx.sampleRate / (analyser.frequencyBinCount * 2);
}

// Returns array index for a given freq
function getIndexForFrequency(freq, analyser) {
  const nyquist = analyser.context.sampleRate / 2.0;
  let index = Math.round(freq / nyquist * analyser.frequencyBinCount);
  if (index < 0) index = 0;
  if (index >= analyser.frequencyBinCount) index = analyser.frequencyBinCount - 1;
  return index;
}

function getMinMax(data, start = 0, end = data.length) {
  if (end > data.length) throw new Error('end is past size of array');
  if (start < 0) throw new Error('start should be at least 0');
  if (end <= start) throw new Error('end should be greater than start');

  let max = Number.MIN_SAFE_INTEGER;
  let min = Number.MAX_SAFE_INTEGER;
  for (var i = start; i < end; i++) {
    max = Math.max(data[i], max);
    min = Math.min(data[i], min);
  }
  if (!Number.isFinite(max)) max = 0;
  if (!Number.isFinite(min)) min = 0;

  return { max: max, min: min };
}

function getAvg(data, start = 0, end = data.length) {
  if (end > data.length) throw new Error('end is past size of array');
  if (start < 0) throw new Error('start should be at least 0');
  if (end <= start) throw new Error('end should be greater than start');

  let total = 0;
  for (var i = start; i < end; i++) {
    total += data[i];
  }
  return total / end - start;
}

class Tracker {
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

class SlidingWindow {
  constructor(max = 100) {
    this.store = [];
    this.max = max;
  }

  clear() {
    this.store = [];
  }

  add(sample) {
    this.store.push(sample);
    if (this.store.length >= this.max) {
      this.store = this.store.slice(1);
    }
  }

  avg() {
    let total = 0;
    for (var i = 0; i < this.store.length; i++) {
      total++;
    }
    return total / this.store.length;
  }
}

class IntervalMeter {
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
      intervals.push(interval);
      total += interval;
    }

    if (this.store[0] < performance.now() - 5000) {
      // Haven't received any pulses for a while, reset
      this.store = [];
      return 0;
    }
    return total / (this.store.length - 1);
  }

}
