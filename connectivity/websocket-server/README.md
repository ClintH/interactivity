# websocket-server

This is a basic websocket server example. The server (`app.js`) runs in the Node.js environment, rather than browser. Whenever it receives a message, it distributes it to all other connected clients.

You can try it out on [Glitch](https://glitch.com/edit/#!/ch-websockets-skeleton)

# Setup 

Assuming you have Node.js installed already, you're ready to install the requisite packages:

`npm install`

You only have to do this once.

# Starting

Start the server:

`node server.js`

It will continue running. To stop it again, press CTRL+C (PC) or CMD+C (Mac). In the console you can see the URL to access your sketches from, eg. http://localhost:4040. Remember that 'localhost' (and 127.0.0.1) is how a device refers to itself - you can't use this address to access your sketches from elsewhere.

If you start with `--tunnel`, [localtunnel](https://github.com/localtunnel/localtunnel) will create a internet-accessible URL for your server.

```
node server.js --tunnel
```

When using this server, do not use the live server extension in VS Code.

Your devices will need to be on the same network in order to connect to each other. This works fine when you're on your home wifi, but some institutional wifi networks don't allow peers to connect to each other. 

Three options to deal with this
1. Make your own hotspot and have the devices connect on that.
2. Use a service like [localtunnel](https://github.com/localtunnel/localtunnel) to 'tunnel' your server to the internet ([other services listed here](https://github.com/anderspitman/awesome-tunneling)). This feature is also included in the server, see above.
3. Host the code on [Glitch](https://glitch.com/edit/#!/ch-websockets-skeleton).


# What about my browser code?

The server will 'serve' all parent folders. Eg, if you have a folder structure like this:

```
interactivity
 connectivity
  websocket-server
  websocket-skeleton
  websocket-playground
```

You can access `http://localhost:4040/websocket-skeleton/` in your browser to load your code in `websocket-skeleton`. Create any other folders you need within `connectivity`. Folders outside of `connectivity` won't be accessible.

The one running server serves any number of sketches you make.
