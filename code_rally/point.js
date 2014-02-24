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
 * Point - Helper class for points on the race grid.
 * 
 * @package CodeRally
 * @version 1.0
 */

module.exports = Point;

var AIUtils = require('./aiutils');

var aiutils = new AIUtils;

//point object
function Point(x,y){
    this.x = x;
    this.y = y;
}

Point.prototype.deg2rad = function(degrees){
    return degrees * Math.PI/180;
};

Point.prototype.rad2deg = function(radian){
    return radian * 180/Math.PI;
};

Point.prototype.get = function(){
    return {x :this.x, y : this.y};
};

/**
 * midpoint - Get the midpoint between $p and this
 * 
 * @param  Point  $p Location to compare against
 * @return Point Location equadistant between the points
 */
Point.prototype.midpoint = function(p) {
    return new Point((this.x + p.x) / 2, (this.y + p.y) / 2);
};

/**
 * getDistance - Get distance between $p and this
 *
 * @param  Point  $p Location to compare against
 * @return float  Distance on the grid
 */
Point.prototype.getDistance = function(p) {
    return Math.sqrt(this.getDistanceSquared(p));
};

/**
 * getDistanceSquared - Get distance between $p and this squared
 * 
 * @param  Point  $p Location to compare against
 * @return int  Distance squared on the grid
 */
Point.prototype.getDistanceSquared = function(p) {
    return ((this.x - p.x) * (this.x - p.x)) + ((this.y - p.y) * (this.y - p.y));
};


/**
 * getHeadingTo - Get a heading between $p and this
 * 
 * @param  Point  $p Location to compare against
 * @return float Heading in degrees
 */
Point.prototype.getHeadingTo = function(p) {
    var degrees = this.rad2deg(Math.atan2(p.y - this.y, p.x - this.x));

    if (degrees < 0) {
        degrees += 360;
    }

    return degrees;
};

/**
 * intersection - Get intersection point between this point based on a rotation and
 * the line formed by the top and bottom points.
 * 
 * @param  int $rotation Rotation in degrees
 * @param  Point  $top      Top coordinate of intersecting line
 * @param  Point  $bottom   Bottom coordinate of intersecting line
 * 
 * @return Point           Intersecting point.
 */
Point.prototype.intersection = function(rotation, top, bottom) {
    var o2x = Math.cos( this.deg2rad(rotation) * 100);
    var o2y = Math.sin( this.deg2rad(rotation) * 100);

    return aiutils.getLineSegmentIntersection(this.x, this.y, o2x, o2y, top.x, top.y, bottom.x, bottom.y);
};