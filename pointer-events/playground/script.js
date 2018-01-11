function onDocumentReady() {
  let el = document.getElementById('target');

  el.addEventListener('pointerup', log);
  el.addEventListener('pointerdown', log);
  el.addEventListener('pointermove', log);
  el.addEventListener('pointerenter', log);
  el.addEventListener('pointerleave', log);
  el.addEventListener('pointerover', log);
}

function log(evt) {
  // Log raw event
  console.log(evt);
  
  // Grab some interesting properties to show
  let someProperties = [
    'pointerType', 'type', 'pointerId',
    'clientX', 'clientY', 'offsetX', 'offsetY',
     'pressure', 'screenX', 'screenY',
    'tangentialPressure', 'tiltX', 'tiltY', 'twist'
  ];

  // Copy proeprties
  let t = "<span>";
  someProperties.forEach(prop=> {
    t += prop + ": " + evt[prop] + "; "
  });
  t += "</span>";

  // Log
  let el = document.getElementById('log');
  el.innerHTML = t + "<br />" + el.innerHTML;
}

if (document.readyState != 'loading') onDocumentReady();
else document.addEventListener('DOMContentLoaded', onDocumentReady);
