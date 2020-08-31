
# audio samples

Open this folder in VS Code and run the live server from there.

Notes:

* fftSize must be a power of 2. Higher values slower, more detailed. Range is 32-32768
* Decibels are scaled such that 0 is the maximum. Thus a decibel reading for just ambient background might be something like -120 and a purposeful noise -60 or so.

# Read more

* [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
* [Filters](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode)