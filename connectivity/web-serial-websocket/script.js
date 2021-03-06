import { Serial } from "./Serial.js";
import { ReconnectingWebsocket } from "./ReconnectingWebsocket.js";
const ourId = Date.now().toString(36) + Math.random().toString(36).substr(2);
const url = (location.protocol === 'http:' ? 'ws://' : 'wss://') + location.host + '/ws';
const socket = new ReconnectingWebsocket(url);
const serial = new Serial();
let lastSerialMsg = '';

// ---------------
// Websocket

// Received a message via websocket
socket.onmessage = (evt) => {
  try {
    // Convert to an object (we're assuming it's JSON)
    const o = JSON.parse(evt.data);

    // Dump it to the console
    console.log(JSON.stringify(o));

    // Maybe you also want to forward websocket messages to the microcontroller?
    // Make sure your microcontroller's code is setup to handle the data you're sending
    // See the web-serial-json README
    // if (o.fromId !== ourId) {
    //  Don't just forward 'o', but pluck out the exact fields we know the MCU is prepared for:
    //  const toSerial = { x: o.x, y: o.y}
    //  serial.printObject(toSerial);
    // }

  } catch (err) {
    console.error(err);
    console.error('Data: ', evt.data);
  }
};

// ---------------
// Serial

// Received a message via serial
serial.onjson = (d) => {
  // Add our id to message
  d.fromId = ourId;

  // Convert obj to string
  const str = JSON.stringify(d);

  // Don't rebroadcast if it was the last thing sent
  if (str === lastSerialMsg) return;
  lastSerialMsg = str;

  // Send out via websockets
  socket.send(lastSerialMsg);
}

document.getElementById('btnOpen').addEventListener('click', () => {
  serial.open();
});

document.getElementById('btnClose').addEventListener('click', () => {
  serial.close();
});

