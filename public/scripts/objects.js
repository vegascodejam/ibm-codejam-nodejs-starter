/**
 * Created with IntelliJ IDEA.
 * User: Mattsmith
 * Date: 1/31/14
 * Time: 3:03 PM
 * To change this template use File | Settings | File Templates.
 */
function User (image, id, scale, opacity) {
    this.img = new Image();   // Create new img element
    this.img.onload = function(){
        // execute drawImage statements here
    };
    this.img.src = image; // Set source path
    this.id = id;
    this.scale = scale;
    this.opacity = opacity;
    this.x = null;
    this.y = null;
    this.rotation = null;
    this.username = null;
    this.coordinates = [];
    this.ontrack = null;
}

function Obstacle(image, id, scale, opacity){
    this.img = new Image();   // Create new img element
    this.img.onload = function(){
        // execute drawImage statements here
    };
    this.img.src = image; // Set source path
    this.id = id;
    this.scale = scale;
    this.opacity = opacity;
    this.x = null;
    this.y = null;
    this.rotation = null;
    this.coordinates = [];
}

function Light (image, id, scale, opacity) {
    this.img = new Image();   // Create new img element
    this.img.onload = function(){
        // execute drawImage statements here
    };
    this.img.src = image; // Set source path
    this.id = id;
    this.scale = scale;
    this.opacity = opacity;
    this.x = null;
    this.y = null;
    this.rotation = null;
    this.coordinates = [];
}

function Label (id, x, y, username, opacity) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.username = username;
    this.opacity = opacity;
    this.coordinates = [];
}