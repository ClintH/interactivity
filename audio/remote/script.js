// This is the main script for the 'remote' page that
// does some preliminary processing and sends data

import {Remote} from "https://unpkg.com/@clinth/remote@latest/dist/index.mjs";

import Visualiser from '../util/Visualiser.js';
import Audio from './Audio.js';

const r = new Remote({
  remote:true, // true because we're likely running on a mobile device
  useSockets:true,
  useBroadcastChannel:false
});

// Hack in Audio.js to change data processing
const a = new Audio();

// You can set a.computeWave or a.computeFreq to false to disable
// sending wave or FFT data. By default it computes both

// Send analysis result to Remote
a.onData = (d) => r.send(d);

// --- Allow for interactive control over remote. This can be removed if not needed --
// Button toggle data processing (CPU is saved when paused)
document.getElementById('btnPause')?.addEventListener('click', (ev) => {
  a.setPaused(!a.paused);
  if (a.paused) ev.target.classList.add('paused');
  else ev.target.classList.remove('paused');
})

// Control low-pass
document.getElementById('lowPassFreq').addEventListener('input', (e) => {
  let value = parseInt(e.target.value);
  document.getElementById('lowPassFreqLabel').innerText = value.toLocaleString('en');
  a.lowPassFilter.frequency.value = value;
});

// Control high-pass
document.getElementById('highPassFreq').addEventListener('input', (e) => {
  let value = parseInt(e.target.value);
  document.getElementById('highPassFreqLabel').innerText = value.toLocaleString('en');
  a.highPassFilter.frequency.value = value;
});

// Control FFT size
document.getElementById('fftSize').addEventListener('change', (e) => {
  a.analyser.fftSize = parseInt(e.target.value);
});

// Control smoothing
document.getElementById('smoothingTimeConstant').addEventListener('input', (e) => {
  a.analyser.smoothingTimeConstant = parseInt(e.target.value) / 100.0;
  console.log('Smoothing time constant is: ' + a.analyser.smoothingTimeConstant);
});