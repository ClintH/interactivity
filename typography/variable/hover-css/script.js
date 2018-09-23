function onDocumentReady() {
  setInterval(updateClock, 1000);
}

function updateClock() {
  const now = new Date();
  document.getElementById('hour').innerText = now
    .getHours()
    .toString()
    .padStart(2, '0');
  document.getElementById('minute').innerText = now
    .getMinutes()
    .toString()
    .padStart(2, '0');
  document.getElementById('second').innerText = now
    .getSeconds()
    .toString()
    .padStart(2, '0');
}

if (document.readyState != 'loading') {
  onDocumentReady();
} else {
  document.addEventListener('DOMContentLoaded', onDocumentReady);
}
