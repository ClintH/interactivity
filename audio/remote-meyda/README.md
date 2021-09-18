# remote-meyda

Uses the [Meyda](https://meyda.js.org/) library to [extract features](https://meyda.js.org/audio-features) from audio. By default, it extracts almost all the possible features. Run this sketch in a window, and open `playground-meyda` to see the data.

Once you figure out what feature is interesting, you'd want to change `script.js`, using only the feature extractors that are relevant. This will improve performance.

In your client code (eg using `client` as a starter), you'll then need to do some post-processing on the feature data. 