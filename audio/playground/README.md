# audio-playground

This sketch shows the frequency distribution of live audio as well as amplitude over time (ie the waveform).

The code is not meant to be extended - it's meant to be a way of poking and probing the data. Please see the other sketches which are designed for building on top of.

## Visualisation: Frequency


The rainbow-coloured visualisation is the distribution of sound frequencies over a short period of time.

The x-axis is frequency. Lower frequencies are on the left (red) and higher frequencies on the right (pink). Each bar is one of the 'buckets' the spectrum is divided into. The number of buckets is determined by the FFT size.

The y-axis is decibels. The more content at a given frequency range results in a higher bar. Note decibels are scaled so that 0 is the maximum.

Moving your pointer over the waveform shows the exact frequency range, the current raw value, and the recent high/low/average values for that frequency range. Moving your cursor away from the display or to a different bar resets these figures.

Since the values change so quickly, this read-out is useful for getting a feel for the actual data.

## Visualisation: Waveform

The waveform display shows the snapshots of the current audio. It is affected by the FFT  size as well. A fade-out is implemented so you can see the traces of the signal since it changes so quickly. Click 'Reset' to clear this.

The x-axis is time. Leftmost is earlier, rightmost is later. Since the audio is continually being sampled at a non-deterministic rate there's no absolute time.

The y-axis is amplitude. Normally values are given on a range of -1.0 to 1.0 (to get the classic up and down waveform), but in the playground they are normalised to positive numbers, because we don't care about polarity. Higher bars mean more amplitude.

Press and hold on the waveform area to track values. While held, it will show the lowest, highest and average values encountered. A short delay is used in order to avoid measuring the click itself.

Moving your pointer on the y-axis shows the amplitude. This can be useful if you want to see what level was for a peak.


## Things to try

* Try making different sounds with your mouth, or objects and see how the frequency distribution changes. Some sounds are richer and show up across the spectrum, while others occupy only a narrow band.
* Try using the high/low-cut filters to narrow in on the frequency you care about. [Web Audio supports even more kinds of filters](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode)
* Try adjusting the FFT size to get the right granularity. Lower numbers burden your CPU less, and has a coarser analysis.
* Try adjusting the smoothing time constant. Setting the slider down (see the console for exact numbers used) progressively diminishes smoothing. This means the analysis responds more quickly to short sounds, but is also more jittery. Higher values mean the data is averaged over a longer period, at the cost of latency.
