    var dataUrl;

    function setup(){
        //support CORS
        $.support.cors = true;

        //inline colorbox for the form
        $(".inline").colorbox({inline:true, width:"50%", close: "save"});

        //set the initial track data
        var $firstTrackSelection = $('select#track option:first'),
            firstTrack = $firstTrackSelection.val(),
            firstTrackData = $firstTrackSelection.data('id'),
            attributes = $('#car-attributes input')
        ;

        $.cookie('track', firstTrack);
        $('input[id="trackId"]').val(firstTrackData);

        //if cookies exist use them!
        if($.cookie('username') && $.cookie('url')){
            var username = $.cookie('username');
            var url = $.cookie('url');
            $('.returning-user').text(username);
            $('.welcome').show();
            $('#username').val(username);
            $('#serviceUrl').val(url);
        }

        //if the values change update the cookie
        $( "#username" ).change(function() {
            var username = $(this).val();
            $.cookie('username', username, { expires: 14 });
        });

        //if the values change update the cookie
        $( "#serviceUrl" ).change(function() {
            var url = $(this).val();
            checkUrl(url);
            $.cookie('url', url, { expires: 14 });
        });

        //if the cookies don't exist and the user clicks submit pop the modal
        if(!$.cookie('username') && !$.cookie('url')){
            $('#user-info').show();
        }

        //check the car attributes for funny business
        $.each(attributes, function(i, val){
            $(val).blur(function(){
                if($(this).val() <= 0 || $(this).val() > 1000 ){
                    alert("Number cannot be negative, zero or over 1000");
                    if($(this).val() == 0){
                        $(this).val(20);
                    }else if($(this).val() > 1000){
                        $(this).val(1000);
                    }else{
                        $(this).val(Math.abs($(this).val()));
                    }
                }
            });
        });
    }

    setup();



    //the form submit logic
    $("#race").submit(function(e){

        clear();

        if(gameEnd.value){
            gameEnd.value = false;
        }
        //set this to a flag
//        $('.replay').hide();

        //flag to run local race data for testing
        var local = false;
        //serialize the query
        var querystring = $(this).serialize();

        //store user values
        var username = $('#username').val();
        var url = $('#serviceUrl').val();

        //extra check if user is not entered pop modal
        if(username === "" || url === ""){
            $(".user-settings").trigger("click");
            return false;
        }

        // set cookies to expire in 14 days if no cookie exists
        if(!$.cookie('username')) {
            $.cookie('username', username, { expires: 14 });
        }
        if(!$.cookie('url')) {
            $.cookie('url',url, { expires: 14 });
        }
        //disbale the submit and select
        disable();

        if(local){
            dataUrl = 'http://sll.barbariangroup.com/CodeRallyServer/';
        }else{
            dataUrl = '/CodeRallyServer/';
        }
            $.ajax({
                url: dataUrl,
                type: 'GET',
                crossDomain: true,
                data: querystring,
                success: function(xhr_data) {
                    $("#loader").show();

                    if (xhr_data.status == 'success') {

                        success(xhr_data);
                        log("success :", xhr_data);
                    }
                    else if(xhr_data.status == 'failure'){

                        $("#error-message").html("<strong>Error : </strong> " + xhr_data.reason);
                        $.colorbox({inline: true, href: "#error-message", onComplete: $("#loader").hide(), onClosed: enable()});

                        log("failure :", xhr_data);
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    log(xhr.status);
                    log(thrownError);
                    $("#error-message").html("<strong>Error : </strong> unable to join race");
                    $.colorbox({inline: true, href: "#error-message", onComplete: $("#loader").hide(), onClosed: enable()});
                }
            });

        e.preventDefault();
    });

    //if response is success
    function success(request){
        $.ajax({
            url: request.entrantUrl,
            type: 'GET',
            crossDomain: true,
            success: function(xhr_data) {
                if (xhr_data.status == 'pending') {
                    log("pending", xhr_data);
                    $('.whats-happening').text(randomResponse);

                    setTimeout(function() { success(request); }, 5000);
                }else{
                    log("success", xhr_data);
                    $('.whats-happening').text("Your simulation is complete...");
                    runRace(xhr_data.data_path);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                log(xhr.status);
                $("#error-message").html("<strong>Error : </strong> unable to join race");
                $.colorbox({inline: true, href: "#error-message", onComplete: $("#loader").hide(), onClosed: enable()});
                log(thrownError);
            }
        });
    }
    //when no longer pending
    function runRace(data){
        getJson.processXHR(data);
    }


    function randomResponse(){
        var responseMessage = [
        "Get ready to push the pedal to the bare metal!", 
        "Just a few more moments, so say we all", 
        "Everybody remember where we parked?",
        "Roads? Where we’re going, we don’t need roads", 
        "Stop trying to race me and race me!", 
        "The robots are coming, are you ready?", 
        "This is looking like an intense race", 
        "Ever meet one of those evil robots?", 
        "Send a tweet, this could take a few seconds", 
        "Snap a selfie while you wait", 
        "Queue up your favorite 80s sci-fi soundtrack", 
        "Ever wonder what F-1 would be like with robots drivers?", 
        ];
        return responseMessage[Math.floor(Math.random() * responseMessage.length)];
    }

    //validate the URL in the form
    function checkUrl(url) {
        //check if valid url
        var patt = /^(https?):\/\/((?:[a-z0-9.-]|%[0-9A-F]{2}){3,})(?::(\d+))?((?:\/(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})*)*)(?:\?((?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*))?(?:#((?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*))?$/i;
        if(!url.match(patt)){
            $( "#serviceUrl").val("");
            alert("URL is not valid.");
        }
        //check localhost
        if(url.indexOf("localhost") != -1){
            $( "#serviceUrl").val("");
            alert("URL is not valid. Localhost and IP Addresses are not allowed");
        }
        //check ip
        var patt1 = /\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}/g;
        var result = url.match(patt1);
        if(result){
            $( "#serviceUrl").val("");
            alert("URL is not valid. Localhost and IP Addresses are not allowed");
        }
    }

    //swap the images on select
    $('select#track').change(function(){

        var $place = $('#placeholder'),
            $this = ($(this).val()),
            track = $(this).find(':selected').data('id')
        ;

        $('input[id="trackId"]').val(track);
        $.cookie('track', $this);

        if(gameEnd.value = true || playing.value == true){
            clear();
            $('.replay').hide();
            $('.cancel').hide();
        }

        if(!$place.is(':visible')){
            $place.show();
        }

        //preload the images
        $('.whats-happening').text("loading image..");
        $('#loader').show();

        $place.attr('src', $this);

        $place.load(function(){
            $('#loader').hide();
        });
    });

    $(document).ready( function(){
        $(window).resize( respondCanvas );
        //resize the canvas
        function respondCanvas(){
            var $canvas = $('#canvas'),
                container = $canvas.parent(),
                aspectRatio = $canvas.width / $canvas.height,
                parentHeight = container.height,
                newHeight = parentHeight * aspectRatio;

            $canvas.css({'width': '100%', 'height': newHeight});
//            if($(window).width() < 992){
//                $canvas.css({'position': 'relative'});
//            }

        }
        //initial call
        respondCanvas();
    });



