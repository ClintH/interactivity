# web-serial-websocket

This only works in Chrome desktop. It will probably work in other Chrome-based browsers. 

At the time of writing, you need to enable Chrome's experimental web features: chrome://flags/#enable-experimental-web-platform-features

Remember serial ports cannot be shared. So while your browser is accessing the port you cannot upload firmware or use the serial monitor.

This sketch is a mash-up of `web-serial-json` and `websocket-skeleton`. Make sure you've tried and understood them first. In this sketch, all received data is re-broadcast over websockets. This allows a different sketch running on a phone to interact with a microcontroller connected via USB to a laptop.

You can also also [fork on Glitch](https://glitch.com/edit/#!/ch-web-serial-websocket)

# Microcontroller

To start, you can use the `web-serial-json\web-serial.ino` firmware.

# Sketch

The sketch is as simple as possible so it's easy to build from. Once you start it up and open the serial connection, it will rebroadcast messages received via serial to the server, which then distributes to all other connected clients.

It assumes the sketch running on the microcontroller is sending JSON messages. Open up the `websocket-playground` sketch in another tab or device to confirm the serial data is reaching other devices.

Identical consecutive messages are not rebroadcast. Consider reducing the rate at which messages are sent from the microcontroller if everything is slowing down from the amount of messages.

You can also have messages received via websockets to be forwarded to the microcontroller. It's important that you've set up your microcontroller code to properly handle whatever data format you're sending. And in your JS code, be careful that you're only sending what the microcontroller expects. Don't just blindly forward whatever is received.

Eg, in the `socket.onmessage` handler:

```
// Parse websocket message
const wsMsg = JSON.parse(evt.data);

// Avoid feedback loops. Only handle messages that originated elsewhere
if (wsMsg.fromId === ourId) return;

//  Pluck out the exact fields we know the MCU is prepared for:
const toSerial = { 
  x: wsMsg.x,
  y: wsMsg.y
};
serial.printObject(toSerial); // Send to serial
```

