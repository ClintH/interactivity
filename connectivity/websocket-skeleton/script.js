import { ReconnectingWebsocket } from "./ReconnectingWebsocket.js";
const ourId = Date.now().toString(36) + Math.random().toString(36).substr(2);

// By default it will try to connect to same server it is loaded from
// In some cases, you might need to put in a custom address.
const url = 'ws://' + location.host + '/ws';
const socket = new ReconnectingWebsocket(url);

// Received a message
socket.onmessage = (evt) => {
  // Print raw data
  //console.log(new Date().toLocaleTimeString() + '< ' + evt.data); // Show raw messages as received

  // Convert to an object (we're assuming it's JSON)
  try {
    const o = JSON.parse(evt.data);

    // Now we can use the fields
    // eg: if (o.x > 10) ... 

    // ...but we'll just print it out
    log(`x: ${o.x} y: ${o.y}`, '< ');

    // Eg: how to differentiate messages received from other clients
    if (o.fromId !== ourId) {
      log(' A message from a different instance! ' + o.fromId);
    }
  } catch (err) {
    console.error(err);
    console.error('Data: ', evt.data);
  }
};

document.body.addEventListener('pointermove', evt => {
  // Grab a few interesting fields from the event
  const e = {
    x: evt.clientX,
    y: evt.clientY
  };

  // Send it as an object
  sendObject(e);
});

function log(msg, prefix = '') {
  console.log(new Date().toLocaleTimeString() + prefix + msg);

}

// Send an object
function sendObject(o) {
  // Tack on an id for this running sketch
  o.fromId = ourId;

  // Create a string version of the object
  const str = JSON.stringify(o);
  log(str, '> ');
  socket.send(str);
}

