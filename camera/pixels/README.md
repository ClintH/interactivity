# camera-pixels

See [live demo on Glitch](https://ix-camera-pixels.glitch.me/) or [fork it](https://glitch.com/edit/#!/remix/ix-camera-pixels)

Demo shows how to process frames from the camera, pixel-by-pixel.

To do so, each frame from the camera is written to an canvas that isn't visible. This is an example of _offscreen buffering_. The pixels in this buffer are the ones which we later read from and write to a canvas that is visible. Why jump through this hoop? One benefit is we can very quickly grab snapshots from the camera, and then process them at an independent rate. This rate is normally slower than the rate at which frames are received from the camera and more closely match the kind of motion effect we want to produce. The upside is that performance is much better since we aren't rendering or processing as much data.

After frames are written to the buffer, we can get access to the raw pixels that make them up. These pixels are one long array, with each pixel represented by its red, green, blue and alpha (RGBA) amount. The lowest value for any of these is 0, highest 255. Alpha uses 0 for transparent, 255 for opaque.

If you want to do simple per-pixel processing, you don't need to worry about the coordinates of pixels, just process them one-by-one in the array. The total number of pixels is the pixel data divided by 4, because each pixel is stored in 4 slots of the array.


You can also use this example to play with (extremely basic) machine vision, eg counting the total number of pixels which reach a threshold of blueness, etc.

Note: if all you want to do is apply an effect to the video (eg, toning) have a look at [CSS image effects instead](https://css-tricks.com/almanac/properties/f/filter/.

Read more
* [Manipulating video using canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Manipulating_video_using_canvas) (MDN)

# Things to try

* Trigger some action when the total amount of blue in the frame is above a certain threshold
* Rather than set pixels to transparent if blue is less than a threshold, what if the alpha value was proportional to the blue value?
* Try more sophisticated logic. Eg if red is within a certain range _and_ green is some other range ...
