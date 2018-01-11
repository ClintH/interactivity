function onDocumentReady() {
  let el = document.body;

  el.addEventListener('pointerup', onPointerUp);
  el.addEventListener('pointerdown', onPointerDown);
  el.addEventListener('pointermove', onPointerMove);
  el.addEventListener('pointerleave', onPointerLeave);
}


function onPointerUp(evt) {
  let el = getOrCreate(evt);
  el.classList.remove("down");
}

function onPointerDown(evt) {
  let el = getOrCreate(evt);
  el.classList.add("down");
}

function onPointerLeave(evt) {
  let el = getOrCreate(evt);
  document.body.removeChild(el);
}

function onPointerMove(evt) {
  let el = getOrCreate(evt);

  // Position the element from its middle
  let rect = el.getBoundingClientRect();
  el.style.left = (evt.clientX-rect.width/2) + "px";
  el.style.top = (evt.clientY-rect.height/2) + "px";
}

// Returns an existing element for a pointer id, or makes a new one
function getOrCreate(evt) {
  const id = 'pointer-' + evt.pointerId;
  let el = document.getElementById(id);
  if (el) return el;
  el = document.createElement('div');
  el.classList.add('pointer');
  el.id = id;
  document.body.appendChild(el);
  return el;
}

if (document.readyState != 'loading') onDocumentReady();
else document.addEventListener('DOMContentLoaded', onDocumentReady);
