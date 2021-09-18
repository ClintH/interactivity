import SlidingWindow from './SlidingWindow.js';
/**
* Allows averaging over an array of values. Assumes that
* array indexes match up. If you just want an average of
* single values, use SlidingWindow
*
* const w = new ArraySlidingWindow(10); // Keep 10 samples per array index
* w.set([10,3,4]); // Add an array of values
* w.set([11,2,5]); // Add another
*
* // Get the average of each index:
* w.avgs(); // Returns an array, eg [10.5, 2.5, 4.5]
*
* // Same idea, but returning min,max,avg for each array index
* w.getMinMaxAvg()
*
* // Return 'global' min,max,avg across all array indexes
* w.getTotalMinMaxAvg();
*/

export default class ArraySlidingWindow {
  
  constructor(max = 100) {
    this.windows = [];  
    this.max = max;
  }
  
  set(arrayValues) {
    const w = this.windows;
    for (let i=0;i<arrayValues.length;i++) {
      if (!w[i]) w[i] = new SlidingWindow(this.max);
      w[i].add(arrayValues[i]);
    }
  }
  
  clear() {
    for (var i=0;i<this.windows.length;i++) this.windows[i].clear();
  }
  
  getTotalMinMaxAvg() {
    const data = [...this.windows];
    
    let max = Number.MIN_SAFE_INTEGER;
    let min = Number.MAX_SAFE_INTEGER;
    let total = 0.0;
    for (var i = 0; i < data.length; i++) {
      const d = data[i].getMinMaxAvg();
      
      max = Math.max(max, d.max);
      min = Math.min(min, d.min);
      total += d.avg;
    }

    return {
      min: min,
      max: max,
      avg: total / data.length
    }
  }
  
  getMinMaxAvg() {
    const data = [...this.windows];
    
    let d = [];
    
    for (var i = 0; i < data.length; i++) {
      d[i] = data[i].getMinMaxAvg();
    }
    return d;
  }
  
  avgs() {
    const data = [...this.windows];
    
    let avgs = [];
    
    for (var i = 0; i < data.length; i++) {
      avgs[i] = data[i].avg();
    }
    return avgs;
  }
}