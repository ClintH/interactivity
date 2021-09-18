import {Remote} from "https://unpkg.com/@clinth/remote@latest/dist/index.mjs";
import SlidingWindow from '../util/SlidingWindow.js';
import {clamp,scale,getMinMaxAvg} from '../util.js';
import Particle from './Particle.js';

const ampWindow = new SlidingWindow(20);
/** @type {CanvasHTMLElement} */
const canvasEl = document.getElementById('canvas');
const particles = [];
const totalParticles = 50;

let pointerX = 0;
let pointerY = 0;
let size = 0;

// Set bins as half the FFT size. So if Remote is using 1024:
const bins = 512;

const r = new Remote({
  ourId:'particles',
  useSockets:false
});


// When data is received from the Remote, do something with it...
function process(d) {
  const waveD = getMinMaxAvg(d.wave, true);
  const freqD = getMinMaxAvg(d.freq);
  
  ampWindow.add(waveD.avg); // Keep track of average amplitude over time
  const ampAvg = ampWindow.avg();
  
  for (let p of particles) {
    // Modify particle based on the frequency band it is assigned to
    p.affect(d.freq[p.freq], freqD, ampAvg);
  }
  
  // Increase size with average amplitude
  size += (ampAvg*0.2);
  
  // Reduce size on its own accord
  size -= size*.001;
  
  //console.log(size +' - ' + ampAvg);
  // Slowly migrate to center
  pointerX *= 0.9999;
  pointerY *= 0.9999;
  qualityControl();
}

// Keep running draw loop
function loop() {
  /** @type {CanvasRenderingContext2D} */
  const ctx = canvasEl.getContext('2d');
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  
  // Fill canvas with black tint
  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  ctx.fillRect(0, 0, width, height);

  for (let p of particles) {
    // Let it do its own thing
    p.exist();
    
    // Make sure values don't get out of range
    p.qualityControl();
    
    // Draw
    p.draw(ctx);    
  }
  
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.beginPath();
  const x = width/2 - (pointerX * width/2);
  const y = height/2 - (pointerY * height/2);
  ctx.arc(x, y, 1 + (size*100), 0, Math.PI*2);
  ctx.fill();
  
  // Loop again
  window.requestAnimationFrame(loop);
}

function qualityControl() {
    size = clamp(size);
    pointerX = clamp(pointerX, -1,1);
    pointerY = clamp(pointerY, -1,1);
}

function onResize() {
  canvasEl.width = window.innerWidth;
  canvasEl.height = window.innerHeight;
}


function createParticles() {
  for (var i = 0; i < totalParticles; i++) {
    let p = new Particle(bins);
    particles.push(p);
  }
}

function init() {
  window.addEventListener('resize', onResize);
  window.addEventListener('pointermove', (e) => {
  
    if (e.buttons == 0) return;
    pointerX += -e.movementX / window.innerWidth;
    pointerY += -e.movementY / window.innerHeight;

  });
  
  onResize(); // Initial fitting of canvas
  
  createParticles();
  
  // Start loop
  window.requestAnimationFrame(loop);
  
  // When we receive audio analayis, send it to process
  r.onData = (d) => process(d);
}

init();