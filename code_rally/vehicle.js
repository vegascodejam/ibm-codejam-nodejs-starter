/*******************************************************************************
 * COPYRIGHT LICENSE: This information contains sample code provided in source 
 * code form. You may copy, modify, and distribute these sample programs in any 
 * form without payment to IBM® for the purposes of developing, using, marketing 
 * or distributing application programs conforming to the application programming 
 * interface for the operating platform for which the sample code is written. 
 * Notwithstanding anything to the contrary, IBM PROVIDES THE SAMPLE SOURCE CODE 
 * ON AN "AS IS" BASIS AND IBM DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, 
 * INCLUDING, BUT NOT LIMITED TO, ANY IMPLIED WARRANTIES OR CONDITIONS OF 
 * MERCHANTABILITY, SATISFACTORY QUALITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, 
 * AND ANY WARRANTY OR CONDITION OF NON-INFRINGEMENT. IBM SHALL NOT BE LIABLE 
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL OR CONSEQUENTIAL DAMAGES ARISING 
 * OUT OF THE USE OR OPERATION OF THE SAMPLE SOURCE CODE. IBM HAS NO OBLIGATION 
 * TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS OR MODIFICATIONS 
 * TO THE SAMPLE SOURCE CODE.
 ******************************************************************************/
 
/**
 * Vehicle - Represents a vehicle on a track
 * 
 * @package CodeRally
 * @version 1.0
 */

var Point = require('./point');
var Checkpoint = require('./checkpoint');
var Vector = require('./vector');

var target;

module.exports = Vehicle;

//vehicle object
function Vehicle (state){
    this.brakePercent = 0;
    this.accelerationPercent = 0;
    if (state != null) {
        this.attributes = state.attributes;
        this.attributePoints = state.attributePoints;
        this.update(state);
    } else {
        this.target = new Point(0, 0);
    }
}

Vehicle.prototype = {
    state: null
};

/**
 * setAccelerationPercent - Adjusts the pressure you are applying to your acceleration pedal.
 * 
 * @param int percent Values may be between 100 for full throttle and 0 for no pressure.
 */
Vehicle.prototype.setAccelerationPercent = function(percent){
    if (percent < 0 || percent > 100) {
        console.log('function only accepts percentages 0-100. Input was: ' + percent);
    }

    this.accelerationPercent = percent;
};

/**
 * getAccelerationPercent Returns the last value you set the Acceleration Percent to
 * 
 * @return int Percentage of acceleration.
 */
Vehicle.prototype.getAccelerationPercent = function(){
    return this.accelerationPercent;
};

/**
 * getAcceleration - Return vehicle's acceleration vector
 *
 * @return Vector Current acceleration vector
 */
Vehicle.prototype.getAcceleration = function(){
    return new Vector(this.state.acceleration.x, this.state.acceleration.y);
}

/**
 * setBrakePercent - Set how much pressure you are applying to your break pedal.
 * 
 * @param int percent [Values may be between 100 for full break and 0 for no pressure.
 */
Vehicle.prototype.setBrakePercent = function(percent){
    if (percent < 0 || percent > 100) {

        console.log('function only accepts percentages 0-100. Input was: ' + percent);
    }
    this.brakePercent = percent;
};

/**
 * setTarget - Specify a 2D point (x,y) on the game track, that your vehicle will head towards.
 * 
 * @param Point p Coordinate to move towards.
 */
Vehicle.prototype.setTarget = function(point){
    this.target = point;
};

/**
 * getTarget - Returns the point you are currently headed towards.
 * 
 * @return Point Current destination point of vehicle.
 */
Vehicle.prototype.getTarget = function(){
    return this.target;
};


/**
 * getVelocity - Returns how fast you are currently moving in x and y directions
 * 
 * @return Vector Contains x and y velocity indicators
 */
Vehicle.prototype.getVelocity = function(){
    return new Vector(this.state.velocity.x, this.state.velocity.y);
};


Vehicle.prototype.getVelocityNormalized = function(){
    return this.state.velocityNormalized;
};

/**
 * getPosition(); Returns the current position of this vehicle.
 * 
 * @return Point Current vehicle position
 */

Vehicle.prototype.getPosition = function(){
    return new Point(this.state.position.x, this.state.position.y);
};

/**
 * getRotation - Returns the current rotation of the vehicle
 * 
 * @return int degrees of rotation
 */
Vehicle.prototype.getRotation = function(){
    return this.state.rotation;
};

/**
 * getLap - Get the current lap of the race for this vehicle
 * 
 * @return int Current lap count
 */
Vehicle.prototype.getLap = function(){

    return this.state.lap;
};

/**
 * getCheckpoint Get the next Checkpoint on the Track in relation to your vehicle
 * 
 * @return Checkpoint Next checkpoint.
 */
