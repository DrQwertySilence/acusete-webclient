/**
 * WEBSOCKET STATES:
 * 0 = "CONNECTING";
 * 1 = "OPEN";
 * 2 = "CLOSING";
 * 3 = "CLOSED";
 * ? = "UNKNOW";
 */
var G_WEBSOCKET = null;
var G_URI = "ws://localhost:1234";

/**
 * Binary messages:
 */
var BM_TEST_8_TO_32 = 50

/**
 * Set the websocket url to the textbox 'wsuri'.
 */
function setWsUri() {
    if (G_WEBSOCKET)
        G_WEBSOCKET.close();
    G_URI = "ws://" + $("#ip").val() + ":" + $("#port").val();
    toggleSetURIDialog()
    // document.getElementById("wsuri").innerHTML = wsUri;
}

/**
 * If 16,777,215 then [0x00,0xff,0xff,0xff]
 * If 4,294,967,040 then [0xff,0xff,0xff,0x00]
 * Works with any array size.
 */
function binary_int32ToByteArray(integer32) {
    var byteArray = new Uint8Array(4);
    var number = integer32;
    var temp = 0;
    var operationLength = byteArray.length - 1
    
    for (var i = 0, j = operationLength; i < operationLength; ++i, --j) {
        if (number >= Math.pow(0x100, j)) {
            temp = Math.floor(number / Math.pow(0x100, j));
            byteArray[i] = temp;
            number = number - (temp * Math.pow(0x100, j));
            temp = 0;
        }
    }
    byteArray[operationLength] = number;
    
    return byteArray;
}

/**
 * 
 */
function binary_byteArrayToInt32(byteArray) {
    var int32 = 0;
    //
    for (var i = 0; i < byteArray.length; ++i)
        int32 += byteArray[i] * Math.pow(0x100, byteArray.length - i - 1);
    //
    return int32;
}

/**
 * 
 */
function onBinaryMessage(evt) {
    var bytearray = new Uint8Array(event.data);
    
    if (bytearray[0] == BM_TEST_8_TO_32) {
        var dataOffset = 2
        var number = 0;
        
        for (var i = 0; i < bytearray[1]; ++i)
            number += bytearray[i + dataOffset] * Math.pow(0x100, i);
        
        var test_number = binary_byteArrayToInt32([0xff,0xff,0xff,0x00]);
        alert(test_number);
        alert(binary_int32ToByteArray(test_number))
        var bytearrayTEST = binary_int32ToByteArray(test_number);
        alert(binary_byteArrayToInt32(bytearrayTEST))
    }
    return;
}

/**
 * Process json message from server.
 */
function onTextMessage(evt) {
    var serverObj = JSON.parse(evt.data);
    var serverMsg = serverObj.message;
    var data = serverObj.data;
    
    if (serverMsg == "alert")
        shouldAlert(data.value)
    else if (serverMsg == "displayTimers")
        displayTimers(data);
    else if (serverMsg == "displaySensorData")
        displaySensorData(data);
    else if (serverMsg == "recordedDataForGraph")
        drawGraph(data);
    else if (serverMsg == "timerResumed")
        onTimerResumed(data.id);
    else if (serverMsg == "timerPaused")
        onTimerPaused(data.id);
    else if (serverMsg == "timerStopped")
        onTimerStopped(data.id);
    else if (serverMsg == "timerRestarted")
        onTimerRestarted(data.id);
    else if (serverMsg == "timerDestroyed")
        onTimerDestroyed(data.id);
}

/**
 * Init and configure the connection with the server.
 */
function initWebSocket() {
    try {
        if (typeof MozWebSocket == 'function')
            G_WEBSOCKET = MozWebSocket;
        if ( G_WEBSOCKET && G_WEBSOCKET.readyState == 1 )
            G_WEBSOCKET.close();
        G_WEBSOCKET = new WebSocket( G_URI );
        G_WEBSOCKET.binaryType = "arraybuffer";
        
        G_WEBSOCKET.onopen = function (evt) {
            ui_onopen()
        };
        G_WEBSOCKET.onclose = function (evt) {
            ui_onclose()
        };
        G_WEBSOCKET.onmessage = function (evt) {
            if(evt.data instanceof ArrayBuffer) {
                onBinaryMessage(evt);
            } else {
                onTextMessage(evt);
            }
        };
        G_WEBSOCKET.onerror = function (evt) {
        };
    } catch (exception) {
    }
}

