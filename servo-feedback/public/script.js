var msgEl, servoEl, socket = null;
var lastPos = 0;

const MsgError = 1;
const MsgMove = 2;
const MsgMoveResult = 3;
const MsgPosition = 4;

const stepSize = 10; // How much +/- buttons move by

if (document.readyState != 'loading') onDocumentReady();
else document.addEventListener('DOMContentLoaded', onDocumentReady);


function handleCommand(d) {
   switch (d.integer) {
    case MsgPosition: 
        onPositionUpdate(d);
        break;
   }
}

// Received the position of the servo
function onPositionUpdate(d) {
    // We expect numbers between 0-180, but sometimes this can be a bit
    // screwy due to calibration errors. Therefore, first sanitise
    var pos = d.float;
    setStatus(`Position: ${pos}`);
    
    if (pos < 0) pos = 0;
    if (pos > 180) pos = 180;
    lastPos = pos; // Keep track of position

    // Expand 0..180 to 0..360
    pos = pos * 2;
    servoEl.style.transform = 'rotate(' + pos + 'deg)';
}

function setStatus(msg) {
    msgEl.innerText = msg;
}

function onDocumentReady() {
    socket = new ReconnectingWebsocket("ws://" + location.host + "/serial");
    servoEl = document.getElementById('servo');
    msgEl = document.getElementById('msg');

    socket.onmessage = function(evt) {
        // Debug: see raw received message
        //console.log(evt.data);
        
        // Parse message, assuming <Text,Int,Float>
        var d = evt.data.trim();
        if (d.charAt(0) == '<' && d.charAt(d.length-1) == '>') {
            // Looks legit
            d = d.split(',');    
            if (d.length == 3) { // Yes, it has three components as we hoped
                handleCommand({
                    text:d[0].substr(1), 
                    integer: parseInt(d[1]), 
                    float: parseFloat(d[2].substr(0,d.length-1))
                });
                return;          
            }
        }
        
        // Doesn't seem to be formatted correctly, just display as-is
        if (evt.data != lastMsg) {
            lastMsgEl.innerText =  evt.data;
            lastMsg = evt.data;
        }
    }
    socket.onopen = function(evt) {
        console.log("Socket opened");
    }

    // Every 1s, ask the Arduino where the servo is
    setInterval(function(e) {
        send(MsgPosition, 0);
    }, 1000);



    document.getElementById('posBtn').addEventListener('click', function(e) {
        var newPos = lastPos + stepSize;
        if (newPos > 180) newPos = 180;
        setStatus(`Moving to ${newPos}`);
        send(MsgMove, newPos);
    });

    document.getElementById('negBtn').addEventListener('click', function(e) {
        var newPos = lastPos - stepSize;
        if (newPos < 0) newPos = 0;
        setStatus(`Moving to ${newPos}`);
        send(MsgMove, newPos);    
    });
            
}

function send(intValue, floatValue) {
    socket.send('<servo,' + intValue + ',' + floatValue  + '>\r\n');
}