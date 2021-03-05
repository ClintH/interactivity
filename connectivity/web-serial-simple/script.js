import { Serial } from "./Serial.js";

let lastMsgEl = document.getElementById('lastMsg');

document.getElementById('frmSend').addEventListener('submit', (e) => {
  e.preventDefault();
  const whatToSend = document.getElementById('txtSend').value;
  serial.println(whatToSend);
});

const serial = new Serial();
serial.ondata = (d) => {
  if (d.startsWith('echo')) console.log(d);
  lastMsgEl.innerText = d;
}

document.getElementById('btnOpen').addEventListener('click', () => {
  serial.open();
});

document.getElementById('btnClose').addEventListener('click', () => {
  serial.close();
});

