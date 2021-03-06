import {ReconnectingWebsocket} from "./ReconnectingWebsocket.js";
const ourId = Date.now().toString(36) + Math.random().toString(36).substr(2);
const status = document.getElementById('status');
let frozen = false;

// Websockets
const url = (location.protocol === 'http:' ? 'ws://' : 'wss://') + location.host + '/ws';
const socket = new ReconnectingWebsocket(url);
socket.onopen = (e) => {
  setStatus('Connected');
};
socket.onclose = (e) => {
  setStatus('Disconnected', true)
}
socket.onerror = (e) => {
  setStatus(e, true);
}

// Motion events
document.getElementById('btnStart').addEventListener('click', (e) => {
  requestPermission();
  e.target.disabled = true;
});

let lastData = {
  accel: {x: 0, y: 0, z: 0},
  accelGrav: {x: 0, y: 0, z: 0},
  rotMotion: {alpha: 0, beta: 0, gamma: 0},
  rot: {alpha: 0, beta: 0, gamma: 0},
  fromId: ourId
};
let started = false;

function requestPermission() {
  const addDeviceMotion = function () {
    window.addEventListener('devicemotion', (motion) => {
      lastData.accel = {
        x: motion.acceleration.x,
        y: motion.acceleration.y,
        z: motion.acceleration.z
      };
      lastData.accelGrav = {
        x: motion.accelerationIncludingGravity.x,
        y: motion.accelerationIncludingGravity.y,
        z: motion.accelerationIncludingGravity.z
      };
      lastData.rotMotion = {
        alpha: motion.rotationRate.alpha,
        beta: motion.rotationRate.beta,
        gamma: motion.rotationRate.gamma
      };
    });
    console.log('Added device motion event handler');
    started = true;
  }

  if (typeof (DeviceMotionEvent) !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission()
      .then(response => {
        if (response == 'granted') {
          addDeviceMotion();
        }
      })
      .catch((e) => setStatus(e, true));
  } else {
    addDeviceMotion();
  }

  const addDeviceOrientation = function () {
    window.addEventListener('deviceorientation', (orient) => {
      lastData.rot = {
        alpha: orient.alpha,
        beta: orient.beta,
        gamma: orient.gamma
      }
    });
    console.log('Added device orientation event handler');
    started = true;
  }

  if (typeof (DeviceOrientationEvent) !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then(response => {
        if (response == 'granted') {
          addDeviceOrientation();
        }
      })
      .catch((e) => setStatus(e, true));
  } else {
    addDeviceOrientation();
  }
}

// Stream data via websocket
function processData() {
  if (!started || frozen) {
    setTimeout(processData, 5000);
    return;
  }

  try {
    socket.send(JSON.stringify(lastData));
    showData(lastData);
  } catch (err) {
    setStatus(err, true);
  }

  // Request function to run again when browser has a moment
  //window.requestAnimationFrame(processData);
  setTimeout(processData, 200); // Send every 200ms. Use the above alternative to send faster
}
processData();

document.getElementById('btnFreeze').addEventListener('click', e => {
  frozen = !frozen;
  document.getElementById('last').classList.toggle('frozen');
});

function setStatus(msg, isError = false) {
  console.log(msg);
  status.innerText = msg;
  if (isError) {
    status.classList.add('error');
  } else {
    status.classList.remove('error');
  }
}

function showData(m) {
  if (frozen) return;
  try {
    let html = '<h3>accel (x,y,z)</h3>';
    html += '<table><tr><td>' + m.accel.x.toFixed(3) + '</td><td>' + m.accel.y.toFixed(3) + '</td><td>' + m.accel.z.toFixed(3) + '</tr></table>';
    html += '</table>';

    html += '<h3>rot (alpha, beta, gamma)</h3>';
    html += '<table><tr><td>' + m.rot.alpha.toFixed(3) + '</td><td>' + m.rot.beta.toFixed(3) + '</td><td>' + m.rot.gamma.toFixed(3) + '</tr></table>';

    html += '<h3>rotMotion (alpha, beta, gamma)</h3>';
    html += '<table><tr><td>' + m.rotMotion.alpha.toFixed(3) + '</td><td>' + m.rotMotion.beta.toFixed(3) + '</td><td>' + m.rotMotion.gamma.toFixed(3) + '</tr></table>';

    html += '<h3>accelGrav (x,y,z)</h3>';
    html += '<table><tr><td>' + m.accelGrav.x.toFixed(3) + '</td><td>' + m.accelGrav.y.toFixed(3) + '</td><td>' + m.accelGrav.z.toFixed(3) + '</tr></table>';
    html += '</table>';
    document.getElementById('last').innerHTML = html;
  } catch (err) {
    setStatus(err, true);
  }
}
