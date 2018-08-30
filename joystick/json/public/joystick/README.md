# Joystick demos

The demos have increasing levels of complexity. Start with the first one, tinker and understand before moving on.

Together the examples demonstrate

- Mapping absolute joystick position to an alternative coordinate space
- Using the relative distance from the joystick's home position to influence other values
- Roughly calculating a speed vector for forward or backward movement along each axis

# Setup

1. Make sure you have the `joystick\joystick_json.ino` sketch set up and running. There's a README there for more info on that.
2. Have your `json-serial-bridge` server running (see the above README for more info)

# 1. move

This demonstrates mapping sensor coordinates into window coordinates. In this case, sensor data is treated as absolute values - setting the HTML element to where ever the joystick is positioned. The 'resting' position of the joystick is the middle of the screen.

Several helper functions are used that might be useful for your own sketches.

# 2. nudge

This uses sensor data in a relative manner to nudge an element from its current position. Unlike the previous example there is no correlation then between the position of the joystick and the element on screen.

# 3. colour

Shows how to smooth values by working with an average of recent values rather than the very latest value. Higher windowing sizes reduces reponsiveness, but increases smoothness and vice-versa.

A secondary technique this sample demonstrates is calculating speed and rather than absolute position values. Values are positive for movement in one direction, negative for the opposite.