/**
 * Close the connection with the server.
 */
function stopWebSocket() {
    if (G_WEBSOCKET)
        G_WEBSOCKET.close();
}

/**
 * 
 */
function loop() {
    if (G_WEBSOCKET != null && G_WEBSOCKET.readyState == 1) {
        updateTimers();
        updateSensorData(0);
    }
}

var G_INTERVAL = setInterval(function(){loop()}, 1000);

/****************************************************************
 * CLIENT TO SERVER
 ****************************************************************/

/**
 * Get timers from server and display them on the webpage.
 */
function updateTimers() {
    G_WEBSOCKET.send( "/getTimers" );
}

/**
 * Tells the server to send device data
 */
function updateSensorData(deviceNumber) {
    G_WEBSOCKET.send( "/getSensorData "+ deviceNumber);
}

/**
 * Tells to the server to stop the hard (warning) and all soft alarms
 * The function should be splited up
 */
function stop() {
    if ( G_WEBSOCKET != null && G_WEBSOCKET.readyState == 1)
        G_WEBSOCKET.send( "/alert stop" );
}

/** 
 * Tells to the server to set a soft alarm timer.
 * I don't know, it needs a refactor (take args. Ex.: hours, minutes, seconds).
 */
function setTimer() {
    if ( G_WEBSOCKET != null && G_WEBSOCKET.readyState == 1) {
        var description = $("#timerDescription").val();
        var h = $("#timerH").val();
        var m = $("#timerM").val();
        var s = $("#timerS").val();
        var ms = (h * 3600000) + (m * 60000) + (s * 1000);
        
        // var message = {message: "setTimer", msgData: {description: description, milliseconds: ms}};
        G_WEBSOCKET.send( "/setTimer " + ms + " " + description );
    }
    displayaddtimerdialog(false)
}

/**
 * Tells to the server to resume a timer.
 */
function resumeTimer(timerId) {
    G_WEBSOCKET.send( "/resumeTimer " + timerId );
}

/**
 * Tells to the server to pause a timer.
 */
function pauseTimer(timerId) {
    G_WEBSOCKET.send( "/pauseTimer " + timerId );
}

/**
 * Tells to the server to stop a timer.
 */
function stopTimer(timerId) {
    G_WEBSOCKET.send( "/stopTimer " + timerId );
}

/**
 * Tells to the server to restart a timer.
 */
function restartTimer(timerId) {
    G_WEBSOCKET.send( "/restartTimer " + timerId );
}

/**
 * Tells to the server to destroy a timer.
 */
function destroyTimer(timerId) {
    G_WEBSOCKET.send( "/destroyTimer " + timerId );
}


/****************************************************************
 * SERVER TO CLIENT
 ****************************************************************/

/**
 * 
 */
function shouldAlert(state) {
    if (state)
        $("#alert").css("background-color", "orange");
    else
        $("#alert").css("background-color", "gray");
}

/**
 * 
 */
function drawTimer(frame, id, description, time) {
    timeStr = moment.tz(Number(time), "").format("HH:mm:ss");

    if (description == "")
        description = "????";
    
    var timer = "<div id='timer-" + id + "' class='timer col-xs-6 col-md-2'><div class='timer-inner'>" +
    "<div class='row'><span id='timer-" + id + "-description' class='bigLabel col-xs-12 col-md-12'>" + description + "</span></div>" +
    "<div class='row'><span id='timer-" + id + "-time' class='bigLabel col-xs-12 col-md-12'>" + timeStr + "</span></div>" +
    "<div class='row'>" +
    "<button id='timer-"+ id +"-control-pause' class='pause btn btn-default col-xs-6 col-md-6' onClick='pauseTimer(" + id + ")'><img src='./rsc/img/icons/timer_pause.png' width='20' hight='20' /></button>" +
    "<button id='timer-"+ id +"-control-resume' class='resume btn btn-default col-xs-6 col-md-6' onClick='resumeTimer(" + id + ")'><img src='./rsc/img/icons/timer_resume.png' width='20' hight='20' /></button>" +
    "<button id='timer-"+ id +"-control-stop' class='stop btn btn-default col-xs-6 col-md-6' onClick='stopTimer(" + id + ")'><img src='./rsc/img/icons/timer_stop.png' width='20' hight='20' /></button>" +
    "<button id='timer-"+ id +"-control-restart' class='restart btn btn-default col-xs-6 col-md-6' onClick='restartTimer(" + id + ")'><img src='./rsc/img/icons/timer_restart.png' width='20' hight='20' /></button>" +
    "<button id='timer-"+ id +"-control-destroy' class='destroy btn btn-default col-xs-6 col-md-6' onClick='destroyTimer(" + id + ")'><img src='./rsc/img/icons/timer_destroy.png' width='20' hight='20' /></button></div></div>" +
    "</div>";

    $(frame).append(timer);
    var domId = "#timer-" + id;
    $(domId).find(domId + "-control-resume").css("display", "none");
    $(domId).find(domId + "-control-restart").css("display", "none");
    $(domId).find(domId + "-control-destroy").css("display", "none");
}

