# audio beats

This sketch demonstrates some primitive transient detection, ie. for calculating tempo or period of a pulse. A helper class `IntervalMeter` is used from `util.js`.

At the moment it's tuned to work with a metronome pulse source. You will likely need to adjust the code to make it detect your pulse sound. You could try tweaking the filters and the 'magicBin' - the particular frequency bin that corresponds to your pulse sound.

The 'Peak threshold' box will light up when a pulse is detected. When it's working it should blink in time with the pulse.

Tempo is calculated by the average time between a series of pulses. If more pulses are measured, the calculation will be less prone to jitter, but reacts slowly to changes in tempo. This is set at the top of the source file.

Since the computer captures sound at a high rate, a single pulse sound is represented in several samples. This is further magnified by resonance and reverberation. When calculating tempo, we must only count the _transient_ or _attack_ of the sound (ie the beginning). We don't want to count the same pulse as multiple pulses. To do this, `IntervalMeter` can be told the expected length of the pulse, allowing it to ignore repeated detections that happen too soon. Depending on your pulse source this might need to be adjusted. If there are too many repeat detections, you could try increasing it.

In the audio setup part, a low and high pass filter is added but not used. This might be useful to cut out unnecessary parts of the audio spectrum. Eg to focus on high-pitched pulses and ignore the bassier sounds of people walking around.

The sketch uses the `IntervalMeter` helper class.

# Map

script.js/index.html: receives and works with processed data
* Toggles class when a pulse is detected
* Set a relative scale based on pulse interval, with 300ms = 100%. This is applied to the page hue
* For test purposes, print out the current interval & bpm into the HTML

Beat.js: does basis analysis of data
* Setup audio graph with filters in case they are needed
* Uses `IntervalMeter` to track pulses.
* In the results, sets `pulsed` to true when a pulse is detected, along with `intervalMs` and `bpm`. These can be a bit whacky when pulses aren't detected properly.

remote.html/remote.js: interface for sender, sets up Beat.js

# Things to try

* Tune the code to your own pulse source. Try downloading a metronome app on your phone and use that. This is a useful exercise to figure out the tuning because you know exactly what the tempo should be.
* Can you extend the code to track two separate tempos? Eg a high and low pitch
* Can you uses changes in tempo over time? Eg rather than working with the current tempo, maybe it's significant that the tempo is 50% faster than what it was over the last minute.

# Read more

* [Filters](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode)
