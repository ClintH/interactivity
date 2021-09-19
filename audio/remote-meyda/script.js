import {Remote} from "https://unpkg.com/@clinth/remote@latest/dist/index.mjs";
import MeydaAudio from './MeydaAudio.js';

const r = new Remote({
  remote: true // true because we're likely running on a mobile device
});

// See https://meyda.js.org/audio-features for list of features and info
// Note that spectralFlux seems buggy.
const options = {
  bufferSize: 512,
  featureExtractors: [
    "rms", "zcr", "spectralCentroid",
    "spectralFlatness", "spectralSlope",
    "spectralRolloff", "spectralSpread", "spectralSkewness",
    "spectralKurtosis", "loudness", "perceptualSpread", "mfcc"]
}

const a = new MeydaAudio(options);

a.onData = (d) => r.send(d);

// Button toggle data processing (CPU is saved when paused)
document.getElementById('btnPause')?.addEventListener('click', (ev) => {
  a.setPaused(!a.paused);
  if (a.paused) ev.target.classList.add('paused');
  else ev.target.classList.remove('paused');
})
