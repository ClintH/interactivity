# thing

This sketch slightly decouples sound input with response. It also uses the canvas to draw, rather than manipulating DOM elements like the other examples. It uses a generic `remote` to receive processed audio.

In this model, the characteristics of sound affect an object: 'Thing'. Changes are incremental or decremental, allowing a natural fluidity to the response.

The thing gets spun with loud sound - the more often and louder, the faster it will spin. The outer shape of the thing will distort according to the averages of each frequency bin.

Once the object has been altered, there's a following pass where each property is affected by the thing's own kind of logic. In the sketch, most properties will decay over time.

Finally, each property is 'sanity checked' making sure that it sits in a valid range that the drawing function expects. I can be useful to consider everything as a percentage (0.0-1.0) for consistency.

After that number crunching, a drawing pass happens that renders the properties.

If you want to be inspired by this example, try stripping it down to a single property that you derive and draw in your own way. And then progressively add properties.

If you want to see a more complicated example, see 'particles'

Read more:
* [Drawing with the Canvas (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)

# Map

index.html: Canvas element and that's about it

script.js: receives and works with processed data
* Keeps track of amplitude over time, using `SlidingWindow`
* Keeps track of the averages of each individual frequency bin over time
* Creates an instance of a 'thing'
* Runs drawing loop
* Updates thing based on received data from a remote

Thing.js: it has various properties that are updated by sound, but also behaves on its own accord and is drawn to the canvas
