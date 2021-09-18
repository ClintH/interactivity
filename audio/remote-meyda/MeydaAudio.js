
export default class MeydaAudio {
  
  constructor(options = {})  {
    if (!options.bufferSize) options.bufferSize = 512;
    if (!options.featureExtractors) options.featureExtractors = ['rms'];
    
    this.bufferSize = options.bufferSize;
    this.featureExtractors = options.featureExtractors;
    
    this.onData = this.defaultHandler.bind(this);
    this.paused = false;
    this.init();
  }
  
  setFeatures(feats) {
    if (!feats) throw Error('feats null or undefined');
    if (!Array.isArray(feats)) throw Error('feats should be an array');
    if (feats.length == 0) throw Error('feats array empty');
    
    this.featureExtractors = feats;
    console.log('Setting features: ' + JSON.stringify(feats));
    this.analyser.featureExtractors = feats;
    this.analyser.stop();
    this.analyser.start(this.featureExtractors);
  }
  
  init() {
    // Initalise microphone
    const getUserMedia = () => { return navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.mzGetUserMedia
}

    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      this.onMicSuccess(stream);
    })
    .catch (err => {
      console.error(err);      
    }) 
  }
  
  setup(audioCtx, stream) {
    console.log('Meyda remote analyser setup');
    const micSource = audioCtx.createMediaStreamSource(stream);
    
    // Note: spectralFlux seems buggy 
    const analyser = Meyda.createMeydaAnalyzer({
      audioContext: audioCtx,
      source: micSource,
      bufferSize: this.bufferSize,
      featureExtractors: this.featureExtractors,
      callback: (features) => this.onData(features),
    });
    analyser.start();
    return analyser;
  }
  
  loop(analyser) {
    const a = this.analyser;
   let result = { };
    
    return result;
  }
  
  defaultHandler(d) {
    // noop
  }
  
  setPaused(v) {
    if (v == this.paused) return;
    this.paused = v;
    if (!v) {
      console.log('Unpaused');
      this.analyser.start(this.featureExtractors);
    } else {
      this.analyser.stop();
    }
  }
   
  // Microphone successfully initalised, now have access to audio data
  onMicSuccess(stream) {
    const audioCtx = new AudioContext();

    audioCtx.addEventListener('statechange', () => {
      console.log('Audio context state: ' + audioCtx.state);
    });

    this.audioCtx = audioCtx;
    this.analyser = this.setup(audioCtx, stream);
    
  }
}