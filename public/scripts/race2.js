var race = (function(){
    var canvas = document.getElementById("canvas"),
        vehicle = document.getElementById("vehicle"),
        ob = document.getElementById("obstacle"),
        ctxW  = canvas.width,
        ctxH = canvas.height,
        track = new Image(),
        context = canvas.getContext('2d'),
        polePosition = vehicle.getContext('2d'),
        objects = ob.getContext('2d'),
        currentFrame = 0,
        globalAnimation,
        n = 0,
        position = 0,
        currentUser = $.cookie('username')
        ;

    document.getElementById('canvas').addEventListener('click', function(){
        //flip the animationOn.value
        this.animationOn = !this.animationOn;

        if(this.animationOn) {
            start();
        }
        keys();

    });

    return{
        animationOn: true,
        processing: false,
        playing: false,
        gameEnd: false,
        cleared: false,

        clear: function(){
            this.cleared =  true;
            if(this.cleared){
                //stop animations
                window.cancelAnimationFrame(globalAnimation);
                //put the image in the cookie and show it
                $('#placeholder').attr('src', $.cookie(track)).show();
                //reset these
                animationOn = true;
                playing = false;
                gameEnd = false;
                //clear the canvases
                context.clearRect(0,0,ctxW,ctxH);
                polePosition.clearRect(0,0,ctxW,ctxH);
                objects.clearRect(0,0,ctxW,ctxH);
                globalAnimation = 0;
                //empty and reset all the arrays and vars
                n = 0;
                position = 0;
                currentFrame = 0;
                //clear the inspector
                this.clearInspector();
                //reset the form
                this.reset();
            }

        },

        reset: function(){
            $('select#track').removeAttr('disabled');
            $('input[type="submit"]').removeAttr('disabled');
            $('.replay').hide();
            $('.cancel').hide();
        },

        init: function(){

            $('.cancel').on('click', this.clear);

            $('.replay').on('click', function(){

                this.playing = true;
                this.gameEnd = false;

                if(this.playing){
                    animationOn = true;
                    window.cancelAnimationFrame(globalAnimation);
                    currentFrame = 0;
                    position = 0;
                    globalAnimation = 0;
                    $('.cancel').removeAttr('disabled').show();
                    $(this).attr('disabled', 'disabled');

                    this.disable();
                    this.start();
                }
            });

            this.start();

            this.processing = !this.processing;
            this.playing = !this.playing;

            if(this.playing){
                var $cancel = $('.cancel');
                $('#loader').hide();
                $cancel.removeAttr('disabled').show();
                $('#placeholder').hide();
                $('#heads-up').show();
            }

        },

        draw: function(car, context){
            track.src = getJson.renderObjs[0].URL;

            context.clearRect(0,0,ctxW,ctxH);

            context.drawImage(track, 0 , 0 );

            if(car !== undefined){
                drawRotatedImage(car.img, car.x, car.y, car.rotate , car.scale, car.opacity, context);
            }
        },

        //disable form elements after submit
        disable: function(){
            if(this.processing){
                $('input[type="submit"]').attr('disabled','disabled');
                $('select#track').attr('disabled','disabled');
            }

        },

        //enable them again
        enable: function(){
            $('input[type="submit"]').removeAttr('disabled');
            $('select#track').removeAttr('disabled');
        },

        step: function(){
            position += 1;

            if(position > getJson.frames.length - 1){
                window.cancelAnimationFrame(globalAnimation);
                this.gameOver();
                return;
            }

            this.objectCoordinates();

            currentFrame++;

            $('.total_frames').text(currentFrame);
        },

        objectCoordinates: function(){
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
        },

        drawObjects: function(){
            //draw vehicles
            var $this = this;
            //for some reason one vehicle needs to be on the main canvas
            this.draw(getJson.users[0], context);

            //loop through each of the users except the first one
            $.each(getJson.users.slice(1), function(i, val){
                $this.draw(val, polePosition);
            });

            //draw obstacles
            $.each(getJson.obstacleObjs, function(i, val){
                $this.draw(val, objects);
            });

            //draw nonAI
            $.each(getJson.labels, function(i, val){
                var contains = (val.username.indexOf(currentUser)) > -1;
                if(contains) {
                    drawRect(val.username, val.x , val.y, val.opacity, context);
                }
            });
        },

        start: function(){
            if(this.animationOn) {
                this.drawObjects();

                this.runInspector();

                globalAnimation = window.requestAnimationFrame(this.start);

                this.step();
            }
        },


        runInspector: function(){
            $('.car').text(getJson.users[n].username);
            $('.x').text(getJson.users[n].x);
            $('.y').text(getJson.users[n].y);
            $('.rotation').text(getJson.users[n].rotate);
            $('.ontrack').text(getJson.users[n].ontrack);
        },

        clearInspector: function(){
            $('.x').text(0);
            $('.y').text(0);
            $('.rotation').text(0);
            $('.ontrack').text(0);
            $('.total_frames').text(0);
        },

        keys: function(){
            $( window ).on( "keydown", function( event ) {

                if(event.keyCode == 37){
                    //step back
                    this.stepBackwards();
                }

                if(event.keyCode == 39){
                    //step forward
                    this.stepForward();
                }
            });
        },

        stepForward: function(){
            position += 1;

            this.objectCoordinates();

            this.runInspector();

            this.drawObjects();
        },

        stepBackwards: function(){
            position -= 1;

            this.objectCoordinates();

            this.runInspector();

            this.drawObjects();
        },

        gameOver: function(){
            if(playing){
                this.playing = false;
            }
            this.gameEnd = false;

            if(!playing){
                var $replay = $('.replay');
                enable();
                $('.cancel').attr('disabled', 'disabled');
                $replay.removeAttr('disabled').show();
            }
        }
    }

})();












