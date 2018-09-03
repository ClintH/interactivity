# json-serial-bridge

This demonstrates bidirectional communication between an Arduino sketch and Javascript running in the browser. JSON is used as the data format.

# Architecture

Three components are needed.

1. An Arduino sketch that sends/receives via serial. A example is included.
2. A Node.js app connects to the computer's serial port
3. Browser code that receives data from the Node.js process and does something with the data

Because the browser is decoupled from the serial port, it's possible to load the same web app on a mobile device and work with the data too.

## Setup: Arduino

1. Install [ArduinoJson](https://arduinojson.org) according to its instructions. We've tested using version 5.13.2 of the library
2. Upload _Arduino\Arduino.ino_ to your Arduino

To test the Arduino part works, open the serial monitor and ensure that you're getting occasional data from the Arduino. Once satisfied, close the monitor so the port is available again. If you're getting gibberish, double check to make sure the baud rate of the serial monitor is 115,200 (set in the Arduino sketch)

Afterwards, you'll want to adapt the example Arduino sketch to interact with the inputs/outputs you have connected. It also makes sense to do some operations on the Arduino itself, especially when latency is a concern.

## Setup: computer

In the directory you've got this sample:

1. Run `npm install`

On Windows you might need to also run the following in an Admin command prompt:

```
npm install windows-build-tools
```

And instead of plain `npm install` as shown above, use:

```
npm install --msvs_version=2015
```

To test, start the Node.js sketch: `node app.js`. Since you didn't specify which serial port represents the Arduino, you'll get a list of ports displayed. Once you identify the right port, run it again with the port. On Windows this might be something like `node app.js --serial com5 bridge` or on a Mac: `node app.js --serial /dev/tty.usbmodem1411 bridge`. The port name is the often the same or similar to what shows up in the Arduino IDE.

Once running, the program doesn't show the data flowing back and forth. Add the `--debug` option if you want that.

The next step is to test whether the data can be accessed in the browser. Open up `http://localhost:4000`. This will allow you to send commands to the Node.js server, which in turn forwards it to the Arduino. Likewise, messages sent by the Arduino are displayed in the web page.

The existing script is set up to blink the on-board LED according to the JSON sent. Eg, `{"blink":10}` blinks the LED 10 times. The Arduino continually sends readings from an analog line, reporting it as: `{"a0":<val>}`.

# Next

The demo shows a simple way to have bidirectional data from the browser through to Arudino. Be smart about where you put the logic. Sometimes you want the computer sending commands which end up running some a lengthy function on the microprocessor. This is great when you need tight control over components connected to the board. Other times you'd rather treat the Arudino as a 'dumb' object which just sets analog/digital values it is told to via serial. This can be useful for complex behaviours that are intertwined with more complex interactions or data. The downside is additional latency of communication.

Remember to update the size of the Json buffer in the Arduino code if you change what data is sent to/from the browser. Use the [ArduinoJson Assistant](https://arduinojson.org/v5/assistant/) for this.

# Read more

More on:

- [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications)
- [ArduinoJson](https://arduinojson.org/)

This sample includes:

- [reconnecting-websocket](https://github.com/pladaria/reconnecting-websocket) wrapper (v3.2.2)
