
let things = [];
function onDocumentReady() {
  // Set up event listeners
  window.addEventListener('resize', onResize);
  document.getElementById('canvas').addEventListener('pointermove', e=>{
    window.pointerX = e.clientX;
    window.pointerY = e.clientY;
  });

  onResize(); // Manually trigger first time
  createThings();  
  window.requestAnimationFrame(draw);
}

// Create a bunch of random triangles
function createThings() {
  let canvas = document.getElementById('canvas');
  for (let i=0;i<500;i++) {
    let size = randomInt(50,10);
    things.push({
      // Set random location to within canvas, trying to avoid edges
      x: randomInt(canvas.width-size, size),
      y: randomInt(canvas.height-size, size),
      size: size,
      colour: 'rgba(255,0,0,0.3)'
    })
  }
}

// Main draw loop
function draw() {
  let ctx = document.getElementById('canvas').getContext('2d');

  // Clear prior frame
  ctx.fillStyle = 'white';
  ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
  
  // Draw each triangle
  things.forEach(tri=>drawThing(tri,ctx));

  // Loop
  window.requestAnimationFrame(draw);
}

// Draw a single triangle on 2D surface
function drawThing(tri, ctx) {
  // Compute center of triangle
  let triCenter = getTriangleCenter(tri.x,tri.y,tri.size);
  // ...and angle between center and pointer
  let angle = getAngle(
    window.pointerX, window.pointerY,
    triCenter.x, triCenter.y
  );

  // Translate and rotate according to this triangle
  //  this makes drawing rotated triangles super easy
  ctx.save();
  ctx.translate(triCenter.x, triCenter.y);
  ctx.rotate(angle + Math.PI/2);

  // Set fill style for this triangle and draw it
  // Since we performed a translate, the triangle is drawn at the origin
  // we get the rotation for 'free' also via the transformation
  ctx.fillStyle = tri.colour;
  drawTriangle(
    -tri.size/2,
    -tri.size/2,
    tri.size,
    ctx);
  
  // Remove the translate+rotate we performed earlier
  ctx.restore();
 }

 
// Compute the center point of a simple triangle
function getTriangleCenter(x,y,size) {
  return {
    x: Math.floor((x + x+size + x) / 3),
    y: Math.floor((y + y+size + y+size) / 3)
  }
}

// Draw a simple triangle
function drawTriangle(x, y, size, ctx) {
  ctx.beginPath();
  ctx.moveTo(x+(size/2),y);
  ctx.lineTo(x+size,y+size);
  ctx.lineTo(x,y+size);
  ctx.closePath();
  ctx.fill();
}

// Resize canvas to fit window size
function onResize() {
  var canvas = document.getElementById('canvas');
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight;
}

if (document.readyState != 'loading'){
  onDocumentReady();
} else {
  document.addEventListener('DOMContentLoaded', onDocumentReady);
}


//------------------
// Helper functions

// return angle between two points in radians
function getAngle(x1, y1, x2, y2) {
  return Math.atan2(
      y1-y2,
      x1-x2
  );
}

// convert radians to degrees
function radiansToDegrees(radians) {
  return radians * 180 / Math.PI;
}

// return a random integer between min and max
function randomInt(max, min = 0) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}