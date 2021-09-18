import {getRandomInt,clamp} from '../util.js';

export default class Particle {
  constructor(bins) {
    if (isNaN(bins)) throw Error('bins is NaN');
    this.size = 0.5;
    //this.balance = Math.random();
    //this.tail = 1;
    this.freq = getRandomInt(0, bins);
    //this.rotation = Math.random();
    //this.rotationVector = 0.1;
    this.mass = (0.001 + this.freq) / bins;
    this.excitement = 0.5;
    this.x = window.innerWidth * Math.random();
    this.y = window.innerHeight*Math.random();
  } 
  
  affect(freq, freqMinMaxAvg) {
    const t = this;
    const dbRange = 100;
    // Set freq to be from 0
    freq += dbRange;
    
    // Gradually increase size of thing according to FFT band
    const freqRelative = clamp(freq / dbRange); 
    t.size += t.size * freqRelative *0.01;

    // Set excitement to current FFT band value
    t.excitement = freqRelative;
    
    
    // Make it 'tilt' the greater difference there is between the min/max of the wave data
    //  this is somewhat similar to the average, but is indicative of a short transient sound vs. sustained sound
    //const span = waveD.max - waveD.min; // With some testing, the span seems to be around 0.0001 for background sound, could be up to 1.0 in principle
    //t.tail = t.tail + (span / 5.0); // Since span could be up to 1, we want to dampen it a little

    // Rotate faster if current average is faster than recent averages
    //if (waveD.avg > ampAvg*2) {
    //  t.rotationVector += (0.0001 + t.rotationVector) * 0.01;
    //}
    
    // Change the 'balance' according to frequency bin thing was randomly paired with
    //let f = 1.0 - (Math.abs(freq[t.resonanceBand]) / freqD.max); // Convert to a relative value
    //t.balance = f;
  }
  
  qualityControl() {
    const t = this;
    t.size = clamp(t.size, 0.01, 1);
    //t.balance = clamp(t.balance);
    //t.tail = clamp(t.tail);
    //t.rotationVector= clamp(t.rotationVector);
    t.mass = clamp(t.mass);
  }
  
  // Apply the thing's own logic - in this case, slowing and shrinking
  exist() {
    const t = this;
    
    // 1. object wants to collapse in size
    t.size -= t.size * 0.001;

    // 2. object wants to return to balance (0.5)
    //let bal = 0.5 - t.balance;
    //if (t.balance > 0.5) t.balance *= 0.99;
    //else t.balance *= 1.01;
    
    // 3a. New rotation determined by rotation speed
    //      Particles with mass will move faster
    //t.rotation += (t.rotationVector*t.mass);

    // 3b. It slows down
    //t.rotationVector -= t.rotationVector*(t.mass/1000); // Slow down due to mass
    //t.rotationVector -= 0.00005; // Slow down to constant friction
    
    // 4. Tail shrinks
    //t.tail = t.tail - (t.tail * 0.2) - 0.001;
  }
  
  // Draw the thing according to its current properties
  draw(ctx) {
    const t = this;
    
    // 1. Set the position of thing to be our point of reference
    ctx.save();
    ctx.translate(t.x, t.y);

    // 2. Rotate the whole canvas according to the object's rotation.
    //ctx.rotate(t.rotation);

    // 3. Calc the height & width of ellipse based on size and balance properties
    //const h = t.size*200;
    //const w = t.balance*200;
    const radius = t.size * 200;
    
    ctx.lineWidth = 2 + (t.excitement*100);
    
    // 4. Opacity is based on mass
    const hue = 300; // Fixed hue
    const opacity = t.mass/4;
    ctx.strokeStyle = `hsla(${hue},100%,50%,${opacity})`;
   
    // 6. Draw
    ctx.beginPath(); 
    ctx.arc(0,0,radius,0,2*Math.PI);
    ctx.stroke();

    ctx.restore();
  }
}

