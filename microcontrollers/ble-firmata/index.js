var BLESerialPort = require('ble-serial').SerialPort;
var firmata = require('firmata');
 
// Use a filter function to only connect to this particular named device
var filterPeripheral = function(p) {
  return p.advertisement.localName == "CH-101";
};

// Create port and use our filter function
var serialPort = new BLESerialPort({filter:filterPeripheral});
 
// Set up Firmata as usual, using the BLE serial port
var board = new firmata.Board(serialPort, function (err, ok) {
  if (err){ throw err; }

  // Now we have a connection, and can send commands using the Firmata API
  board.analogRead(2, function(value) {
    console.log("The value of pin A2 is " + value);
  });
});

