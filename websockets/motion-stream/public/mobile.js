var socket = null;
var freeze = false;
var lastData = {};

if (document.readyState != 'loading') ready();
else document.addEventListener('DOMContentLoaded', ready);

function ready() {
  try {
    document.addEventListener('error', logError);
    document.addEventListener('click', e=> { 
      freeze = !freeze;
      document.getElementById('last').classList.toggle('frozen');
    });

    const url = 'ws://' + location.host + '/ws';
    socket = new ReconnectingWebsocket(url);

    // Connection has been established
    socket.onopen = function(evt) {
      log('Web socket opened: ' + url);
    };

    // Listen for events
    window.addEventListener('devicemotion', onDeviceMotion);
    window.addEventListener('deviceorientation', onDeviceOrientation);

    // Periodically send data via websocket
    window.requestAnimationFrame(processData);
  } catch (err) {
    logError(err);
  }
}


// Sends accumulated data via websocket
function processData() {
  try {
    socket.send(JSON.stringify(lastData));
    
    if (!freeze) showData(lastData);
  } catch (err) {
    logError(err);
  }
  
  // Request function to run again when browser has a moment
  window.requestAnimationFrame(processData);
}

function showData(m) {
  try {
    let html = 'accel';
    html += '<table><tr><td>' + m.accel.x.toFixed(3) + '</td><td>' + m.accel.y.toFixed(3) + '</td><td>' + m.accel.z.toFixed(3) + '</tr></table>';
    html += '</table>';

    html += 'rot';
    html += '<table><tr><td>' + m.rot.alpha.toFixed(3) + '</td><td>' + m.rot.beta.toFixed(3) + '</td><td>' + m.rot.gamma.toFixed(3) + '</tr></table>';

    html += 'rotMotion';
    html += '<table><tr><td>' + m.rotMotion.alpha.toFixed(3) + '</td><td>' + m.rotMotion.beta.toFixed(3) + '</td><td>' + m.rotMotion.gamma.toFixed(3) + '</tr></table>';

    html += 'accelGrav';
    html += '<table><tr><td>' + m.accelGrav.x.toFixed(3) + '</td><td>' + m.accelGrav.y.toFixed(3) + '</td><td>' + m.accelGrav.z.toFixed(3) + '</tr></table>';
    html += '</table>';
    document.getElementById('last').innerHTML = html;
  } catch (err) {
    logError(err);
  }
}

function onDeviceOrientation(orient) {
  // Extract properties we are interested in
  try {
    lastData.rot = {
      alpha: orient.alpha,
      beta: orient.beta,
      gamma: orient.gamma
    }
  } catch (err) { logError(err); }
}

function onDeviceMotion(motion) {
  // Extract properties from the event we are interested in
  try {
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
  } catch (err) { logError(err); }
}

function log(e) {
  const el = document.getElementById('log');
  el.insertAdjacentHTML('afterbegin', '<div class="info">' + e + '</div>');
}

function logError(e) {
  const el = document.getElementById('log');
  el.insertAdjacentHTML('afterbegin', '<div class="error">' + e + '</div>');
}