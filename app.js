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
 * app.js - Core application and routing
 * 
 * @package CodeRally
 * @version 1.0
 */

    var express = require('express');
    var routes = require('./routes');
    var http = require('http');
    var path = require('path');

    //custom modules
    var Vehicle = require('./code_rally/vehicle');
    var Track = require('./code_rally/track');
    var MyVehicleAi = require('./code_rally/myVehicleAI');



    var app = express();

    // all environments
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.cookieParser('S3CRE7'));
    app.use(express.session());
    app.use(app.router);
    app.use('/', express.static(path.join(__dirname, 'public')));

    // development only
    if ('development' == app.get('env')) {
      app.use(express.errorHandler());
    }

//    app.get('/', routes.index);


    app.post('/', function(request, response){

        var task = request.body;

        if(task.data.length !== 0){
            var parseData = JSON.parse(task.data);

            var extraData = parseData.extra;

            var vehicleData = request.session.vehicle || parseData.vehicle;

            var trackData

            if(parseData.track !== undefined){
                trackData = parseData.track;
                request.session.track = trackData;
            }else{
                trackData = request.session.track;
            }

            var requestId  = request.session.requestId || 0;
            requestId++;

            var vehicle = new Vehicle();
            var track = new Track(trackData);
            var mynewAI = new MyVehicleAi(vehicle, track, extraData);

            vehicle.update(vehicleData);

            response.set('Content-Type', 'application/json');
            if(task.action == 'clear'){
                response.send(200, {status: "clear"});
            }else if(typeof  mynewAI[task.action] == 'function'){
                response.send(200, mynewAI[task.action]());
            }else{
                response.send(500, {status: "failure"});
            }

            request.session.vehicle = vehicleData;
            request.session.requestId = requestId;
        }
    });


    http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
    });

