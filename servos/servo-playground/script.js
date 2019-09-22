const CMD_WRITE = 0;
const CMD_WRITE_US = 1;
const CMD_READ = 2;
const CMD_DETACH = 3;

let socket = null;

// Set up event handlers and websocket
init();

// Sends command to bridge (which forwards to Arduino)
function write(servo, position, durationMs) {
  if (position < 0) throw new Error('Must be greater than zero');
  if (position > 180) throw new Error('Must be equal or less than 180');

  console.log('Write ' + servo + ' = ' + position);
  socket.send(JSON.stringify({
    cmd: CMD_WRITE,
    servo: servo,
    opt: durationMs,
    pos: position
  }));
}

function detach(servo) {
  console.log('Detach ' + servo);
  socket.send(JSON.stringify({
    cmd: CMD_DETACH,
    servo: servo,
    pos: 0
  }));
}

function writeMicroseconds(servo, us) {
  if (us < 0) throw new Error('Must be greater than zero');

  console.log('Write uS: ' + us);
  socket.send(JSON.stringify({
    cmd: CMD_WRITE_US,
    servo: servo,
    pos: us
  }));
}


function onPositionUpdate(d) {
  // Arduino spits back the position we give it
  // Could be useful for making sure it is responding
  // console.log(d);

}

function init() {
  // Continuous rotation
  document.getElementById('btnRotate').addEventListener('click', () => {
    var speed = document.getElementById('inputContinuousSpeed').value;
    var duration = document.getElementById('inputContinuousDuration').value;

    setStatus(`Rotating at speed: ${speed}, duration: ${duration}`);
    write(0, speed, duration);
  });

  document.getElementById('btnRotationStop').addEventListener('click', () => {
    setStatus('Stopping rotation');
    write(0, 90, 0);
    detach(0);
  });

  // Single rotation
  document.getElementById('btnMove').addEventListener('click', () => {
    var pos = document.getElementById('inputPosition').value;
    setStatus(`Moving to ${pos}`);
    write(1, pos, 0);
  });

  document.getElementById('btnSingleStop').addEventListener('click', () => {
    setStatus('Stopping');
    detach(1);
  });

  socket = new ReconnectingWebsocket('ws://' + location.host + '/serial');
  socket.addEventListener('message', evt => {
    // Debug: see raw received message
    //console.log(evt.data);

    let d = null;
    try {
      d = JSON.parse(evt.data);

      switch (d.cmd) {
        case CMD_READ:
          onPositionUpdate(d);
          break;
      }
    } catch (e) {
      setStatus(evt.data);
    }
  });

  socket.addEventListener('open', () => console.log('Connected to json-serial-bridge 👍'));
}

function setStatus(msg) {
  document.getElementById('msg').innerText = msg;
}
