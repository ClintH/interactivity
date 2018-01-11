function onDocumentReady() {
  let el = document.getElementById('target');

  // Chroma, the library we're using makes it super easy to map
  // a percentage to a colour scale
  let scale = chroma.scale(['yellow', 'red', 'black']);

  // Listen for pressure changes on the element with id 'target',
  // Pressurejs has more events than 'change', see dosc for more
  Pressure.set('#target', {
    change: function(force) {
      // Use the scale object to generate a colour based on 0..1.0
      el.style.backgroundColor = scale(force);
      el.innerHTML = force;
    }
  });
}


if (document.readyState != 'loading') onDocumentReady();
else document.addEventListener('DOMContentLoaded', onDocumentReady);
