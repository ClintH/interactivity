import {Remote} from "https://unpkg.com/@clinth/remote@latest/dist/index.mjs";
import Plot from "../util/Plot.js"
import Histogram from "../util/Histogram.js"

const numericalPlots = ['rms','zcr', 'perceptualSpread','spectralCentroid', 'spectralFlatness', 'spectralKurtosis', 'spectralRolloff', 'spectralSkewness', 'spectralSlope', 'spectralSpread'];
const histoPlots =['loudness','mfcc'];

const plots = new Map();
const plotSamples = 100;

for (let n of numericalPlots) makePlot(n);
for (let n of histoPlots) makePlot(n, false);

function makePlot(n, isPlot = true) {
  const header = document.createElement('H2');
  header.innerText = n;
  const canvas = document.createElement('CANVAS');
  canvas.id = n;
  
  const container = document.createElement('DIV');
  container.classList.add('plot');
  container.appendChild(header);
  container.appendChild(canvas);
  
  document.getElementById('plots').appendChild(container);
  if (isPlot)
    plots.set(n, new Plot(canvas, plotSamples));
  else
    plots.set(n, new Histogram(canvas, plotSamples));
}

let paused = false;

const r = new Remote({
  ourId:'client'
});


// When data is received from the Remote, do something with it...
r.onData = (d) => {
  for (let n of numericalPlots) {
    if (d[n]) {
      plots.get(n).add(d[n]);
    }
  }
  if (d.loudness) {
    plots.get('loudness').set(Object.values(d.loudness.specific));
  }
  if (d.mfcc) {
    plots.get('mfcc').set(Object.values(d.mfcc));
  }
}


document.getElementById('btnPause').addEventListener('click', (e) => {
  paused = !paused;
  for (const [key,value] of plots) {
    value.paused = paused;
  }
});
