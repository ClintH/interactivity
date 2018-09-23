var counter = 0;

function onDocumentReady() {
  // Get element to break up
  const el = document.getElementById('pangram');

  // This will break up the element's text
  // into a bunch of elements for each character.
  charming(el, { classPrefix: false });

  // Schedule the 'update' function to be called
  window.requestAnimationFrame(update);
}

function update() {
  const el = document.getElementById('pangram');

  const length = el.childNodes.length;
  const opacityPerLetter = 1.0 / length;
  const cycle = Math.sin(counter) / 2 + 0.5;

  // Iterate over the childNodes
  el.childNodes.forEach((letter, index) => {
    var opacity = opacityPerLetter * index;
    opacity = opacity + cycle;
    if (opacity > 1) opacity = opacity - 1.0;

    letter.style.opacity = opacity;
  });

  counter += (Math.PI * 2) / 200;

  // Schedule 'update' to be called again
  // (ie repeat forever)
  window.requestAnimationFrame(update);
}

if (document.readyState != 'loading') {
  onDocumentReady();
} else {
  document.addEventListener('DOMContentLoaded', onDocumentReady);
}
