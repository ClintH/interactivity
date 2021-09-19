import Playground from './Playground.js';

const a = new Playground({showVis: true});

document.getElementById('lowPassFreq').addEventListener('input', (e) => {
  let value = parseInt(e.target.value);
  document.getElementById('lowPassFreqLabel').innerText = value.toLocaleString('en');
  a.lowPassFilter.frequency.value = value;
});
document.getElementById('highPassFreq').addEventListener('input', (e) => {
  let value = parseInt(e.target.value);
  document.getElementById('highPassFreqLabel').innerText = value.toLocaleString('en');
  a.highPassFilter.frequency.value = value;
});

document.getElementById('fftSize').addEventListener('change', (e) => {
  a.analyser.fftSize = parseInt(e.target.value);
});
document.getElementById('smoothingTimeConstant').addEventListener('input', (e) => {
  a.analyser.smoothingTimeConstant = parseInt(e.target.value) / 100.0;
  console.log('Smoothing time constant is: ' + a.analyser.smoothingTimeConstant);
});