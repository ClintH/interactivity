# motion-stream

This is a demo of using websockets to broadcast motion events from a mobile device over websockets. By default, motion data is sent every 200ms.

If you are unfamiliar with websockets, starting with `websocket-simple`.

Please see `interactivity\HTTPS.md` for how to serve your script over HTTPS. This is necessary for it to work in Chrome-based browsers. With the provided `websocket-server`, Start it like so: ```node server.js --tunnel --qr --quiet```. 