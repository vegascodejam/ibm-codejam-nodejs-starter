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
 * Checkpoint - Represents a track checkpoint.  Each checkpoint must be crossed to complete a lap.
 * 
 * @package CodeRally
 * @version 1.0
 */

module.exports = Checkpoint;

var Point = require('./point');
var AIUtils = require('./aiutils');

var aiutils = new AIUtils;
var p = new Point;

//checkpoint object
function Checkpoint(checkPointState){
    this.start = new Point(checkPointState.start.x, checkPointState.start.y);
    this.end = new Point(checkPointState.end.x, checkPointState.end.y);
    this.width = checkPointState.width;
}

/**
 * getCenter - Get the center of the checkpoint
 * 
 * @return Point Midpoint between start and end of the checkpoint
 */
Checkpoint.prototype.getCenter = function() {

    return this.end.midpoint(this.start);
};

/**
 * getIntersectionPoint - Calculate the intersection between a point and rotation and this
 * 
 * @param  int  $rotation       Rotation of objects direction in degrees
 * @param  Point   $point       Location of object
 * @param  integer $threshold   Maximum distance threshold to be considered a valid intersection point
 * @return Point                Intersection point or false on failure
 */
Checkpoint.prototype.getIntersectionPoint = function(rotation, point, threshold) {
    threshold = typeof threshold !== 'undefined' ? threshold : 100;

    var o2x = Math.cos(p.deg2rad(rotation))  * 100;
    var o2y = Math.sin(p.deg2rad(rotation)) * 100;

    var ret = aiutils.getLineSegmentIntersection(
        this.start.x, this.start.y, this.end.x, this.end.y,
        point.x, point.y, o2x, o2y
    );

    if (!ret){
        // No intersection
        return false;
    }
    else if (ret.getDistanceSquared(point) > (threshold * threshold)){
        // Outside of the threshold
        return false;
    }

    return ret;
};
