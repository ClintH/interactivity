import {Remote} from "https://unpkg.com/@clinth/remote@latest/dist/index.mjs";
import Damper from '../util/Damper.js';

const freqDamper = new Damper('freq');
const save = (d) => d.save();
freqDamper.onStopped = save;

// Try to reload existing
freqDamper.recall();

// eg. Start sampling for 4000ms
// freqDamper.startSampling(4000); 

// Useful?
// freqDamper.reset();
// freqDamper.save();

const r = new Remote({
  ourId: 'damper'
});

// When data is received from the Remote, do something with it...
r.onData = (d) => {
  let freq = d.freq;

  // Pass it through the dampening logic
  freq = freqDamper.push(freq);

  // 'freq' variable is the dampened data, ready to use for whatever purpose...
}
