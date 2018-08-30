var lastMsgEl = null;
if (document.readyState != 'loading') onDocumentReady();
else document.addEventListener('DOMContentLoaded', onDocumentReady);

function handleData(obj) {
  // At this point we could call functions based on received data etc.
  // eg: if (obj.x > 10) runThis()
}

function onDocumentReady() {
  var socket = new ReconnectingWebsocket('ws://' + location.host + '/serial');
  var sendFormEl = document.getElementById('sendForm');
  var lastMsg = null;
  lastMsgEl = document.getElementById('lastMsg');

  // Handle incoming messages
  socket.onmessage = function(evt) {
    var d = evt.data.trim();
    var obj = {};
    try {
      obj = JSON.parse(d);
    } catch (e) {
      if (d === lastMsg) return; // Don't repeat
      lastMsgEl.innerText = 'Couldn\'t parse, see console for details.';
      console.log(e);
      console.log('Received: ' + d);
      lastMsg = d;
      return;
    }

    // Pass parsed object over to a function to handle
    handleData(obj);

    // Display data for debug purposes
    if (d !== lastMsg) {
      // Don't update display if it's the same as before
      lastMsgEl.innerText = d;
    }
  };
  socket.onopen = function(evt) {
    console.log('Socket opened');
  };

  sendFormEl.addEventListener('submit', function(evt) {
    evt.preventDefault();
    var send = document.getElementById('sendtoSerial').value;
    socket.send(send);
  });
}
