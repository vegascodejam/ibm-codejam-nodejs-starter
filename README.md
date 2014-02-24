ibm-codejam-nodejs-starter
==========================
## Getting started

* [Sign up](http://www.bluemix.net/) for the Blue Mix beta.
* [Set up cf tool](http://www.ng.bluemix.net/docs/BuildingWeb.jsp#install-cf) - [Installers](https://github.com/cloudfoundry/cli)
* Clone the code rally [starter code](https://github.com/thebarbariangroup/ibm-codejam-nodejs-starter) repo from github.
* Use CF to connect to BlueMix:

`cf api http://api.ng.bluemix.net`

`cf target -o yourusername@youremail.com -s dev`

* Now comes the really difficult part, choosing a name for your application. You must prepend whatever name you select with "coderally-" in order to participate in the competition! This will also determine the public URL for your application and the name of your AI racer in the leaderboards.

`cf push <YOUR_APPLICATION_NAME>`

You can now visit your application on BlueMix and should see this page!  Now you can begin exploring the Node.JS starter application.  The main code you'll need to implement can be found in myVehicleAI.js

As you complete your implementation, you can do additional pushes to BlueMix, and then test using the [race console](http://vegascodejam.com/race-console.html).


## How the AI Cars Work

Code Rally has an event-based system in the game engine. Throughout a race, the engine will throw out certain events at vehicles, and the AIs will call their corresponding method to respond to that event. The AI classes use an API that controls your vehicle, with access to how much you are accelerating and where you want your car to turn.

### Make and model
There are four primary attributes to each car besides its AI code:

* Acceleration - Controls how quickly your car accelerates
* Weight - Controls how heavy your car is - a heavier car will be harder to move/deflect when crashing into obstacles or other cars, but it will also be more likely to skid when making sharp turns at high speeds
* Traction - Controls how much "grip" your vehicle has - the higher the traction the harder it will be to skid the car
* Turning - Controls how small your tuning circle is - the higher the value then the smaller the turning circle

The points that you put into each of the different physical attributes are relative to each other and not absolute. Tip: have at least some of your points in each box otherwise the car will not perform well.

### Navigation
The best way to think about how cars navigate the track is to think of it a lot like Olympic skiing - there are a series of checkpoints around the track which span the road/track width. You car can get information about these checkpoints and choose a co-ordinate that will take the vehicle through the checkpoint. These checkpoints must be passed through in order for a car to complete a lap. If you do miss a checkpoint and go through other checkpoints afterwards don't worry - you just need to get your vehicle to go through the checkpoint it missed and to continue on from there.

### Steering
You do not directly control steering of the car - when you want to make the car turn you set a "target" and the car will turn to face that target (or, if the target is too close and you have a large turning circle, circle the target until it can pass through it). 

### Speed
You can set your acceleration and breaking percentages to control the car's acceleration/deceleration but you cannot set a speed for the car to travel at. You can detect how fast a car is going and set your acceleration to 0 when you reach that speed if you do want to control a car's speed more directly.

### AI Programming
An advanced code rally AI is event-driven - this means that when certain conditions are met in a race a corresponding method is called in the AI to determine what the car should do.  In the starter code you will empty methods for these events for you to develop.

There are 9 events in the game that a car can listen for:

* onRaceStart - Called when the race begins. This initial call will include the Track's checkpoint data.  Tip: accelerate and set a target for the car otherwise it will be a long race.

Example:

```javascript
this.vehicle.setAccelerationPercent(80);
this.vehicle.setBrakePercent(0);

var target = this.vehicle.getCheckpoint().getCenter();
this.vehicle.setTarget(target);
```

* onCheckpointUpdated - Called when your vehicle goes through the next checkpoint in the race - you are given the checkpoint you passed through. If you want to find the next checkpoint to target then call this.vehicle.getCheckpoint().

Example:
```javascript
var target = this.vehicle.getCheckpoint().getCenter();
this.vehicle.setTarget(target);

this.vehicle.setAccelerationPercent(100);
```

* onOffTrack - Called when your vehicle goes off the track. When off the track you will have less traction and obviously won't pass through any checkpoints, but there is no other penalty for this.

Example:
```javascript
this.vehicle.setBrakePercent(100);
this.vehicle.setAccelerationPercent(0);

var target = this.vehicle.getCheckpoint().getIntersectionPoint(this.vehicle.getRotation(), this.vehicle.getPosition());
this.vehicle.setTarget(target);
```

* onStalled - Called if your car doesn't move for 6 seconds. Tip: make your car move if this is called.
* onOpponentInProximity - this is called when a competing vehicle gets close to yours - you will be given a handle on that vehicle so you can find out its position in case you want to smash into it avoid it.

Example:
```javascript
if (aiutils.isCarAhead(this.track, this.vehicle, otherVehicle)){
    this.vehicle.setTarget(otherVehicle.getTarget());
    this.vehicle.setAccelerationPercent(100);
    this.vehicle.setBrakePercent(0);
}
```

* onCarCollision - Called when your vehicle crashes or is crashed into by another vehicle. You will be given the object that represents the vehicle you crashed with in case you want to exact revenge and crash back into it.
* onObstacleInProximity - Called if you get close to a non-vehicle object in the race. You are given a handle on the object so you can find its location and try to avoid it.
* onObstacleCollision - Called when your vehicle crashes into or is crashed into by a non-vehicle object. You will be given a handle on the object that you collided with in case it bounced ahead of you and you want to avoid it.
* onTimeStep - Called every 100ms in the race so you can put code in here to control your car's top speed, check if you have stopped moving and do whatever else you want it to.

## Additional Resources
* [FAQ](http://www.vegascodejam.com/faq.html)
* [Code Rally Community Site](https://www.ibm.com/developerworks/community/blogs/code-rally/entry/landing?lang=en)
* [Code Rally Developer Blog](https://www.ibm.com/developerworks/community/blogs/code-rally/tags/blog?lang=en)
* [Java/Eclipse Setup Guide](https://www.ibm.com/developerworks/community/blogs/code-rally/entry/zero_to_racing_in_60_seconds?lang=en)
* [Setting up your own server](https://www.ibm.com/developerworks/community/blogs/code-rally/entry/beta_installer?lang=en)

Good luck!
