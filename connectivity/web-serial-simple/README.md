# web-serial-simple

This only works in Chrome desktop. It will probably work in other Chrome-based browsers. Remember serial ports cannot be shared. So while your browser is accessing the port you cannot upload firmware or use the serial monitor.

This example shows how to send and receive strings to and from a microcontroller (MCU) such as Arduino or ESP32. You could use it to send a sensor value to the browser, or to control a running sketch from the browser. If you want to get started, write the provided `web-serial-simple.ino` to your microcontroller.

Data is sent in a very simple format - using new line characters to mark the break each message. If you want to send richer data (eg x, y & button status of a joystick module) look at the other web-serial example.


# Browser

A helper class is provided for simplicity. Create the class, and then call `open` from a 'user gesture' event handler. This is a security requirement of the browser. For example, initiate the connection from a button click.


```
const serial = new Serial();
serial.open();
```

If the connection is lost, for example because of unplugging the MCU, Serial.js will automatically try to reconnect. If this is interfering with uploading new firmware, close the tab running the sketch.

Assign a function to handle incoming data:

```
serial.ondata = (d) => {
  // do what you want with the data. It arrives as a string.
}
``` 

If necessary, you can close the port with `close()`. To re-use, call `open()` again. `isOpen()` returns true if port is open.

# Microcontroller

Simply send data with a new line. Here is a complete sketch for the Arduino environment:

```
const int PIN = 0; // Read pin #0

void setup() {
  Serial.begin(19200); // Note baud rate needs to match JS code
}

void loop() {
  int v = analogRead(PIN);
  Serial.println(v); // Send data to browser
}
```

If you want to process data sent from the browser, read from the serial:


```
void loop() {
  if (Serial.available() > 0) {
    String v = Serial.readStringUntil('\n');

    // Eg1: Echo what we receive back to browser:
    Serial.print("echo:");
    Serial.println(v);

    // Eg2: Convert to integer and multiply:
    int calc = v.toInt() * 2;
    Serial.println(calc);

    // Eg3: Write the value to pin 2 via analogWrite
    int vInt = v.toInt();
    if (vInt < 0) vInt = 0;
    if (vInt > 255) vInt = 255;
    analogWrite(2, vInt);
  }
}
```

 
Read more:
* [Web Serial tutorial from Google](https://codelabs.developers.google.com/codelabs/web-serial#0)
* [Serial API reference](https://web.dev/serial/)