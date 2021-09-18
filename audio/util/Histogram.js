import SlidingWindow from "./SlidingWindow.js"
import BaseGraph from "./BaseGraph.js"

export default class Histogram extends BaseGraph {
  constructor(canvasEl) {
    super(canvasEl);
    this.buffer = [];
    this.labelInset = 5;
    this.padding = 5;
    // Highlight start/end array indexes
    this.highlightStart = -1;
    this.highlightEnd = -1;
    
    canvasEl.addEventListener('pointermove', e=>{ 
      let x = e.offsetX;
      let index = this.xToIndex(x);
      if (index !== undefined) {
        this.highlightStart = index;
        this.highlightEnd = index;
      }
    });
    
    canvasEl.addEventListener('pointerout', e=> {
      this.highlightStart = -1;
      this.highlightEnd = -1;
    });
    
  }
  
  draw(g, canvasWidth, canvasHeight) {
    const precision = this.precision;
    
    const d = [...this.buffer]; // copy
    const {min,max,avg} = this.getMinMaxAvg(d);
    this.lineWidth = canvasWidth / d.length;
    
    const range = this.pushScale(min,max);
    
    let x = this.labelInset + this.padding;
    g.beginPath();
    g.strokeStyle = 'whitesmoke';
    g.moveTo(0, canvasHeight/2);
    g.lineTo(canvasWidth, canvasHeight/2);
    g.stroke();
    
    
    const highlighting =  (this.highlightStart >= 0 && this.highlightEnd >= 0);
    

    if (highlighting) {
      g.fillStyle = 'hsl(100,100%,70%)';
      const endX = this.indexToX(this.highlightEnd) ;
      const startX = this.indexToX(this.highlightStart);
      const width = endX + this.lineWidth - startX;
      g.fillRect(startX, 0, width, canvasHeight);
    }
    g.beginPath();
    g.strokeStyle = 'silver';
    
    let highlightTotal = 0;
    for (let i=0;i<d.length;i++) {
      const y = this.map(d[i], this.scaleMin, this.scaleMax, canvasHeight, 0);
      if (i == 0)
        g.moveTo(x,y);
      else
        g.lineTo(x, y);
      x += this.lineWidth;
      
      if (highlighting && i >= this.highlightStart && i<=this.highlightEnd) {
        highlightTotal += d[i];
      }
    }
    g.stroke();
  
    
    this.drawScale(g, min, max, avg, range, canvasWidth, canvasHeight);
    
    if (highlighting) {
      g.fillText(this.scaleNumber(highlightTotal), canvasWidth/2, this.textHeight + this.labelInset);
      
    }
    
  }
  
  indexToX(index) {
    return (index * this.lineWidth) + this.labelInset + this.padding;  
  }
  
  xToIndex(x) {
    x -= this.labelInset + this.padding;
    if (x < 0) return;
    return Math.floor(x / this.lineWidth);  
  }
  
  clear() {
    this.buffer.clear();
    this.repaint();
  }
  
  set(v) {
    if (v === undefined) throw Error('v undefined');
    if (v === null) throw Error('v null');
    if (!Array.isArray(v)) throw Error('v not an array');
    this.buffer = v;
    this.repaint();
    
  }
  
  getMinMaxAvg(data) {
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
}