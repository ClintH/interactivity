const dot = document.getElementById('dot');
const path = document.getElementById('path');
const domElem = document.getElementById('domElem');
const svgBox = path.parentElement.getBoundingClientRect();

let dotAnim = {
  progress: 0,
  last: Date.now(),
  // Percentage to move per millisecond (0.01 = 0.01%)
  movementPercentPerMs: 0.01 / 100,
  tick: function () {
    placeSvg(dot, this.progress, path);
  }
}

let buttonAnim = {
  progress: 0,
  last: Date.now(),
  movementPercentPerMs: 0.03 / 100,
  tick: function () {
    placeElement(domElem, this.progress, path);
  }
}

/**
 * Calcs coordinates for a relative point along a path
 *
 * @param {number} amount Progression (0.0-1.0)
 * @param {SVGPathElement} path Path to place object on
 */
function calculatePoint(amount, path) {
  if (amount < 0) amount = 0;
  else if (amount > 1) amount = 1;
  const length = path.getTotalLength();
  const point = path.getPointAtLength(amount * length);
  return point;
}

/**
 * Places an SVG element along a path
 *
 * @param {number} amount Progression (0.0-1.0)
 * @param {SVGElement} obj Object to place
 * @param {SVGPathElement} path Path to place object on
 */
function placeSvg(obj, amount, path) {
  const point = calculatePoint(amount, path);
  obj.setAttribute('transform', `translate(${point.x}, ${point.y})`);
}

/**
 * Places any DOM element along a path
 *
 * @param {number} amount Progression (0.0-1.0)
 * @param {HTMLElement} elem Element to place
 * @param {SVGPathElement} path Path to place object on
 */
function placeElement(elem, amount, path) {
  const point = calculatePoint(amount, path);

  // Coordinates to position element are page coordinates,
  // so we need to add SVG element's position as an offset
  point.y += svgBox.top;
  point.x == svgBox.left;
  elem.style.left = point.x + 'px';
  elem.style.top = point.y + 'px';
}

function loop() {
  // Update the animations
  update(dotAnim);
  update(buttonAnim);

  // Schedule function to be called again (forever)
  requestAnimationFrame(loop);
}

function update(anim) {
  // How much time elapsed since last loop?
  const elapsed = Date.now() - anim.last;

  // Move according to elapsed time
  anim.progress += elapsed * anim.movementPercentPerMs;

  // Let animation know it's updated
  anim.tick();

  if (anim.progress >= 1) anim.progress = 0;
  anim.last = Date.now();
}


loop();


