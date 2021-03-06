import { ReconnectingWebsocket } from "./ReconnectingWebsocket.js";
hljs.highlightAll(); // Syntax highlighting

const mainStatus = document.getElementById('mainStatus');
const txtJson = document.getElementById('txtJson');
const jsonStatus = document.getElementById('jsonStatus');
const msgLog = document.getElementById('msgLog');
const url = (location.protocol === 'http:' ? 'ws://' : 'wss://') + location.host + '/ws';
const socket = new ReconnectingWebsocket(url);

function showError(msg, el) {
  if (!msg) {
    showMessage(null, el);
  } else {
    el.innerText = msg;
    el.classList.add('error');
    el.classList.remove('hidden');
  }
}

function showMessage(msg, el) {
  if (!msg) {
    el.innerText = '';
    el.classList.add('hidden');
  } else {
    el.innerText = msg;
    el.classList.remove('hidden');
  }
  el.classList.remove('error');
}

// Connection has been established
socket.onopen = (evt) => {
  showMessage('Opened: ' + url, mainStatus);
};

socket.onclose = (evt) => {
  showMessage('Connection closed.', mainStatus);
}

socket.onerror = (evt) => {
  showError(evt, mainStatus);
}

// Received a message
socket.onmessage = (evt) => {
  const data = evt.data;
  try {
    const o = JSON.parse(data);

    const ePre = document.createElement('pre');
    const eCode = document.createElement('code');
    eCode.className = 'json';
    eCode.innerText = JSON.stringify(o);
    ePre.append(eCode);
    msgLog.prepend(ePre);
    hljs.highlightBlock(ePre);
  } catch (e) {
    const ePre = document.createElement('Pre');
    ePre.innerText = data;
    msgLog.prepend(ePre);
  }
};

let highlightTimeout = 0;
function highlightTxtJson() {
  hljs.highlightBlock(txtJson);
  highlightTimeout = 0;
}


txtJson.addEventListener('input', (e) => {
  try {
    let o = JSON.parse(e.target.innerText);
    showError(null, jsonStatus);
  } catch (e) {
    showError(e, jsonStatus);
  }
  if (highlightTxtJson) clearTimeout(highlightTimeout);
  highlightTimeout = setTimeout(highlightTxtJson, 5000);
});

document.getElementById('btnSendText').addEventListener('click', (evt) => {
  var text = document.getElementById('txtRaw').value;
  send(text);
});

document.getElementById('btnClear').addEventListener('click', (e) => {
  msgLog.innerHTML = '';
});

document.getElementById('btnSendJson').addEventListener('click', (evt) => {
  try {
    const o = JSON.parse(txtJson.innerText);
    send(JSON.stringify(o));
  } catch (err) {
    showError(err, jsonStatus);
  }
});

function send(str) {
  const msg = new Date().toLocaleTimeString() + '> ' + str;
  console.log(msg);
  try {
    socket.send(str);
    showMessage(msg, mainStatus);
  } catch (err) {
    showError(err, mainStatus);
  }
}

