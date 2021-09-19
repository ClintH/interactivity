import {Remote} from "https://unpkg.com/@clinth/remote@latest/dist/index.mjs";
import {getMinMaxAvg} from '../util.js';

const r = new Remote({
  ourId: 'ktppacj8ei13avongx8'
  // If you're running your sketch locally and connecting to 
  // a Glitch-hosted processor:
  // url: 'wss://your-project.glitch.me/ws'
});

// When data is received from the Remote, do something with it...
r.onData = (d) => {
  const freq = d.freq;
  const wave = d.wave;

  // If there's no frequency data, we're not interested
  if (!freq) return;

  // Demo: Often useful to figure out the min/max/avg
  const freqMMA = getMinMaxAvg(freq);
  console.log(freqMMA);
}

