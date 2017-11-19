function onDocumentReady() {
  window.addEventListener('resize', onResize);

  onResize(); // Manually trigger first time
}

function draw() {
  let ctx = document.getElementById('canvas').getContext('2d');
  
  // Your drawing code here!
  drawDemo(ctx);
}

// Draws a circle
function drawDemo(ctx) {
  ctx.beginPath();
  ctx.arc(ctx.canvas.width/2,ctx.canvas.height/2, ctx.canvas.width/3,0,2*Math.PI);
  ctx.fill();
}

// Resize canvas according to window size
function onResize() {
  var canvas = document.getElementById('canvas');
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight;
  draw();
}

if (document.readyState != 'loading'){
  onDocumentReady();
} else {
  document.addEventListener('DOMContentLoaded', onDocumentReady);
}