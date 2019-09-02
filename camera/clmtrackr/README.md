# clmtrackr sketches

Demo of Auduno's [face tracking implementation](https://github.com/auduno/clmtrackr)

The tracker returns x,y positions for a set of well-known facial points. Eg, points 19-22 represent the left eyebrow. Using these coordinates and points, you're able to roughly determine movements of features or orientation of the face itself.

* [Documentation](https://www.auduno.com/clmtrackr/docs/reference.html)

There are three different demos:

## basic

Tracks a face and draws it on the canvas

## emotion

Uses the so-called 'emotion' classifier

## face

This demo computes head rotation and size relative to camera frame.

* [Glitch live demo](https://glitch.com/edit/#!/ch-head-track)
