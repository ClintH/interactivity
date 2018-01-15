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
    console.log(new Date().toLocaleTimeString() + '< ' + evt.data); // Show raw messages as received
    logReceived(evt.data);

    // To convert text back to an object (if it was sent with 'sendObject'):
    //var o = JSON.parse(evt.data);
    //console.log(o);
  };

  // Demo sending a message
  document.getElementById('sendForm').addEventListener('submit', function(evt) {
    evt.preventDefault();
    var text = document.getElementById('sendThis').value;
    
    // This is where we actually send something
    send(text);
  });

  document.getElementById('sendObject').addEventListener('mousemove', evt => {
    // Grab a few interesting fields from the event
    var e = {
      x: evt.clientX,
      y: evt.clientY
    };

    sendObject(e);
  });
}

function sendObject(o) {
  // Create a string version of the object
  send(JSON.stringify(o));
}

function send(str) {
  console.log(new Date().toLocaleTimeString() +  '> ' + str);
  socket.send(str);
}

function logReceived(d) {
  document.getElementById('lastMsg').innerHTML = d + '<br />' + document.getElementById('lastMsg').innerHTML;
}
