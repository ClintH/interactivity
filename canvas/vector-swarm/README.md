# vector-swarm

Demonstrates using vectors to move particles toward a coordinate - in this case, the pointer. It's an extension of the [vector-motion](../vector-motion) sketch.

[You can view and edit live on Glitch](https://glitch.com/edit/#!/ch-vector-swarm)

![](demo.gif)

This sketch does some additional vector manipulation in order to guide things toward the current pointer location

Uses:
* [Victor.js](http://victorjs.org/) - Vector math library

Read more (sample this is adapted from):
* [Interactive vector motion](https://www.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-vectors/a/interactive-vector-motion) (Khan Academy)

## Things to try

* Tweak parameters in `moveThing` to create different dynamics for how the dots chase the pointer
* Can some things be better or worse at reaching the pointer? Can they have mass, for example?