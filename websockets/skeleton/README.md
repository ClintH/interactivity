# websockets skeleton

This is a skeleton websocket example. It consists of a "server" script (app.js) that runs in the Node.js environment, and typical "client" code in the public/ folder.

The example shows how to send a message from a client and have this distributed to every other client connected to the same server.

A hosted version of this is on [Glitch for you to fork and modify](https://glitch.com/edit/#!/ch-websockets-skeleton)

# Setup 

In the directory you've got this sample:

`$ npm install`

This will install the necessary packages from npm.

# Running

Once set up, you can boot up your server with

`$ npm start`

It will continue running. To stop it again, press CTRL+C (PC) or CMD+C (Mac).

# Uses

* [reconnecting-websocket](https://github.com/pladaria/reconnecting-websocket) wrapper (v3.2.2)

# Read more

* [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications)
* [express-ws](https://www.npmjs.com/package/express-ws)
