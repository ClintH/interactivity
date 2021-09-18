

// Clamps a value to be within a min and max
export function clamp(v, min = 0, max = 1) {
  if (isNaN(v)) throw Error('value is NaN');
  
  // eg: clamp(101, 0, 100) returns 100, because the max is 100
  // eg: clamp(-5, 0, 100) returns 0, because the minimum is 0
  // eg: clamp(60, 0, 100) returns 60, because it's within the bounds
  if (v < min) return min;
  if (v > max) return max;
  return v;
}

// Scales an input value from a source range to a destination range.
// By default maps to percentage scale: 
//   scale(5, 0, 10) gives 0.5 (50%)
export function scale(v, sourceMin, sourceMax, destMin = 0, destMax = 1) {
  if (isNaN(v)) throw Error('value is NaN');
  
  // eg: scale(70, 0, 70, 0, 5) = 70 is 100% on the scale of 0-70. Mapping that to the destination range of 0-5 gives 5 (100%)
  // eg: scale(70, 60, 80, 0, 5) = 70 is 50% on the scale of 60-80. Mapping that to the same destination of 0-5 gives 2.5 instead (50%)
  return (v - sourceMin) * (destMax - destMin) / (sourceMax - sourceMin) + destMin;
}


export function getRandomArrayIndex(arr) {
  if (arr === undefined) throw Error('undefined value');
  if (!Array.isArray(arr)) throw Error('Not an array');
  return getRandomInt(0, arr.length);
  
}

export function getRandomInt(min, max) {
  if (isNaN(min)) throw Error('min is NaN');
  if (isNaN(max)) throw Error('max is NaN');
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export function avg(data, start = 0, end = data.length) {
  if (data === undefined) throw Error('data undefined');
  if (!Array.isArray(data)) throw Error('Expected array data');
  if (end > data.length) throw  Error('end is past size of array');
  if (start < 0) throw  Error('start should be at least 0');
  if (end <= start) throw Error('end should be greater than start');

  let total = 0;
  for (var i = start; i < end; i++) {
    if (isNaN(data[i])) throw Error('Data has NaN at position ' + i);
    total += data[i];
  }
  return total / end - start;
}

// Returns the min, max, span and average of an array
//  if abs is true, absolute value of numbers is used (ie. -5 is treated as 5)
export function getMinMaxAvg(data, abs = false) {
  if (data === undefined) throw Error('data undefined');
  if (!Array.isArray(data)) throw Error('Expected array data');
  
  let max = Number.MIN_SAFE_INTEGER;
  let min = Number.MAX_SAFE_INTEGER;
  let total = 0.0;
  for (var i = 0; i < data.length; i++) {
    let d = abs ? Math.abs(data[i]) : data[i];
    if (isNaN(d)) throw Error('Data contains NaN at position ' + i);
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