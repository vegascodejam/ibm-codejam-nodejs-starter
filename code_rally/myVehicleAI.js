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
 * MyVehicleAI - Your code to implement your vehicle goes here!
 */

module.exports = MyVehicleAI;

var Vehicle = require('./vehicle');
var Obstacle = require('./obstacle');
var AIUtils = require('./aiutils');

var aiutils = new AIUtils;

function MyVehicleAI(vehicle, track, extra){
    this.vehicle = vehicle;
    this.track = track;
    this.extra = extra;
}

/**
 * onRaceStart - Called when a race first begins.
 */
MyVehicleAI.prototype.onRaceStart = function() {
    Your code goes in these methods!

    return this.getResponse();
};

/**
 * onCheckpointUpdated - Called when the car updates it's current checkpoint target
 */
MyVehicleAI.prototype.onCheckpointUpdated = function() {

    return this.getResponse();
};

/**
 * onOffTrack - Called when the car goes off track
 */
MyVehicleAI.prototype.onOffTrack = function() {

    return this.getResponse();
};

/**
 * onStalled - Called when the cars velocity drops to zero
 */
MyVehicleAI.prototype.onStalled = function() {
    return {status: 'noop'};
};

/**
 * onOpponentInProximity - Called when an opponent is in proximity of the car
 */
MyVehicleAI.prototype.onOpponentInProximity = function() {
    var otherVehicle = new Vehicle(this.extra);


    return this.getResponse();
};

/**
 * onCarCollision - Called when the car collides with another car
 */
MyVehicleAI.prototype.onCarCollision = function() {
    return {status: 'noop'};
};

/**
 * onObstacleInProximity - Called when an obstacle is in proximity of the car
 */
MyVehicleAI.prototype.onObstacleInProximity = function() {
    var obstacle = new Obstacle(this.extra);


    return this.getResponse();
};

/**
 * onObstacleCollision - Called when the car collides with an obstacle
 */
MyVehicleAI.prototype.onObstacleCollision = function() {
    var obstacle = new Obstacle(this.extra);


    return {status: 'noop'};
};

/**
 * onTimeStep - Called once for each timestep of the race
 * @return JSON
 */
MyVehicleAI.prototype.onTimeStep = function() {
    return {status: 'noop'};
};

/**
 * getResponse - Return the JSON response reflecting the new vehicle state
 *
 * @return JSON Contains the appropriate response
 */
MyVehicleAI.prototype.getResponse = function() {

    return { status : 'success',
        vehicle : this.vehicle.getState()
    }
};
