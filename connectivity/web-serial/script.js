import { Serial } from "../Serial.mjs";

let lastMsgEl = document.getElementById('lastMsg');
const serial = new Serial();

document.getElementById('frmSend').addEventListener('submit', (e) => {
  e.preventDefault();
  // Convert input to an object to send
  // normally though you'd have the data as an object already
  try {
    const whatToSend = JSON.parse(document.getElementById('txtSend').value);
    serial.printObject(whatToSend);
  } catch (err) {
    console.error(err);
  }
});

serial.onjson = (d) => {
  // We could just do something with one of the properties
  // if (d.pressed) ...

  // In this case, we'll just dump everything we receive into a table
  lastMsgEl.innerHTML = getTableFromObject(d);
}

function getTableFromObject(d) {
  let msg = '<table>';
  let keys = Object.keys(d);
  for (let key of keys) {
    msg += '<tr><td>' + key + "</td><td>" + d[key] + "</td></tr>";
  }
  msg += '</table>';
  return msg;
}

document.getElementById('btnOpen').addEventListener('click', () => {
  serial.open();
});

document.getElementById('btnClose').addEventListener('click', () => {
  serial.close();
});

