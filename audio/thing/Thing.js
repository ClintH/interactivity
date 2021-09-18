import {clamp} from '../util.js';

export default class Thing {
  constructor() {
    // Height & width
    this.size = 100;
    // Current rotation
    this.rotation = 0;
    // Speed of rotation
    this.rotationVector = 0;
    
    // Center x,y
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
    
    // Line segments
    this.deformations = [];
  }
  
  // Apply the thing's own logic - in this case, slowing and shrinking
  exist() {
    const t = this;
    
    // 1. Rotation slows down to zero
    if (Math.abs(t.rotationVector) < 0.001) {
      // if we're close enough to 0 set it to 0 to avoid oscillation
      t.rotationVector = 0;
    } else if (t.rotationVector != 0) {
      // If we're otherwise not zero, slowly reduce speed
      t.rotationVector = (t.rotationVector * 0.99) - 0.0001;
    }

    // 2. Deformations want to shrink. Each loop, reduce by 30%
    t.deformations = t.deformations.map(v => v * 0.7);

    // --- Make sure values are within right ranges
    t.rotationVector = clamp(t.rotationVector, -5, 5);
    t.deformations = t.deformations.map(v => clamp(v, 0, 5));

    // Apply rotation
    t.rotation = t.rotation + (t.rotationVector * 0.1);
  }
  
  // Draw the thing according to its current properties
  draw(ctx) {
    const t = this;
    
    // 1. Set the center of the thing to be our point of reference
    ctx.save();
    ctx.translate(t.x, t.y);

    // 2. Rotate the whole canvas according to the object's rotation.
    //    this makes our job easier
    ctx.rotate(t.rotation);

    // 3. Draw our thing (a square)
    const halfSize = t.size/2;
    ctx.strokeRect(-halfSize,-halfSize, t.size, t.size);

    ctx.restore(); // Undo translate & rotation transformations
    ctx.save();
    ctx.translate(t.x, t.y); // Just use translation again

    // 4. Draw some lines around it
    //  It draws one continuous line, with as many segments as there are frequency bins
    //  The length of each 'spike' corresponds to the frequency data
    let angle = 0;
    // How many degrees between each line
    const degreeSpacing = Math.PI * 2 / t.deformations.length;
    ctx.beginPath();

    const defaultDeformation = 0.5;
    for (let i = 0; i < t.deformations.length; i++) {
      // Compute length of spike based on 'deformation' value
      let radius = (t.deformations[i]) ? t.deformations[i] : defaultDeformation;
      radius = (t.size * radius) + t.size;

      // Calculate x,y based on angle and radius from center
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      ctx.lineTo(x, y);
      angle += degreeSpacing;
    }
    ctx.closePath();
    ctx.stroke();

    // Undo transformations
    ctx.restore();
  }
}

