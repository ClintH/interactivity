import {ReconnectingWebsocket} from "./ReconnectingWebsocket.js";
const ourId = Date.now().toString(36) + Math.random().toString(36).substr(2);
const url = (location.protocol === 'http:' ? 'ws://' : 'wss://') + location.host + '/ws';
const socket = new ReconnectingWebsocket(url);

socket.onmessage = (evt) => {
  try {
    const o = JSON.parse(evt.data);
    if (o.fromId === ourId) return; // data is from ourself
    onData(o);
  } catch (err) {
    console.error(err);
    console.error('Data: ', evt.data);
  }
};

let frozen = false;

document.getElementById('last').addEventListener('click', e => {
  frozen = !frozen;
  document.getElementById('last').classList.toggle('frozen');
});

function onData(o) {
  // Eg:
  const accel = o.accel;
  const accelGrav = o.accelGrav;
  const rot = o.rot;

  if (!frozen) showData(o);
}


function showData(o) {
  let html = 'accel';
  html += '<table><tr><td>' + o.accel.x.toFixed(3) + '</td><td>' + o.accel.y.toFixed(3) + '</td><td>' + o.accel.z.toFixed(3) + '</tr></table>';
  html += '</table>';

  html += 'rot';
  html += '<table><tr><td>' + o.rot.alpha.toFixed(3) + '</td><td>' + o.rot.beta.toFixed(3) + '</td><td>' + o.rot.gamma.toFixed(3) + '</tr></table>';

  html += 'rotMotion';
  html += '<table><tr><td>' + o.rotMotion.alpha.toFixed(3) + '</td><td>' + o.rotMotion.beta.toFixed(3) + '</td><td>' + o.rotMotion.gamma.toFixed(3) + '</tr></table>';

  html += 'accelGrav';
  html += '<table><tr><td>' + o.accelGrav.x.toFixed(3) + '</td><td>' + o.accelGrav.y.toFixed(3) + '</td><td>' + o.accelGrav.z.toFixed(3) + '</tr></table>';
  html += '</table>';
  document.getElementById('last').innerHTML = html;
}