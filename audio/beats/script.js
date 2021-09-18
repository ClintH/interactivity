import {Remote} from "https://unpkg.com/@clinth/remote@latest/dist/index.mjs";

const r = new Remote({
  ourId:'beats', 
  useSockets:true, 
  useBroadcastChannel:true
});

// When data is received from the Remote, do something with it...
r.onData = (d) => {
  // Toggle class on or off depending on whether a pulse was detected
  setClass(d.pulsed, 'pulsed', 'hit');
  
  // Use 300ms as an arbitrary limit (ie. fastest)
  let relative = 300 / d.intervalMs;

  // Clamp value between 0.0->1.0
  if (relative > 1.0) relative = 1;
  if (relative < 0) relative = 0;

  // Make some hue and lightness values from this percentage
  const h = relative * 360;
  const l = relative * 80;

  // Update text readout
  document.getElementById('intervalMs').innerText = `Interval: ${parseInt(d.intervalMs)} ms.`;
  document.getElementById('intervalBpm').innerText = `BPM: ${d.bpm}`;

  // Set colour
  document.body.style.backgroundColor = `hsl(${h}, 100%, ${l}%)`;
}

function setClass(v, elemId, className) {
  try {
    if (v) document.getElementById(elemId).classList.add(className);
    else document.getElementById(elemId).classList.remove(className);
  } catch (e) {
    console.log(elemId);
  }
}
