var players = []; // Keep track of infinite animations

function onDocumentReady() {
  document
    .getElementById('buttonSkld')
    .addEventListener('click', onAnimateSkld);
  document.getElementById('buttonBldb').addEventListener('click', onSetBldb);
}

function onSetBldb() {
  // Axis
  // BLDB: Worm (0..1000)

  let el = document.getElementById('pangram');
  el.style.fontVariationSettings = '\'BLDB\' 1000';

  // We need to cancel any existing animations
  // since they will override the style
  cancelAnimation();
}

// Cancels all infinite animations
function cancelAnimation() {
  players.forEach(p => {
    p.cancel();
  });
  players = [];
}

function onAnimateSkld() {
  // Axis
  // SKLD: Stripes (0..1000)

  // Two keyframes: beginning and end
  const keyframes = [
    // Start at 0 for SKLD
    { fontVariationSettings: '\'SKLD\' 0' },

    // End at 1000 for SKLD
    { fontVariationSettings: '\'SKLD\' 800' }
  ];

  const options = {
    delay: 100,
    // fill forwards keeps the property to be the same
    // as last keyframe
    fill: 'forwards',
    duration: 700,
    easing: 'ease-in-out'
  };

  let el = document.getElementById('pangram');

  // Animate!
  let player = el.animate(keyframes, options);

  // Keep track of animation since it runs forever
  players.push(player);
}

if (document.readyState != 'loading') {
  onDocumentReady();
} else {
  document.addEventListener('DOMContentLoaded', onDocumentReady);
}
