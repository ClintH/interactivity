import SlidingWindow from "./SlidingWindow.js"
import BaseGraph from "./BaseGraph.js"
export default class Plot extends BaseGraph {
    
  constructor(canvasEl, samples = 10) {
    super(canvasEl);
    this.buffer = new SlidingWindow(samples);
    this.samples = samples;
  }
  

  draw(g, canvasWidth, canvasHeight) {
    const labelInset = 5;
    const precision = this.precision;
    
    const d = [...this.buffer.store]; // copy
    let {min,max,avg} = this.buffer.getMinMaxAvg();
  
    const range = this.pushScale(min,max);
    
    
    const lineWidth = canvasWidth/ this.buffer.getLength();
    
    let x = labelInset + 20;
    g.beginPath();
    g.strokeStyle ='silver';
    for (let i=0;i<d.length;i++) {
      const y = this.map(d[i], this.scaleMin, this.scaleMax, canvasHeight, 0);
      if (i == 0)
        g.moveTo(x,y);
      else
        g.lineTo(x, y);
      x += lineWidth; 
    }
    g.stroke();
    
    g.fillStyle = 'black';
    
    this.drawScale(g, min, max, avg, range, canvasWidth, canvasHeight);

  }

  clear() {
    this.buffer.clear();
    this.repaint();
  }
  
  add(v) {
    this.buffer.add(v);
    if (this.paused) return;
    this.repaint();
  }
  
}