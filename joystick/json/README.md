# Joystick JSON demo

Clint Heyer, 2018

This example transmits data on the serial port in JSON format, for easier machine consumption.

The [ArduinoJson](https://arduinojson.org/v5/doc/) library is used to generate JSON on the Arduino side.

## Setup

1. Connect up your analog joystick component, making sure to adjust the pin numbers in the code.
2. Install the [ArduinoJson](https://arduinojson.org/v5/doc/) library according to its instructions. Select version 5.13.2.
3. Write the script to the board
4. Follow the install instructions for the `websockets\json-serial-bridge` example.

# Testing

1. Use the serial monitor to observe data
2. Use the default script for `json-serial-bridge` to see data in the browser

## Example web scripts

Copy the `joystick` folder (containing HTML, CSS and JS) into the `public` folder where you've got `json-serial-bridge`. The demos can then be accessed via: `http://localhost:4000/joystick/`