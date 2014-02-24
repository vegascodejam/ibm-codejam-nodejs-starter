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
 * AIUtils - Utility methods for the AI
 * 
 * @package CodeRally
 * @version 1.0
 */

var Point = require('./point');

module.exports =  AIUtils;

function AIUtils(){
    
}

/**
 * isCarAhead - Returns true if the other car is ahead of (or beating) the other car.
 * 
 * @param  Track   track Current track
 * @param  Vehicle us    Our vehicle
 * @param  Vehicle them  The vehicle to compare against
 * 
 * @return boolean        true if the other car is ahead
 */
AIUtils.prototype.isCarAhead = function(track, us, them){
    if (us.getLap() != them.getLap()) {
        return us.getLap() > them.getLap();
    }
    var index = track.getCheckpointIndex(us.getCheckpoint());
    var otherIndex = track.getCheckpointIndex(them.getCheckpoint());

    return otherIndex > index;
};

/**
 * randomUpdateCheckpoint - Get a random point on the CheckPoint
 * 
 * @param  Vehicle vehicle Our vehicle
 * @return Point
 */
AIUtils.prototype.randomUpdateCheckpoint = function(vehicle){

    var s = Math.random(0, 2);

    switch(s){
    case 0:
        return vehicle.getCheckpoint().getCenter();
        break;
    case 1:
        return vehicle.getCheckpoint().start;
        break;
    }
    return vehicle.getCheckpoint().end;
};

/**
 * getClosestLane - Returns a point (lane in the checkpoint) that is closest to the current position of your car.
 * 
 * @param  Checkpoint checkpoint Target checkpoint
 * @param  Point      pos        Position of your vehicle
 * 
 * @return Point              Closest point in the checkpoint
 */
AIUtils.prototype.getClosestLane = function(checkpoint, pos){

    var startMid = checkpoint.getCenter().midpoint(checkpoint.start);
    var endMid = checkpoint.getCenter().midpoint(checkpoint.end);

    if (pos.getDistanceSquared(endMid) > pos.getDistanceSquared(startMid)) {
        return startMid;
    }
    return endMid;
};

/**
 * getAlternativeLane - Returns a new point to head towards in the next checkpoint.
 * 
 * @param  Checkpoint checkpoint Target CheckPoint
 * @param  Point      pos        [description]
 * 
 * @return [type]                 [description]
 */
AIUtils.prototype.getAlternativeLane = function(checkpoint, pos){
    var startMid = checkpoint.getCenter().midpoint(checkpoint.start);
    var endMid = checkpoint.getCenter().midpoint(checkpoint.end);

    if (pos.getDistanceSquared(endMid) < pos.getDistanceSquared(startMid)) {
        if (pos.getDistanceSquared(checkpoint.getCenter()) < pos.getDistanceSquared(endMid)) {
            return checkpoint.getCenter();
        } else {
            return startMid;
        }
    } else if (pos.getDistanceSquared(checkpoint.getCenter()) < pos.getDistanceSquared(startMid)) {
        return checkpoint.getCenter();
    }
    return endMid;
};

/**
 * getLineSegmentIntersection - Return the intersecting point between to line segments
 *
 * @param  double x1 Line 1 starting x coordinate
 * @param  double y1 Line 1 starting x coordinate
 * @param  double x2 Line 1 ending x coordinate
 * @param  double y2 Line 1 ending y coordinate
 * @param  double x3 Line 2 starting x coordinate
 * @param  double y3 Line 2 starting y coordinate
 * @param  double x4 Line 2 ending x coordinate
 * @param  double y4 Line 2 ending y coordinate
 *
 * @return Point     Point of intersection between segments or false if none is found
 */
AIUtils.prototype.getLineSegmentIntersection = function(x1, y1, x2, y2, x3, y3, x4, y4){
    var denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

    if (denom == 0){
        // No intersection
        return false;
    }

    var ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    var ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;

    if (ua >= 0.0 && ua <= 1.0 && ub >= 0.0 && ub <= 1.0){
        return new Point((x1 + ua * (x2 - x1)), (y1 + ua * (y2 - y1)));
    }
    return false;
};

/* recalculateHeading included in Vehicle class */

