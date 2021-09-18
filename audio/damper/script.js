import {Remote} from "https://unpkg.com/@clinth/remote@latest/dist/index.mjs";
import Damper from '../util/Damper.js';
import Visualiser from '../util/Visualiser.js';

const freqDamper = new Damper('freq');
const waveDamper = new Damper('wave');
const save = (d) => d.save();
freqDamper.onStopped = save;
waveDamper.onStopped = save;

// Try to reload existing
freqDamper.recall();
waveDamper.recall();

// Wire up buttons
document.getElementById('btnStart').addEventListener('click', () => {
  // Start sampling after a moment to avoid capturing lingering sound from physical click
  setTimeout(() => { 
    freqDamper.startSampling(4000); 
    waveDamper.startSampling(4000); 
  }, 200);
});
document.getElementById('btnReset').addEventListener('click', () => { 
  freqDamper.reset(); 
  waveDamper.reset();
  freqDamper.save();
  waveDamper.save();
});

const visualiserEl = document.getElementById('dampenedVis');
let visualiser = null;
if (visualiserEl) {
  visualiser = new Visualiser(visualiserEl, this);
  visualiser.setExpanded(true);
}

function visualise(wave, freq) {
  if (!visualiser) return;
  visualiser.renderWave(wave, true);
  visualiser.renderFreq(freq);  
}

const r = new Remote({
  ourId:'damper'
});

// When data is received from the Remote, do something with it...
r.onData = (d) => {
  let freq = d.freq;
  let wave = d.wave;
  
  // Pass it through the dampening logic
  freq = freqDamper.push(freq);

  // Because wave data is indexed by time, it doesn't make sense to
  // pass it in as-is. We can however sort by amplitude to get some impression
  // of the decay of sound.
  wave = wave.map(v => Math.abs(v)); // Convert to absolute values
  wave = wave.sort(); // Sort
  wave = waveDamper.push(wave); // now send 

  // Show the recorded average:
  //visualise(waveDamper.getDamper(), freqDamper.getDamper());
  
  // Or alternatively, show the dampened value
  visualise(wave, freq);
}
