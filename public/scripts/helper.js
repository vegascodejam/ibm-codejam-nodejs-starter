function drawRotatedImage(image, x, y, angle, scale, opacity, context) {

    context = canvas.getContext('2d');
    // save the current co-ordinate system
    // before we screw with it
    context.save();

    // move to the middle of where we want to draw our image
    context.translate(x, y);

    // rotate around that point, converting our
    // angle from degrees to radians
    context.rotate(angle);

    context.scale(scale, scale);

    context.globalAlpha = opacity;

    // draw it up and to the left by half the width
    // and height of the image
    context.drawImage(image, -(image.width/2), -(image.height/2));

    // and restore the co-ords to how they were when we began
    context.restore();
}

function drawRect(x, y, opacity, context){
    //get the length of the text string so we can size the box better
//    var textLength = text !== null ? text.length : 15;
//    var newTextLength = (textLength * 8) + 10;
//    var newX = x - (newTextLength/3);
    //set the font size and face
    context.font = "14pt Arial";

    //set box stroke
    context.strokeStyle = "#000";

    //set line width
    context.lineWidth = 1;

    //begin path
    context.beginPath();

    //set the fill color
    context.fillStyle = "#ccc";

    //this is where I'll box will move when animated
    context.moveTo(x,y);

    //set the box coordinates
    context.rect(x, y + 20, 140 , 40);

    //fill the box
    context.fill();

    // stroke the box
    context.stroke();

    //color of the text
    context.fillStyle = "#000";

    //opacity of the fill
//    context.globalAlpha = opacity;

    //coordinates for the text
    context.fillText("Your Vehicle", x + 8, y + 45 );
}

function drawLine(startX, startY, endX, endY, context){
    context.lineWidth = 1;
    context.strokeStyle = "#ed1c24";
    context.fillStyle = "#ed1c24";
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);

    context.stroke();
}

//preload the images
var preloadImage = function (url) {
    try {
        var _img = new Image();
        _img.src = url;
    } catch (e) { }
}

window.log=function(){log.history=log.history||[];log.history.push(arguments);if(this.console){console.log(Array.prototype.slice.call(arguments))}};
window.logStart=function(event,message){if(typeof window.debug!='undefined' && window.debug) {logStart.initTime=logStart.initTime||new Date().getTime();logStart.start=logStart.start||new Array();if(event!=''){var startTime = new Date().getTime();log("****** "+event+" Start	" + (startTime - logStart.initTime) + ((typeof message != 'undefined')?" - " + message:''));logStart[event] = startTime;if (typeof console.time != 'undefined') { console.time(event); }}}};
window.logEnd=function(event, message) {if (typeof window.debug != 'undefined' && window.debug) {var endTime = new Date().getTime();log("****** "+event+" End	" + (endTime - logStart.initTime)+"	duration:"+(endTime-logStart[event])+((typeof message != 'undefined')?" - " + message:''));if (typeof console.time != 'undefined') { console.timeEnd(event); }}};
window.logStart('');