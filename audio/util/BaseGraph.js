import SlidingWindow from "./SlidingWindow.js"

export default class BaseGraph {
    
  constructor(canvasEl) {
    if (canvasEl === undefined) throw Error('canvasEl undefined');
    this.canvasEl = canvasEl;
    this.drawLoop = this.baseDraw.bind(this);
    this.precision= 3;
    this.paused = false;
    this.allowScaleDeflation = false;
    this.scaleMin = Number.MAX_SAFE_INTEGER;
    this.scaleMax = Number.MIN_SAFE_INTEGER;
    this.labelInset = 5;
    
    this.lastPaint = 0;
    this.maxPaintMs = 10; // Don't trigger paint within 10ms
    
    canvasEl.addEventListener('pointerup', e=>{
      this.paused = !this.paused;
      if (this.paused)
        canvasEl.classList.add('paused');
     else
        canvasEl.classList.remove('paused');
    });
    const measure = this.canvasEl.getContext('2d').measureText('Xy');
    this.textHeight = measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent;
  }
  
  pushScale(min, max) {
    if (min > this.scaleMin && this.allowScaleDeflation) this.scaleMin = min;
    else this.scaleMin = Math.min(min, this.scaleMin);
    
    if (max < this.scaleMax && this.allowScaleDeflation) this.scaleMax = max;
    else this.scaleMax = Math.max(max, this.scaleMax);
    const range = this.scaleMax - this.scaleMin;
    return range;
  }
  
  map(value, x1, y1, x2, y2) {
    return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
  }

  scaleNumber(v) {
    if (Math.abs(v) > 50) return parseInt(v);
    return v.toFixed(this.precision);
  }
  
  drawScale(g, min,max,avg,range, canvasWidth, canvasHeight) {
    const labelInset = this.labelInset;
    const th = this.textHeight;
    const rightJustif = canvasWidth -50;
    
    g.fillStyle ='black';
    // Scale
    g.fillText(this.scaleNumber(this.scaleMin), labelInset, canvasHeight-th - labelInset);
    g.fillText(this.scaleNumber(((range/2) + this.scaleMin)), labelInset, (canvasHeight/2)-(th/2));
    g.fillText(this.scaleNumber(this.scaleMax), labelInset, labelInset + th);
    
    // Live
    g.fillText(this.scaleNumber(min), rightJustif, canvasHeight-th-labelInset);
    g.fillText(`Avg: ${this.scaleNumber(avg)}`, rightJustif, (canvasHeight/2)-(th/2));
    g.fillText(this.scaleNumber(max), rightJustif, labelInset + th);
  }
  
  baseDraw() {
    const c = this.canvasEl;
    const g = c.getContext('2d');
    const canvasHeight = c.height;
    const canvasWidth = c.width;
    const labelInset = 5;
    const precision = this.precision;
    
    g.fillStyle ='white';
    g.fillRect(0,0,canvasWidth,canvasHeight);
  
    g.beginPath();
    g.strokeStyle = 'whitesmoke';
    g.moveTo(0, canvasHeight/2);
    g.lineTo(canvasWidth, canvasHeight/2);
    g.stroke();
    
    this.draw(g, canvasWidth, canvasHeight);
  
    this.lastPaint = performance.now();
  }
  
  
  repaint() {
    if (this.paused) return;
    
    const elapsed = performance.now() - this.lastPaint;
    if (elapsed >= this.maxPaintMs)
      window.requestAnimationFrame(this.drawLoop);  
  }
  
}