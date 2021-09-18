import {Remote} from "https://unpkg.com/@clinth/remote@latest/dist/index.mjs";

// Remove 'hit' class if target is clicked
document.getElementById('reset').addEventListener('click', () => {
  document.querySelectorAll('.hit').forEach(elem => elem.classList.remove('hit'));
  });

const r = new Remote({
  ourId:'threshold'
});


// When data is received from the Remote, do something with it...
r.onData = (d) => {
  console.log(d);
  if (d.threshold) hit('freqTarget');
  if (d.sustained) hit('susTarget');
  if (d.peak) hit('peakTarget');
}

function hit(elemId) {
    document.getElementById(elemId).classList.add('hit');
}
