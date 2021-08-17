import EnvelopeGenerator from './EnvelopeGenerator.mjs'
import SlidingWindow from './SlidingWindow.mjs';
const supportsPointerEvents =
  typeof document.defaultView.PointerEvent !== "undefined";
const supportsCoalescedEvents = supportsPointerEvents
  ? document.defaultView.PointerEvent.prototype.getCoalescedEvents
  : undefined;
const thingEl = document.getElementById('thing');
const trailsEl = document.getElementById('trails');
let lastMove = 0;

let env = new EnvelopeGenerator({
  attack: 100, attackLevel: 1.0,
  sustain: 300, sustainLevel: 0.5,
  decay: 200,
  release: 1000, releaseLevel: 0,
  looping: false
});


// Progress thru envelope with each call to calculate()
env.useCallPulse();

document.addEventListener('pointermove', (evt) => {
  // Reset envelope if pointer starts moving after a 500ms pause

  if (Date.now() - lastMove > 500) env.reset();


  // For performance reasons, pointermove doesn't fire for every little move.
  // The additional movements are available via getCoalescedEvents
  let events = supportsCoalescedEvents ? evt.getCoalescedEvents() : [{x: evt.clientX, y: evt.clientY}];

  for (let move of events) {
    // Get the next value from the envelope
    let v = env.calculate();

    // Move the red thing
    moveThing(move.x, evt.y);

    // Make a trail element, scaling size according to envelope
    pushTrail(move.x, move.y, v * 300);
  }

  lastMove = Date.now(); // Keep track of when last move happened
})

function pushTrail(x, y, size) {
  // Make sure size is at least 10px
  size = Math.max(10, size);

  // Insert a trail element
  let html = `<div class="trail" style="width:${size}px; height:${size}px; left:${x - size / 2}px; top:${y - size / 2}px"></div>`
  trailsEl.insertAdjacentHTML('afterbegin', html);

  // Delete last element if trail is over 100 elements
  if (trailsEl.children.length > 100) {
    trailsEl.lastElementChild.remove();
  }
}

// Move element by its center
function moveThing(x, y) {
  let bounds = thingEl.getBoundingClientRect();
  thingEl.style.left = x - bounds.width / 2 + 'px';
  thingEl.style.top = y - bounds.height / 2 + 'px';
}


