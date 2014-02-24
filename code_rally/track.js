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
 * Track - Represents track data and checkpoint state
 * 
 * @package CodeRally
 * @version 1.0
 */
module.exports = Track;

var Point = require('./point');
var Checkpoint = require('./checkpoint');

//track object
function Track(trackState) {
//    console.log(trackState);
    this.startingPoint = new Point(trackState.startingPoint.x, trackState.startingPoint.y);
    this.imageURL = trackState.imageURL;

    this.checkpoints = [];

    for(var index in trackState.checkpoints) {
        var cp = trackState.checkpoints[index];
        this.checkpoints.push(new Checkpoint(cp));
    }
}

/**
 * getNearestCheckpoint - Finds the nearest checkpoint to the given point
 * 
 * @param  Point  $point Point used to locate from
 * @return Checkpoint - Nearest checkpoint to $point based on checkpoint center
 */
Track.prototype.getNearestCheckpoint = function(point){

    var bestDistance = Number.MAX_VALUE;
    var bestCheckpoint = 0;

    this.checkpoints.forEach(function(i, trackCheckPoint){
        var distance = trackCheckPoint.getCenter().getDistanceSquared(point);
        if (distance < bestDistance){
            bestDistance = distance;
            bestCheckpoint = i;
        }
    });

    return this.checkpoints[i];
};

/**
 * getNextCheckpoint - Given the checkpoint provided, this returns the next checkpoint in the race.
 *
 * @param  Checkpoint $checkpoint Checkpoint used to check against
 * @return Checkpoint Next sequential checkpoint from $checkpoint
 */
Track.prototype.getNextCheckpoint= function(checkpoint){
    var $this = this;
    this.checkpoints.forEach(function(i, trackCheckPoint){
        if (checkpoint == trackCheckPoint) {
            if (i == count($this.checkpoints) - 1) {
                return $this.checkpoints[0];
            }
            return $this.checkpoints[i + 1];
        }
    });

    console.log('Unknown checkpoint');
};

/**
 * getCheckpointIndex - Given the checkpoint provided, return the index within the track.
 *
 * @param  Checkpoint $checkpoint Checkpoint used to check against
 * @return int Index of the checkpoint
 */
Track.prototype.getCheckpointIndex = function(checkpoint){
    for(var index in this.checkpoints) {
        var i = this.checkpoints[index];
    }

    return i;

    console.log('Unknown checkpoint');
};