Vehicle.prototype.getCheckpoint = function(){
    return new Checkpoint(this.state.checkpoint);
};


/**
 * calculateMaximumTurning - Calculates the maximum degrees the car can turn with the given acceleration percentage in one second
 *
 * @param  int acceleration Possible acceleration percentage
 *
 * @return float Maximum degrees of turning per second at the provided acceleration
 */
Vehicle.prototype.calculateMaximumTurning = function(acceleration){
    if (acceleration > 0) {
        //100% acceleration reduces turning by 50%
        return this.getTurningDegrees() * ((-acceleration) / 2 + 100) / 100;
    } else {
        //100% braking (-100% acceleration) increases turning by 100%
        return this.getTurningDegrees() * (- acceleration + 100) / 100;
    }
};

/**
 * calculateHeading - Calculates the amount of degrees the entity must turn to
 * head towards the given point
 *
 * @param  Point  point Point to turn to
 * @return int Degrees the vehicle must turn
 */
Vehicle.prototype.calculateHeading = function(point){
    //+90 to represent the image axis offset
    var desiredHeading = (this.getPosition.getHeadingTo(point) + 90) % 360;
    var currentHeading = this.getRotation();
    var degrees = desiredHeading - currentHeading;

    //Faster to turn the other way
    if (degrees > 180) {
        degrees -= 360;
    } else if (degrees < -180) {
        degrees += 360;
    }
    return degrees;
};

/**
 * recalculateHeading description]
 * @param  integer bias
 * @return void
 */
Vehicle.prototype.recalculateHeading = function(bias){
    bias = 1;
//    target = this.getTarget();

    //Predicts how far the car can turn in 1 second
    var turn = Math.abs(this.calculateHeading(this.target));
    var degreesPerSecond = this.getTurningDegrees();

    //Predicts how many seconds to reach the checkpoint
    var distance = this.getPosition().getDistance(this.target);
    var velocity = this.getVelocity();
    var acceleration = this.getAcceleration();

    var predictedVelocity = Math.pow(Math.sqrt(velocity.magnitude) +
        Math.sqrt(acceleration.magnitude), 2.4) / 7;
    var seconds = distance / (predictedVelocity * 5280 / 3600);

    //Adjust the time according to the bias
    seconds *= bias;

    //Predicts how many degrees the car can turn in the time to reach the checkpoint
    var predictedTurn = degreesPerSecond * seconds;

    if (predictedTurn * 7 < turn) {
        this.setBrakePercent(100);
        this.setAccelerationPercent(0);
    } else if (predictedTurn * 6 < turn) {
        this.setBrakePercent(80);
        this.setAccelerationPercent(0);
    } else if (predictedTurn * 5 < turn) {
        this.setBrakePercent(60);
    } else if (predictedTurn * 4 < turn) {
        this.setBrakePercent(40);
        this.setAccelerationPercent(0);
    } else if (predictedTurn * 3 < turn) {
        this.setBrakePercent(20);
        this.setAccelerationPercent(0);
    } else if (predictedTurn * 2 < turn) {
        this.setAccelerationPercent(20);
        this.setBrakePercent(0);
    } else if  (predictedTurn * 1.5 < turn) {
        this.setAccelerationPercent(50);
        this.setBrakePercent(0);
    } else if  (predictedTurn < turn) {
        this.setAccelerationPercent(70);
        this.setBrakePercent(0);
    } else {
        this.setAccelerationPercent(100);
        this.setBrakePercent(0);
    }
};


/* Attribute methods */

/**
 * getMaxMph - Get vehicle acceleration attribute.  Note: This is not the cars current acceleration
 *
 * @return float Vehicle acceleration attribute
 */
Vehicle.prototype.getMaxMph = function(){
    return this.attributes.acceleration;
};

/**
 * getWeight - Vehicle weight
 *
 * @return float Weight in kilograms
 */
Vehicle.prototype.getWeight = function(){
    return this.attributes.weight;
};

/**
 * getTractionCoefficient - Retrieve the vehicle's traction coefficient
 *
 * @return float Traction coefficient
 */
Vehicle.prototype.getTractionCoefficient = function(){
    return this.attributes.traction;
};

/**
 * getTurningDegrees - The amount of turning a vehicle can perform
 *
 * @return float Max turning capability in degrees per second
 */
Vehicle.prototype.getTurningDegrees = function(){
    return this.attributes.turning;
};


Vehicle.prototype.update = function(vehicleState){
    this.state = vehicleState;

    this.accelerationPercent = this.state.accelerationPercent;
    this.brakePercent = this.state.brakePercent;
    this.target = new Point(this.state.target.x, this.state.target.y);
};

Vehicle.prototype.getState = function(){
    return {
        brakePercent: this.brakePercent,
        accelerationPercent: this.accelerationPercent,
        target: this.target
    }
};

