// Pin to read data from
const int PIN = 0;

void setup() {
  Serial.begin(19200);
}

void loop() {
  //int v = analogRead(PIN);
  //Serial.println(v);

  if (Serial.available() > 0) {
    String v = Serial.readStringUntil('\n');

    // Eg1: Echo what we receive back to browser:
    Serial.print("echo:");
    Serial.println(v);

    // Eg2: Convert to integer and multiply:
    //int calc = v.toInt() * 2;
    //Serial.println(calc);

    // Eg3: Write the value to pin 2 via analogWrite
    //int vInt = v.toInt();
    //if (vInt < 0) vInt = 0;
    //if (vInt > 255) vInt = 255;
    //analogWrite(2, vInt);
  }
}