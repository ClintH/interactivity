// This is the main script for the 'remote' page that
// does some preliminary processing and sends data

import {Remote} from "https://unpkg.com/@clinth/remote@latest/dist/index.mjs";

import Visualiser from '../util/Visualiser.js';
import Threshold from './Threshold.js';

const r = new Remote({
  remote:true // true because we're likely running on a mobile device
});

// Hack in Threshold.js to change data processing
const a = new Threshold();

// Send analysis result to Remote
a.onData = (d) => r.send(d);

// Button toggle data processing (CPU is saved when paused)
document.getElementById('btnPause')?.addEventListener('click', (ev) => {
  a.setPaused(!a.paused);
  if (a.paused) ev.target.classList.add('paused');
  else ev.target.classList.remove('paused');
})