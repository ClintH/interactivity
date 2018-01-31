var socket = null;

if (document.readyState != 'loading') ready();
else document.addEventListener('DOMContentLoaded', ready);

function ready() {
  // Note the resource URL should match the config in app.js
  const url = 'ws://' + location.host + '/ws';
  socket = new ReconnectingWebsocket(url);

  // Connection has been established
  socket.onopen = function(evt) {
    console.log('Web socket opened: ' + url);
  };

  // Received a message
  socket.onmessage = function(evt) {
    // console.log(new Date().toLocaleTimeString() + '< ' + evt.data); // Show raw messages as received

    // To convert text back to an object (if it was sent with 'sendObject'):
    var o = JSON.parse(evt.data);
    console.log(o);

    if (o.text) handleText(o);
    if (o.attachments) {
      for (a of o.attachments) {
        if (a.type === 'image') handleImage(a);
      }
    }
    logReceived(o.text);
  };
}

function handleText(o) {
  var t = o.text.toLowerCase();
  if (t === 'on') {
    document.body.style.backgroundColor = 'white';
  } else if (t === 'off') {
    document.body.style.backgroundColor = 'black';
  }
}

function handleImage(o) {
  console.log(o.payload.url);
}

function logReceived(d) {
  document.getElementById('lastMsg').innerHTML =
    d + '<br />' + document.getElementById('lastMsg').innerHTML;
}
