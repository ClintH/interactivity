# ws-serial-bridge

This demonstrates bidirectional communication between an Arduino sketch and Javascript running in the browser.

In this particular case, we're using a servo with analog feedback, which allows its actual position to be read. The servo can be moved with a GUI, and the GUI is able to update to show the actual position of the servo, or to reflect physical movements of the servo (ie, turning it like a knob).

Please read, experiment and understand ws-serial-bridge first, as this sample builds on that.

# Servo hookup

Assuming an Adafruit analog feedback servo and provided sketch:

* White - Analog In 0 (A0)
* Yellow - Digital 9 (PWM)
* Orange - Power - 5V
* Brown - Power - Ground

# Install and setup

Follow the same instructions as the `ws-serial-bridge` sample. Note that the Arduino sketch does not send periodic data, it must be queried - but this could be easily changed if needed.

The web app displays and allows you to control the servo position.

# Serial commands

The Arduino sketch sends and receives commands in a simple string format:

  <Text,Int,Float>

Eg:
  <Hello,1,10.5>

Commas , are used to separate each of the three parts, and the whole thing is enclosed in angled brackets < >.

This simple format means you can easily test using Arduino's serial monitor, or send commands from Javascript code.

In the servo sketch, the integer field is used to determine the kind of message/command. These are defined with an enum. 

```
enum {
  MsgAcknowledge, // 0
  MsgError,       // 1
  MsgMove,        // 2
  MsgMoveResult,  // 3
  MsgPosition,    // 4
};
```

The text part of the command is ignored, here 'servo' is used.

To query the position of the servo, send:
  <servo,4,0>

The response code is '3' (MsgMoveResult), eg:
  <3,10>

To move the servo, send:
  <servo,2,x>
  (where x is a value between 0-180)

After moving, you get back a response with the read position, ie:
  Sent: <servo,2,0>
  Recv: <servo,3,2>

There may be a discrepancy between the requested position and read position.

More on:
* [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications)

Bundles:
* [reconnecting-websocket](https://github.com/pladaria/reconnecting-websocket) wrapper (v3.2.2)

Credits:
* Arduino serial I/O: http://forum.arduino.cc/index.php?topic=396450
* Arduino analog feedback servo by Adafruit's Bill Earl: https://learn.adafruit.com/analog-feedback-servos/servos-as-input-devices
