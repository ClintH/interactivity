# servo-playground

This sketch demonstrates manual control of either continuous or single rotation servos.

It expects that the `servo-control` sketch is loaded on your board, and you've got two servos connected. On pin A0 a continuous, and on pin A1 a single-rotation servo.

Servo hookup (for three-wire brown, red, yellow)
* Brown: ground
* Red: 5V
* Yellow: analog pin

Please see the README.md for *json-serial-bridge* for more info on setting that up. Once setup, you can place this directory into its `public` folder.

The sketch is a *playground* that means it is constructed so you have manual control over the servos, but isn't meant for further sketching. See `servo-simple` for an example of that.
