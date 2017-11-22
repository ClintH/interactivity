# ble-firmata

# Setup

1. Get your board running StandardFirmataBLE. [Follow the instructions for Arduino](https://github.com/firmata/arduino)
2. Modify the script to set the local name. Take a look at the `setup()` function, and change `stream.setLocalName(...)` to `stream.setLocalName("SOMETHINGUNIQUE");` 
3. Install packages: `$ npm install` 
4. Connect up an analog sensor to analog input #2 on your board, and power it up
5. Edit index.js to use the same name you defined in the Firmata edit

# Running

`$ node index.js`

After a moment or two, you should see data streaming in your console.

If it doesn't work for some reason, the package we're using, `ble-serial` has a nifty debug option you can use. Start the script with `$ DEBUG=ble-serial node index.js` to enable this.

# StandardFirmata alternative

You can [build a custom Firmata firmware](http://firmatabuilder.com/) based on your requirements with [FirmataBuilder](http://firmatabuilder.com/). If you add the BLE option to this, it also seems to work fine.