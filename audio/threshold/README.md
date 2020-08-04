# audio threshold

This sketch shows three different techniques to respond to a threshold level.

You'll see three labelled boxes which activate when their corresponding threshold is reached. Hit the 'Reset' button to remove the activation.

Frequency threshold: this responds only to sound in the bass region (0-80Hz)

Peak threshold: this responds only to very loud noises. Since it is a peak detection, it can respond to short pulses

Sustained threshold: this responds to a much lower level of sound than the peak detector, but the level must be sustained across the sample snapshot.

The sketch demonstrates:
* iterating over data,
* averaging data, and
* selecting data for a given frequency range.

# Things to try

Tip: uncomment those console.log lines to see the computed data

* Adjust the frequency threshold detection to a new range, eg for high-pitched whistling. Enable the visualiser or jump to the playground sketch to find the range
* Play with different levels for peak/sustain. Can they be used to differentiate between your phone's notification beep, versus your phone ringing?
* What about if these detection functions are combined? For example a mid-range sound which is also sustained?
* How does changing the FFT size and smoothing change the response?
