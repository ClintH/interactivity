#include <ArduinoJson.h>

#define LED 13
#define READ_PIN 0

void setup()  {
 pinMode(LED, OUTPUT);
 Serial.begin(9600);
 while (!Serial) continue;
} 

void loop() {
  readInput();
  sendOutput();
  

}

void sendOutput() {
  // Use https://arduinojson.org/v5/assistant/ to get size of buffer
  // Here we assume the JSON {"a0": int}
  const size_t bufferSize = JSON_OBJECT_SIZE(1) + 10;
  DynamicJsonBuffer jsonBuffer(bufferSize);
  JsonObject& root = jsonBuffer.createObject();
  root["a0"] = analogRead(READ_PIN);
  
  root.printTo(Serial);
  Serial.println();
}

void readInput() {
   if (!Serial.available()) return;
    
  // Use https://arduinojson.org/v5/assistant/ to get size of buffer
  // Here we assume the JSON {"blink": int}
  const size_t bufferSize = JSON_OBJECT_SIZE(1) + 10;
  DynamicJsonBuffer jsonBuffer(bufferSize);

 

  DynamicJsonBuffer jb;
  JsonObject& root = jb.parseObject(Serial);

  if (!root.success()) return;

  int blinkCount = root["blink"];
  for (int i=0;i<blinkCount; i++) {
    digitalWrite(LED, HIGH);
    delay(100);
    digitalWrite(LED, LOW);
    delay(100);
  }
}

