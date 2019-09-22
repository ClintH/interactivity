#include <ArduinoJson.h>
#include <Servo.h> 

const byte CMD_WRITE = 0;
const byte CMD_WRITE_US = 1;
const byte CMD_READ = 2;
const byte CMD_DETACH = 3;

// How many servos are we using? (make sure servoPins gets updated)
#define SERVO_COUNT 2
Servo servos[SERVO_COUNT];

// Set control pin numbers here
int servoPins[SERVO_COUNT] = { A0, A1};

void setup()  {
 Serial.begin(115200);
 while (!Serial) continue;

 for (int i=0;i<SERVO_COUNT;i++) {
  // This will stop a continuous rotation servo
  write(i, 90, 0);
 }
} 

void loop() {
 // Check for commands
 readInput();
}

void readInput() {
   if (!Serial.available()) return;
    
  // Use https://arduinojson.org/v5/assistant/ to get size of buffer
  // Here we assume the JSON { "cmd": 0, "opt", 100, "servo":0,"pos": 100 }
  const size_t bufferSize = JSON_OBJECT_SIZE(4) + 40;
  DynamicJsonBuffer jsonBuffer(bufferSize);
  JsonObject& root = jsonBuffer.parseObject(Serial);

  if (!root.success()) return;

  int cmd = root["cmd"];
  int pos = root["pos"];
  int servo = root["servo"];

  switch (cmd) {
    case CMD_WRITE: {
        // Try to move, and if it seems OK, send back position
        int duration = (root.containsKey("opt")) ? duration = root["opt"] : 0;
        if (write(servo, pos, duration)) {
           sendRead(servo);
        }
      }
      break;
    case CMD_WRITE_US: {
       // Try to move by microseconds
       if (writeMicroseconds(servo, pos)) {
        sendRead(servo);
       }
     }
     break;
    case CMD_READ: {
        // Send position
        sendRead(servo);
      }
      break;
    case CMD_DETACH: {
        // Detach
        detach(servo);
      }
      break;
     default: {
        Serial.print("Unknown command code ");
        Serial.println(cmd);
      }
      break;
  }
}

bool write(int servo, unsigned int position, unsigned int durationMs) {
  if (servo < 0 || servo >= SERVO_COUNT) return false;
// Debug if needed
//  Serial.print("write ");
//  Serial.print(servo);
//  Serial.print(" pin ");
//  Serial.print(servoPins[servo]);
//  Serial.print(" = ");
//  Serial.println(position);

  if (!servos[servo].attached()) servos[servo].attach(servoPins[servo]);
  
  servos[servo].write(position);

  if (durationMs > 0) {
    delay(durationMs);
    servos[servo].detach();
  }
  return true;
}

bool writeMicroseconds(int servo, unsigned int microseconds) {
  if (servo < 0 || servo >= SERVO_COUNT) return false;
// Debug if needed
//  Serial.print("write ");
//  Serial.print(servo);
//  Serial.print(" pin ");
//  Serial.print(servoPins[servo]);
//  Serial.print("uS = ");
//  Serial.println(microseconds);

  if (!servos[servo].attached()) servos[servo].attach(servoPins[servo]);
  
  servos[servo].writeMicroseconds(microseconds);
  return true;
}

int read(int servo) {
  if (servo < 0 || servo >= SERVO_COUNT) return -1;
  return servos[servo].read();
}

bool detach(int servo) {
 if (servo < 0 || servo >= SERVO_COUNT) return false;
  servos[servo].detach();
//  Serial.print("Detached ");
//  Serial.println(servo);
 return true;
}

void sendRead(int servo) {
  const size_t bufferSize = JSON_OBJECT_SIZE(3) + 30;
  DynamicJsonBuffer jsonBuffer(bufferSize);
  JsonObject& root = jsonBuffer.createObject();
  root["cmd"] = CMD_READ;
  root["servo"] = servo;
  root["pos"] = read(servo);
  root.printTo(Serial);
  Serial.println();
}
