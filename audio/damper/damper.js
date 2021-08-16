/**
 * Dampens input array data.
 * 
 * Assumes input data is same array length as dampening values.
 * Dampening values can be set manually, or by 'sampling' values for some time.
 * 
 * Eg:
 * const d = new Damper();
 * f.startSampling();
 * ...
 * Do this a few times:
 * const dampened = d.push(someData);
 * 
 * And then:
 * d.stopSampling();
 */
class Damper {
  constructor() {
    this.sampler = null;
    this.damper = null;
  }

  /**
   * Begins sampling data to create the dampening level
   * @param {number} autoStopAfterMs
   * @memberof Damper
   */
  startSampling(autoStopAfterMs = 0) {
    if (this.sampler) {
      console.warn('Damper: Sampling already started, resetting');
    }
    this.sampler = [];
    if (autoStopAfterMs) {
      console.info('Damper: Sampling started. Automatically stopping sampling after ' + autoStopAfterMs + 'ms.');
      setTimeout(() => this.stopSampling(), autoStopAfterMs);
    } else {
      console.info('Damper: Sampling started');
    }
  }

  /**
   * Stops sampling data for the dampening.
   *
   * @memberof Damper
   */
  stopSampling() {
    if (this.sampler.length == 0) {
      console.warn('Damper: No samples received. Use push() to send data to be sampled');
    } else {
      let tmp = [];
      tmp.length = this.sampler[0].length;
      console.info(this.sampler.length + ' samples to average.');
      for (var i = 0; i < tmp.length; i++) {
        // For each position, calculate average across all samples
        let total = 0;
        for (var x = 0; x < this.sampler.length; x++) {
          if (this.sampler[x].length != tmp.length) {
            console.error('Damper: Samples contains arrays of different lengths. Expected: ' + tmp.length + ' Encountered:  ' + this.sampler[x].length);
            this.sampler = null;
            return;
          }
          total += this.sampler[x][i];
        }
        let avg = total / this.sampler.length;
        tmp[i] = avg;
      }
      this.setDamper(tmp);
    }
    this.sampler = null;
  }

  /**
   * Pushes data into the damper.
   * Returns the damped value after sampling has start/stopped.
   *
   * @param {number[]} values
   * @memberof Damper
   */
  push(values) {
    if (this.sampler) {
      // Sampling active
      this.sampler.push(values);
    }

    // No damper values yet. Just return
    if (!this.damper) return values;

    // We can only process values that match the shape of the damper.
    if (values.length != this.damper.length) {
      console.warn('Damper: Length of values different than damper, returning raw values');
      return values;
    }

    // Apply damper
    let transformed = []
    for (var i = 0; i < values.length; i++) {
      transformed.push(values[i] - this.damper[i]);
    }
    return transformed;
  }

  reset() {
    this.damper = null;
  }

  setDamper(values) {
    console.info('Damper: dampening enabled with ' + values.length + ' values.');
    this.damper = values;
  }

  getDamper() {
    return this.damper;
  }
}
