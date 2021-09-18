# remote

This general-purpose remote sends frequency distribution data and waveform data without processing.

If you just want to consume processed audio, you probably don't need to modify this sketch at all, just run it in a browser. Instead you'll make a copy of the `client` sketch and work there.

`Audio.js` is where the audio processing happens. It can be a simple starting point for your own signal processing.

`script.js` is what boots up an instance of `Audio` (ie. `Audio.js`) and wires up the simple UI for controlling `Audio`. Note that in some times you need to match FFT sizes used in your client code.

By default `Audio` computes frequency distribution and grabs a snapshot of the audio waveform. Disabling either of these can lower computation and data requirements -- ie lower the latency of processing. To disable, see the comment in `script.js`

