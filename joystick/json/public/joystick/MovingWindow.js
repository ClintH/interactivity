class MovingWindow {
  constructor(maxSize) {
    this.data = [];
    this.maxSize = maxSize;
    this.compute = this.compute.bind(this);
    this.push = this.push.bind(this);
  }

  compute() {
    let counted = 0;
    let accumulated = 0;
    for (let d of this.data) {
      accumulated += d[0];
      counted++;
    }
    return accumulated / counted;
  }

  push(val) {
    this.data.push([val, Date.now()]);
    if (this.data.length > this.maxSize) this.data.shift(); // Remove first item
  }
}
