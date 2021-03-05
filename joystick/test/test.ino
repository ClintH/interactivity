/*
 * 
 * Joystick read demo
 * Clint Heyer, 2018
 * 
 * Simply dumps switch status and x,y to the serial in a format for people
 * 
 * 1. Connect up your analog joystick component, making sure to adjust the
 * pin numbers in the #define statements below.
 * 
 * 2. Write it to your board and open the serial monitor. Observe the data that is received
 * when moving the joystick and pressing it.
 * 
 */

#define pinX 0
#define pinY 1
#define pinSwitch 3

void setup() {
  // Need to set up digital pin as an input
  // (unnecessary for analog)
  pinMode(pinSwitch, INPUT_PULLUP);

  // Setup serial
  Serial.begin(9600);
}

void loop() {
  // Read data
  int x = analogRead(pinX);
  int y = analogRead(pinY);
  bool pressed = digitalRead(pinSwitch) == LOW;
  
  // Print out data to console
  if (pressed)
    Serial.print("[X] ");
  else
    Serial.print("[ ] ");
   
  Serial.print(x);
  Serial.print(", ");
  Serial.print(y);
  Serial.println();
}