/**
 *
 */
function displayTimers(timerArray) {
    var frameID = "#timerZone";
    var frame = $(frameID);
    
    var clientTimers = frame.children();
    var numberOfTimers = clientTimers.length;
    var html = frame.html();
    
    for (var i in timerArray) {
        var id = timerArray[i].ID;
        var description = timerArray[i].description
        var time = timerArray[i].remainingTime;
        
        if (frame.html() == "") {
            drawTimer(frameID, id, description, time);
            continue;
        }
        var timerFound = frame.find("#timer-" + id);
        if (timerFound.length == 0) {
            drawTimer(frameID, id, description, time);
        } else {
            $("#timer-" + id + "-time").html(moment.tz(Number(time), "").format("HH:mm:ss"));
            continue;
        }
    }
}

/**
 *
 */
function displaySensorData(dataArray) {
    $("#sensorData").html("");
    
    for (var i in dataArray) {
        var html = "<span>";
        html += "ID: " + dataArray[i].id;
        // html += " Time: " + moment.unix(Number(dataArray[i].time)).format("YYYY-MM-DD HH:mm:ss");
        html += " PPM: " + dataArray[i].ppm;
        html += " Temperatures:";
        for (var j in dataArray[i].temperatures) {
            html += " " + parseFloat(dataArray[i].temperatures[j]).toFixed(2);
        }
        html += "</span><br />"
    }
    
    $("#sensorData").html(html)
}

/**
 *
 */
function drawGraph(devicesRecords) {
    for (var i in devicesRecords)
        graph_drawGraphFromObject(devicesRecords[i]);
}

/**
 * 
 */
function getRecordedData() {
    if ( G_WEBSOCKET != null && G_WEBSOCKET.readyState == 1) {
        var start = (new Date($("#input-daterange-start").val() + " 00:00:00")).getTime() / 1000;
        var end = (new Date($("#input-daterange-start").val() + " 23:59:59")).getTime() / 1000;
        if (start < 0)
            start = 0;
        if (end < 0)
            end = 0;
        G_WEBSOCKET.send("/getRecordedData "+ "Derp " + start + " " + end); // a complete day
    }
}

/**
 * 
 */
function onTimerResumed(timerId) {
    var domId = "#timer-" + timerId;
    $(domId).find(domId + "-control-resume").css("display", "none");
    $(domId).find(domId + "-control-pause").css("display", "block");
}

/**
 * 
 */
function onTimerPaused(timerId) {
    var domId = "#timer-" + timerId;
    $(domId).find(domId + "-control-pause").css("display", "none");
    $(domId).find(domId + "-control-resume").css("display", "block");
}

/**
 * 
 */
function onTimerStopped(timerId) {
    var domId = "#timer-" + timerId;
    $(domId).find(domId + "-control-resume").css("display", "none");
    $(domId).find(domId + "-control-pause").css("display", "none");
    $(domId).find(domId + "-control-stop").css("display", "none");
    $(domId).find(domId + "-control-restart").css("display", "block");
    $(domId).find(domId + "-control-destroy").css("display", "block");
}

/**
 * 
 */
function onTimerRestarted(timerId) {
    var domId = "#timer-" + timerId;
    $(domId).find(domId + "-control-restart").css("display", "none");
    $(domId).find(domId + "-control-destroy").css("display", "none");
    $(domId).find(domId + "-control-stop").css("display", "block");
    $(domId).find(domId + "-control-pause").css("display", "block");
}

/**
 * 
 */
function onTimerDestroyed(timerId) {
    var domId = "#timer-" + timerId;
    $(domId).remove();
}