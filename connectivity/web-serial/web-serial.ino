
// Please README.md first

#include <ArduinoJson.h>
#define pinX 0
#define pinY 1
#define pinSwitch 2
#define ledPin 13

void setup() {
  // Need to set up digital pin as an input
  // (unnecessary for analog)
  pinMode(pinSwitch, INPUT_PULLUP);

  // Setup serial
  Serial.begin(19200);

  // Wait for serial port to be initalised
  while (!Serial) continue;

}

void loop() {
  // --- SENDING SENSOR DATA TO BROWSER
  // Read data from joystick module
  int x = analogRead(pinX);
  int y = analogRead(pinY);
  bool pressed = digitalRead(pinSwitch) == LOW;

  // Allocate memory for what we're going to send
  // 24 was calculated via: https://arduinojson.org/v6/assistant
  StaticJsonDocument<24> doc;
  doc["x"] = x;
  doc["y"] = y;
  doc["pressed"] = pressed;

  // Send on serial and follow with a new line
  serializeJson(doc, Serial);
  Serial.println();

  // --- HANDLING DATA FROM BROWSER
  if (Serial.available() > 0) {
    StaticJsonDocument<48> doc;
    DeserializationError error = deserializeJson(doc, Serial);
    if (error) {
      Serial.print(F("deserializeJson() failed: "));
      Serial.println(error.f_str());
      return;
    }

    // Turn LED on/off according to data received from browser
    int pulses = doc["pulses"];
    int interval = doc["interval"];
    bool on = true;
    for (int i=0;i<pulses;i++) {
      digitalWrite(ledPin,on);
      delay(interval);
      on = !on;
    }
  }
  
}
