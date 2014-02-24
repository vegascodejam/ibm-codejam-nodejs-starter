/**
 * Created with IntelliJ IDEA.
 * User: Mattsmith
 * Date: 1/31/14
 * Time: 3:28 PM
 * To change this template use File | Settings | File Templates.
 */
var canvas = document.getElementById("canvas"),
    vehicle = document.getElementById("vehicle"),
    ob = document.getElementById("obstacle"),
    ctxW  = canvas.width,
    ctxH = canvas.height,
    track = new Image(),
    context = canvas.getContext('2d'),
    polePosition = vehicle.getContext('2d'),
    objects = ob.getContext('2d'),
    currentFrame = 0
;

var globalAnimation,
    animationOn = {
        value:true
    },
    position = 0,
    currentUser = $.cookie('username'),
    n = 0,
    playing = {
        value:false
    },
    gameEnd = {
        value:false
    },
    cleared = {
        value: false
    }
;

function clear(){
    cleared.value =  true;
    if(cleared.value){
        //stop animations
        window.cancelAnimationFrame(globalAnimation);
        //put the image in the cookie and show it
        $('#placeholder').attr('src', $.cookie(track)).show();
        //reset these
        animationOn.value = true;
        playing.value = false;
        gameEnd.value = false;
        //clear the canvases
        context.clearRect(0,0,ctxW,ctxH);
        polePosition.clearRect(0,0,ctxW,ctxH);
        objects.clearRect(0,0,ctxW,ctxH);
        globalAnimation = 0;
        //empty and reset all the arrays and vars
        n = 0;
        position = 0;
        currentFrame = 0;
        currentUser = "";
        //clear the inspector
        clearInspector();
        //reset the form
        reset();
    }

}

function reset(){
    $('select#track').removeAttr('disabled');
    $('.submit').removeAttr('disabled');
    $('.replay').hide();
    $('.cancel').hide();
}

function init(){
    if(currentUser === "") currentUser = $.cookie('username');

    $('.cancel').on('click', clear);

    $('.replay').on('click', function(){
        playing.value = true;
        gameEnd.value = false;
        if(playing.value){
            animationOn.value = true;
            window.cancelAnimationFrame(globalAnimation);
            currentFrame = 0;
            position = 0;
            globalAnimation = 0;
            disable();
            $('.cancel').removeAttr('disabled').show();
            $(this).attr('disabled', 'disabled');

            start();
        }
    });

    start();
    getUser();

    playing.value = !playing.value;

    if(playing.value){
        var $cancel = $('.cancel');
        $('#loader').hide();
        $cancel.removeAttr('disabled').show();
        $('#placeholder').hide();
        $('#heads-up').show();
    }

}

function draw(car, context){
    track.src = getJson.renderObjs[0].URL;

    context.clearRect(0,0,ctxW,ctxH);

    context.drawImage(track, 0 , 0 );

    if(car !== undefined){
        drawRotatedImage(car.img, car.x, car.y, car.rotate , car.scale, car.opacity, context);
    }
}

//function drawCheckPoints(){
//    if(checkpoints !== undefined){
//        $.each(checkpoints, function(i, val){
//
//            drawLine(val.start.x, val.start.y, val.end.x, val.end.y, lightz);
//        })
//    }
//
//}

//disable form elements after submit
function disable(){

    $('.submit').attr('disabled','disabled');
    $('select#track').attr('disabled','disabled');

}

//enable them again
function enable(){
    $('.submit').removeAttr('disabled');
    $('select#track').removeAttr('disabled');
}

function getUser(){
    $.each(getJson.labels, function(i, val){
        var contains = (val.username.indexOf(currentUser)) > -1;
        if(contains) {
           n = val.id - 1;
        }
    });
}

function step(){
    position += 1;

    if(position > getJson.frames.length - 1){
        window.cancelAnimationFrame(globalAnimation);
        gameOver();
        return;
    }

    objectCoordinates();

    currentFrame++;

    $('.total_frames').text(currentFrame);
}

function objectCoordinates(){
    //vehicle coordinates
    $.each(getJson.users, function(i, val){
        val.x = val.coordinates[position].x;
        val.y = val.coordinates[position].y;
        val.rotate = val.coordinates[position].rot;
        val.opacity = val.coordinates[position].opacity;
        val.ontrack = val.coordinates[position].onTrack;
    });

    $.each(getJson.obstacleObjs, function(i, val){
        val.x = val.coordinates[position].x;
        val.y = val.coordinates[position].y;
        val.rotate = val.coordinates[position].rot;
        val.opacity = val.coordinates[position].opacity;
    });

    $.each(getJson.labels, function(i, val){
        val.x = val.coordinates[position].x - (getJson.users[i].img.width/2);
        val.y = val.coordinates[position].y;
    });
}



function drawObjects(){
    //draw vehicles
    //for some reason one vehicle needs to be on the main canvas
    draw(getJson.users[0], context);

    //loop through each of the users except the first one
    $.each(getJson.users.slice(1), function(i, val){
        draw(val, polePosition);
    });

    //draw obstacles
    $.each(getJson.obstacleObjs, function(i, val){
        draw(val, objects);
    });

    //draw nonAI
    $.each(getJson.labels, function(i, val){
        var contains = (val.username.indexOf(currentUser)) > -1;
        if(contains) {
            drawRect(val.x , val.y, val.opacity, context);
        }
    });
}

function start(){
    if(animationOn.value) {
        drawObjects();

        runInspector();

        globalAnimation = window.requestAnimationFrame(start);

        step();
    }
}


function runInspector(){
    $('.car').text(getJson.users[n].username);
    $('.x').text(getJson.users[n].x);
    $('.y').text(getJson.users[n].y);
    $('.rotation').text(getJson.users[n].rotate);
    $('.ontrack').text(getJson.users[n].ontrack);
}

function clearInspector(){
    $('.x').text(0);
    $('.y').text(0);
    $('.rotation').text(0);
    $('.ontrack').text(0);
    $('.total_frames').text(0);
}


function keys(){
    $( window ).on( "keydown", function( event ) {

        if(event.keyCode == 37){
            //step back
            stepBackwards();
        }

        if(event.keyCode == 39){
            //step forward
            stepForward();
        }
    });
}

function stepForward(){
    position += 1;

    objectCoordinates();

    runInspector();

    drawObjects();
}

function stepBackwards(){
    position -= 1;

    objectCoordinates();

    runInspector();

    drawObjects();
}

function gameOver(){
    if(playing.value){
        playing.value = false;
    }
    gameEnd.value = false;

    if(!playing.value){
        var $replay = $('.replay');
        enable();
        $('.cancel').attr('disabled', 'disabled');
        $replay.removeAttr('disabled').show();
    }
}

document.getElementById('canvas').addEventListener('click', function(){
    //flip the animationOn.value
    animationOn.value = !animationOn.value;

    if(animationOn.value) {
        start();
    }
    keys();

});












