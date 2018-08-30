# json-serial-bridge

This demonstrates bidirectional communication between an Arduino sketch and Javascript running in the browser. JSON is used as the data format.

# Architecture

Three components are needed.

1. An Arduino sketch that sends/receives via serial. A example is included.
2. A Node.js app connects to the computer's serial port
3. Browser code that receives data from the Node.js process and does something with the data

Because the browser is decoupled from the serial port, it's possible to load the same web app on a mobile device and work with the data too.

# Arduino setup

1. Install [ArduinoJson](https://arduinojson.org) according to its instructions. We've tested using version 5.13.2 of the library
2. Upload _Arduino\Arduino.ino_ to your Arduino

To test the Arduino part works, open the serial monitor and ensure that you're getting occasional data from the Arduino. Once satisfied, close the monitor so the port is available again. If you're getting gibberish, double check to make sure the baud rate of the serial monitor is 115,200 (set in the Arduino sketch)

Afterwards, you'll want to adapt the example Arduino sketch to interact with the inputs/outputs you have connected. It also makes sense to do some operations on the Arduino itself, especially when latency is a concern.

# Computer setup

In the directory you've got this sample:

1. Run `npm install`

To test, start the Node.js sketch: `node app`. Since you didn't specify which serial port represents the Arduino, you'll get a list of ports displayed. Once you identify the right port, run it again with the port. On Windows this might be something like `node app com5` or on a Mac: `node app /dev/tty.usbmodem1411`. The port name is the often the same or similar to what shows up in the Arduino IDE.

Once running, you should see the same data coming through in your terminal that you saw before in the Ardunio serial monitor.

The next step is to test whether the data can be accessed in the browser. Open up `http://localhost:4000`. This will allow you to send commands to the Node.js server, which in turn forwards it to the Arduino. Likewise, messages sent by the Arduino are displayed in the web page.

# Next

Hack away! Try making a simple command system so that a particular function runs on the Arduino when a certain command is sent from the browser, or making something happen in the browser based on a command sent from the Arduino.

Remember to update the size of the Json buffer in the Arduino code if you change what data is sent from the browser. Use the [ArduinoJson Assistant](https://arduinojson.org/v5/assistant/) for this.

# Read more

More on:

- [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications)
- [ArduinoJson](https://arduinojson.org/)

This sample includes:

- [reconnecting-websocket](https://github.com/pladaria/reconnecting-websocket) wrapper (v3.2.2)
