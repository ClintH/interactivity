# web-serial

This only works in Chrome desktop. It will probably work in other Chrome-based browsers. Remember serial ports cannot be shared. So while your browser is accessing the port you cannot upload firmware or use the serial monitor.

This example shows how to send and receive JSON-packed data to and from a microcontroller (MCU) such as Arduino or ESP32. You could use it to send sensor values to the browser or control a running sketch from the browser. If you want to get started, write the provided `web-serial.ino` to your microcontroller, see also the notes below on a library to install.

# Browser

Compared to `web-serial-simple`, data is packed in JSON. This means you can bundle up a few key-value pairs and send them as a packet. On the browser side it's easy to make an object to send:

```
let packet = {
  pin: 1,
  pwm: 255
}
serial.writeJson(packet);
```

If you want to process data sent from the MCU, register a handler at `onjson`:

```
serial.onjson = (o) => {
  if (o.buttonPressed == 2) {
    // do something...
  }
}
```

At start-up, it might be possible that the browser reads just a fragment of a sent JSON snippet. You'll see an error in the console to let you know. If these keep coming, it's a sign that your MCU is no sending properly formed JSON and you want to scope it out via the Arduino Serial Monitor.


# Microcontroller

On the MCU, [ArduinoJson](https://arduinojson.org) is used to pack up the data. Install version 6.17.3 via _Tools > Manage Libraries_ in the Arduino IDE. 

Use their provided [Assistant](https://arduinojson.org/v6/assistant) to figure out how big the data is that you want to send. In the example below it estimated 24 bytes, for example.

```
// Read data
int x = analogRead(pinX);
int y = analogRead(pinY);
bool pressed = digitalRead(pinSwitch) == LOW;

// Allocate memory for what we're going to send
StaticJsonDocument<24> doc;  // 24 was calculated via: https://arduinojson.org/v6/assistant
doc["x"] = x;
doc["y"] = y;
doc["pressed"] = pressed;

// Send on serial and follow with a new line
serializeJson(doc, Serial);
Serial.println();
```

To handle received data, you also need to use the [Assistant](https://arduinojson.org/v6/assistant) to figure out its size. In this case, 48 bytes was estimated.

The following will blink the on-board LED 50 times with 500ms interval, when the JSON string `{"pulses":50,"interval":500}` is sent.

```
StaticJsonDocument<48> doc;
DeserializationError error = deserializeJson(doc, Serial);

// Turn LED on/off according to data received from browser
int pulses = doc["pulses"];
int interval = doc["interval"];
bool on = true;
for (int i=0;i<pulses;i++) {
  digitalWrite(ledPin,on);
  delay(interval);
  on = !on;
}
```


Read more:
* [Web Serial tutorial from Google](https://codelabs.developers.google.com/codelabs/web-serial#0)
* [Serial API reference](https://web.dev/serial/)
* [ArduinoJson library](https://arduinojson.org)