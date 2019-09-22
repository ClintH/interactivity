# servo-feedback

This demonstrates bidirectional communication between an Arduino sketch and Javascript running in the browser.

In this particular case, we're using a servo with analog feedback, which allows its actual position to be read. The servo can be moved with a GUI, and the GUI is able to update to show the actual position of the servo, or to reflect physical movements of the servo (ie, turning it like a knob).

Please read, experiment and understand json-serial-bridge first, as this sample builds on that.

# Servo hookup

Assuming an Adafruit analog feedback servo and provided sketch:

* White - Analog In 0 (A0)
* Yellow - Digital 9 (PWM)
* Orange - Power - 5V
* Brown - Power - Ground

# Install and setup

Follow the same instructions as the `json-serial-bridge` sample. Once you've got that running, copy this sample into `json-serial-bridge\public`. You access the default sketch from `http://localhost:4000/servo-feedback`. Note that you do not use your text editor's 'live server' feature to run this demo, rather you run the aforementioned bridge which serves your code.

The web app displays and allows you to control the servo position.

More on:
* [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications)

Bundles:
* [reconnecting-websocket](https://github.com/pladaria/reconnecting-websocket) wrapper (v3.2.2)
* Builds from [Arduino analog feedback servo by Adafruit's Bill Earl](https://learn.adafruit.com/analog-feedback-servos/servos-as-input-devices)
