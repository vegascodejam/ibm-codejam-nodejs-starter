var getJson = (function () {

    var frames = [],
        users = [],
        obstacleObjs = [],
        renderObjs = [],
        labels = [],
        checkpoints = []
    ;
    return {
        frames: frames,
        users: users,
        obstacleObjs: obstacleObjs,
        renderObjs: renderObjs,
        labels: labels,
        checkpoints : checkpoints,

        processXHR: function (data) {

           var xhr = new XMLHttpRequest(),
                parsed;

            xhr.open("GET", data, true);

            xhr.onload = function(){

                var objNumber = 0,
                    carNumber = 0,
                    userInitialValues = [],
                    objectInitialValues = [],
                    obstacles = [],
                    vehicles = []
                    ;

                parsed = JSON.parse(this.responseText);

                getJson.emptyArrays([frames, renderObjs, checkpoints, labels, obstacleObjs, users]);

                // parse through the frames array in the json
                for(var pos in parsed.frames){

                    var position = parsed.frames[pos];
                    frames.push(position);
                }

                // parse through the objs array in json file
                for(var index in parsed.objs){
                    var object = parsed.objs[index];
                    renderObjs.push(object);
                }

                for(index in parsed.checkpoints){
                    checkpoints.push(parsed.checkpoints[index]);
                }

                for(var i=0;i < renderObjs.length;i++){
                    if(renderObjs[i].URL.indexOf("obstacles") != -1){
                        objNumber++;
                        obstacleObjs.push(new Obstacle(renderObjs[i].URL, renderObjs[i].rID, renderObjs[i].scale, renderObjs[i].opac));
                    }
                }

                for(var i = 0; i < renderObjs.length; i++){
                    if(renderObjs[i].URL.indexOf("cars") != -1){
                        carNumber++;
                        users.push(new User(renderObjs[i].URL, renderObjs[i].rID, renderObjs[i].scale, renderObjs[i].opac));
                    }
                }

                for(pos in frames){

                    //break frames down into object groups
                    $.each(frames[pos], function(i, val){
                        if(objNumber > 0){
                            var cockroach = val.slice(1, objNumber + 1);
                            obstacles.push(cockroach);
                        }

                        var carSlice1 = objNumber + 1;
                        var carSlice2 = (carSlice1 + carNumber);
                        //vehicles
                        var cars = val.slice(carSlice1, carSlice2);
                        vehicles.push(cars);

                    });
                }

                //loop through vehicles and populate each car array
                for(var i = 0; i < carNumber; i++){
                    var n = i;
                    $.each(vehicles, function(i, val){
                        users[n].coordinates.push(val[n]);
                    });
                }

                // loop through obstacles and create individual obstacle arrays
                for(var i = 0; i < objNumber; i++){
                    var o = i;
                    $.each(obstacles, function(i, val){
                        obstacleObjs[o].coordinates.push(val[o]);
                    });
                }

                for(index in renderObjs){
                    var images = renderObjs[index].URL;
                    preloadImage(images);
                }

                //change the id of each user object
                for(var i = 0; i < 6; i++){
                    users[i].id = i + 1;
                }

                // prepare initial data for each user object
                $.each(vehicles[0], function(i, val){
                    userInitialValues.push(val);
                });

                // append initial data to users
                $.each(users, function(i, val){
                    val.x = userInitialValues[i].x;
                    val.y = userInitialValues[i].y;
                    val.rotation = userInitialValues[i].rot;
                    val.username = userInitialValues[i].username;
                });

                $.each(users, function(i, val){
                    labels.push(new Label(val.id, val.x, val.y, val.username, 0.7));
                });

                for(var i = 0; i < carNumber; i++){
                    var p = i;
                    $.each(vehicles, function(i, val){
                        labels[p].coordinates.push(val[p]);
                    });
                }

                if(obstacles.length){
                    $.each(obstacles[0], function(i, val){
                        objectInitialValues.push(val);
                    });
                }

                // append initial data to obstaclesObjs
                $.each(obstacleObjs, function(i, val){
                    val.x = objectInitialValues[i].x;
                    val.y = objectInitialValues[i].y;
                    val.rotation = objectInitialValues[i].rot;
                });

                getJson.emptyArrays([userInitialValues,
                    objectInitialValues,
                    obstacles,
                    vehicles]);
            };

            xhr.addEventListener("load", this.prepareRace, false);

            xhr.send();

        },
        emptyArrays: function(myArray){
            $.each(myArray, function(i, val){
                val.length = 0;
            });
        },

        prepareRace: function(){
            //start rendering the race
            init();
        }
    }

})();


