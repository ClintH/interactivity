# camera-trackingjs

Demonstrates trackingjs's colour tracker functionality. Here we track a few colours, and rather than working in pixel coordinates, we demonstrate how to move elements around in viewport coordinates.

This can be a bit confusing to because you expect the element to visually match the video, but it's not meant to. If the tracked object is in the top left of the video frame, it will show up in the top left of the viewport. If it's in the middle of the video frame, it'll show up in the middle of the viewport, and so on.

Note that this implementation only creates a single element per colour, even though the tracker supports multiple objects per colour.

See more:
* [Tracking.js](https://trackingjs.com/docs.html#trackers)

