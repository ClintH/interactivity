# motion-stream

This example streams motion and orientation data from a mobile device via websockets to a server. From there, the server distributes it to every connected client.

It's [also available on Glitch](https://glitch.com/edit/#!/remix/ch-motion-data)

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

* [Device Orientation & Motion](https://developers.google.com/web/fundamentals/native-hardware/device-orientation/) (Google)
* [Device Orientation](https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation) (MDN)
