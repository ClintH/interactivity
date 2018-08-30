
// Please see README.md

#include <ArduinoJson.h>
#define pinX 0
#define pinY 1
#define pinSwitch 12

void setup() {
  // Need to set up digital pin as an input
  // (unnecessary for analog)
  pinMode(pinSwitch, INPUT_PULLUP);

  // Setup serial
  Serial.begin(9600);

  // Wait for serial port to be initalised
  while (!Serial) continue;

}

void loop() {
  // Read data
  int x = analogRead(pinX);
  int y = analogRead(pinY);
  bool pressed = digitalRead(pinSwitch) == LOW;

  // Allocate memory for what we're going to send
  // 61 was calculated via: https://arduinojson.org/v5/assistant/
  StaticJsonBuffer<61> jsonBuffer;

  // Construct JSON
  JsonObject& root = jsonBuffer.createObject();
  root["x"] = x;
  root["y"] = y;
  root["pressed"] = pressed;

  // Send on serial with a new line
  root.printTo(Serial);
  Serial.println();

}
