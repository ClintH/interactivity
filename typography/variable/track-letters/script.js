function onDocumentReady() {
  // This will break up the element's text
  // into a bunch of elements for each character.
  charming(document.getElementById('pangrams'), { classPrefix: false });

  document.addEventListener('pointermove', onPointerMove);
}

function onPointerMove(e) {
  var letters = document.getElementById('pangrams').childNodes;
  // Find out maximum possible distance (dimensions of body)
  var maxDistance = Math.max(
    document.body.clientWidth,
    document.body.clientHeight
  );

  // Half it, so the spotlight effect is greater
  maxDistance /= 2;

  letters.forEach(letter => {
    // Get letter bounds
    var bounds = letter.getBoundingClientRect();

    // Calculate distance from letter to cursor,
    // and divide by maxDistance to get a relative value
    var relativeDistance = distance(bounds, e.clientX, e.clientY) / maxDistance;

    // Clamp to 0..1
    relativeDistance = clamp(relativeDistance);

    letter.style.fontVariationSettings =
      '\'wght\' ' + parseInt(1000 * (1 - relativeDistance));

    letter.style.transform =
      'translateZ(' + 100 * (1.0 - relativeDistance / 2) + 'px)';
    //letter.style.opacity = 1.0 - relativeDistance / 2;
  });
}

// Returns a value clamped to between 0 and 1
function clamp(x) {
  x = Math.max(0, x);
  x = Math.min(1, x);
  return x;
}

function distance(bounds, x, y) {
  const a = bounds.left - x;
  const b = bounds.top - y;
  return Math.hypot(a, b);
}

if (document.readyState != 'loading') {
  onDocumentReady();
} else {
  document.addEventListener('DOMContentLoaded', onDocumentReady);
}
