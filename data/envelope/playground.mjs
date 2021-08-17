import EnvelopeGenerator from './EnvelopeGenerator.mjs'
let env = new EnvelopeGenerator({
  attack: 1000, attackLevel: 1.0,
  sustain: 2500, sustainLevel: 0.5,
  decay: 0,
  release: 2500, releaseLevel: 0,
  looping: true
});
let draw = null;
let polyline = null;
let envValueVis = document.getElementById('envValueVis');
let envValue = document.getElementById('envValue');
let envStage = document.getElementById('envStage');

const setSlider = function (id, v) {
  if (id.endsWith('Amp')) v *= 100;
  document.getElementById(id).value = v;
}

const setSliders = function (idBase, v) {
  if (idBase !== 'decay')
    setSlider(idBase + 'Amp', v[1]);
  setSlider(idBase + 'Period', v[0]);

}

const setup = function () {
  draw = SVG().addTo('#envelope').size('100%', '100%');
  polyline = createLine();

  // Sync UI to start settings
  setSliders('attack', env.get(EnvelopeGenerator.Stages.Attack));
  setSliders('decay', env.get(EnvelopeGenerator.Stages.Decay));
  setSliders('sustain', env.get(EnvelopeGenerator.Stages.Sustain));
  setSliders('release', env.get(EnvelopeGenerator.Stages.Release));
  document.getElementById('looping').checked = env.looping;

  // Redraw line on window resize
  window.addEventListener('resize', () => {
    updateLine(polyline);
  })
  document.getElementById('btnDump').addEventListener('click', () => {
    dumpEnv(env);
  });
  document.getElementById('btnTrigger').addEventListener('click', () => {
    env.reset();
  });

  // Listen for changes in widgets, update envelope and drawing
  document.getElementById('looping').addEventListener('input', (evt) => {
    env.looping = evt.target.checked;
  });
  document.getElementById('attackSliders').addEventListener('input', () => {
    env.set(EnvelopeGenerator.Stages.Attack, getRange('attackAmp'), getRange('attackPeriod'));
    updateLine(polyline);
  });
  document.getElementById('decaySliders').addEventListener('input', () => {
    env.set(EnvelopeGenerator.Stages.Decay, 0, getRange('decayPeriod'));
    updateLine(polyline);
  });
  document.getElementById('sustainSliders').addEventListener('input', () => {
    env.set(EnvelopeGenerator.Stages.Sustain, getRange('sustainAmp'), getRange('sustainPeriod'));
    updateLine(polyline);
  });
  document.getElementById('releaseSliders').addEventListener('input', () => {
    env.set(EnvelopeGenerator.Stages.Release, getRange('releaseAmp'), getRange('releasePeriod'));
    updateLine(polyline);
  });

  window.requestAnimationFrame(envStatus);
}

const envStatus = function () {
  const v = env.calculate();
  envValue.innerText = v;
  envStage.innerText = env.getStage();
  envValueVis.style.backgroundColor = `rgba(0,0,0,${v})`;
  window.requestAnimationFrame(envStatus);
}

const getRange = function (id) {
  let v = parseInt(document.getElementById(id).value);
  if (id.endsWith('Amp')) v /= 100;
  return v;
}

const updateLine = function (l) {
  const bounds = document.getElementById('envelope').getBoundingClientRect();
  const padding = 5;
  const xScale = (bounds.width - (padding * 2)) / env.getTotalPeriod();
  const yScale = (bounds.height - (padding * 2)) / 1.0;// env.getMaxLevel();
  let culmX = 0;
  const scale = ([unit, amp]) => {
    const result = [
      (unit * xScale) + culmX,
      bounds.height - padding - (amp * yScale)
    ];
    culmX = result[0];
    return result;
  };
  l.plot([
    [padding, bounds.height - padding],
    scale(env.get(EnvelopeGenerator.Stages.Attack)),
    scale(env.get(EnvelopeGenerator.Stages.Decay)),
    scale(env.get(EnvelopeGenerator.Stages.Sustain)),
    scale(env.get(EnvelopeGenerator.Stages.Release))
  ]);
}

const dumpEnv = function (env) {
  let helper = {
    attack: env.periods[0],
    attackLevel: env.levels[0],
    decay: env.periods[1],
    sustain: env.periods[2],
    sustainLevel: env.levels[2],
    release: env.periods[3],
    releaseLevel: env.levels[3],
    looping: env.looping
  }
  console.log(helper);
}
const createLine = function () {
  // Create a line with number of segments we need
  const l = draw.polyline([
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0]
  ]);
  l.fill('none');
  l.stroke({color: '#f06', width: 4, linecap: 'round', linejoin: 'round'});
  return l;
}

setup();
updateLine(polyline);