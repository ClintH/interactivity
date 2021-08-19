# vector-motion

Demonstrates using vectors to store a particle position and apply an angular velocity.

[It's also available for live editing and viewing on Glitch](https://glitch.com/edit/#!/ch-vector-motion?path=script.js%3A63%3A0)


![](demo.gif)

'things' are defined as having a position, velocity, size and colour. Position (x,y) is initialised as a random position on the canvas. 

Velocity is also an (x,y) pair, but in this case it refers to direction. A positive _x_ value would mean that it's heading to the right, while a negative _x_ would mean that it's headed to the left. Likewise _y_ means up (positive) or down (negative). The larger the numbers, the greater the direction, or in this case - speed. 

A velocity of (0,0) would mean there is no movement in any direction. A velocity of (1,1) would mean moving upwards and to the right at a magnitude of '1'. Velocity of (0.5,0.5) would be half of that magnitude, while (100,100) would be 100x and so on.

In this setup, we apply velocity to position, which is defined in pixels. So the number ranges we use for velocity could roughly be thought of as 'pixels to move per loop'.

Uses:
* [Victor.js](http://victorjs.org/) - Vector math library

Read more (sample this is adapted from):
* [Interactive vector motion](https://www.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-vectors/a/interactive-vector-motion) (Khan Academy)

## Things to try

* To get a feel for velocity, try a) setting different random ranges instead of -2,2 b) use different fixed velocity vectors
* Rather than wandering around aimlessly, can you make it appear like falling snow?
* What about if things slowed over time (eg friction/resistance)
* Can random jitter be added to velocity?
* Rather than wrapping things around the screen, another option might be to delete items that fall off the screen and insert a new random one
* Just as each thing has a colour property which is later used in in `drawThing`, think of another property things could have to visually distinguish them
