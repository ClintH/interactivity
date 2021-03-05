# websocket-skeleton

This example is very bare to allow you to easily adapt and extend. It simply broadcasts pointer movements via websockets. Data is dumped to the console.

It also demonstrates creating a unique id for this running code, and tagging all outgoing messages with the id. This way your code can have different logic if data comes from a remote peer. Or by assigning fixed ids to different sketches your code knows where things originated from.

There's also `websocket-playground` if you want to test sending/receiving messages.

# Read more

* [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications)
* [express-ws](https://www.npmjs.com/package/express-ws)
* Uses [reconnecting-websocket](https://github.com/pladaria/reconnecting-websocket) wrapper (v3.2.2)
