const CMD_WRITE = 0;
const CMD_WRITE_US = 1;
const CMD_READ = 2;
const CMD_DETACH = 3;

let socket = null;

// Set up event handlers and websocket
init();


function onPointerMove(evt) {
  console.dir(evt);
  // var speed = document.getElementById('inputContinuousSpeed').value;
  // var duration = document.getElementById('inputContinuousDuration').value;

  // setStatus(`Rotating at speed: ${speed}, duration: ${duration}`);
  // write(0, speed, duration);
  let x = evt.offsetX;
  let y = evt.offsetY;

  // Get 0..1
  let relativeX = x / evt.target.offsetWidth;
  let relativeY = y / evt.target.offsetHeight;

  if (relativeX < 0) relativeX = 0;
  if (relativeX > 1) relativeX = 1;
  write(0, 180 * relativeX, 0);
}

function onPointerLeave(evt) {
  detach(0);
}

// --- Servo control
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
// ---- End Servo control

function writeMicroseconds(servo, us) {
  if (us < 0) throw new Error('Must be greater than zero');

  console.log('Write uS: ' + us);
  socket.send(JSON.stringify({
    cmd: CMD_WRITE_US,
    servo: servo,
    pos: us
  }));
}


function init() {
  // Emergency stop
  document.body.addEventListener('click', () => {
    detach(0);
  });

  document.getElementById('thing').addEventListener('pointermove', onPointerMove);
  document.getElementById('thing').addEventListener('pointerleave', onPointerLeave);

  socket = new ReconnectingWebsocket('ws://' + location.host + '/serial');
  socket.addEventListener('message', evt => {
    console.log(evt.data);
  });

  socket.addEventListener('open', () => {
    console.log('Connected to json-serial-bridge 👍');
    detach(0);
  });
}

