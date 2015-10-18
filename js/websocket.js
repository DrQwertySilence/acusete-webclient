/****************************************************************
 * UGLY GLOBALS!!!
 ****************************************************************/
var G_DEBUG = false;

/**
 * WEBSOCKET STATES:
 * 0 = "CONNECTING";
 * 1 = "OPEN";
 * 2 = "CLOSING";
 * 3 = "CLOSED";
 * ? = "UNKNOW";
 */
var G_WEBSOCKET = null;
var G_URI = "ws://drqwertysilence.no-ip.biz:1234";

/**
 * Binary messages:
 * /setTimer = 
 */
var BM_TEST_8_TO_32 = 50
var BM_SET_TIMER = 100

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
  var integer32 = 0;
  //
  for (var i = 0; i < byteArray.length; ++i)
    integer32 += byteArray[i] * Math.pow(0x100, byteArray.length - i - 1);
  //
  return integer32;
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
 *
 */
function onTextMessage(evt) {
  //
  var serverObj = "";
  var serverMsg = "";
  if (evt.data[0] != "/") {
    serverObj = JSON.parse(evt.data);
    serverMsg = serverObj.message;
  }
  //
  var message = evt.data.split(" ");
  var message_command = message[0];
  var message_args = message.slice(1, message.length);
  //
  if (serverMsg == "alert") {
    shouldAlert_2(serverObj.msgData.value)
  } else if (serverMsg == "displayTimers") {
    displayTimers_2(serverObj.msgData);
  } else if (serverMsg == "displaySensorData") {
    displaySensorData_2(serverObj.msgData);
  } else if (serverMsg == "recordedDataForGraph") {
    drawGraph_2(serverObj.msgData);
  } else if (message_command == "/alert") {
    shouldAlert(message_args)
  } else if (message_command == "/displayTimers") {
    displayTimers(message_args);
  } else if (message_command == "/displaySensorData") {
    displaySensorData(message_args)
  } else if (message_command == "/recordedDataForGraph") {
    drawGraph(message_args);
  } else if (message_command == "/timerResumed") {
    onTimerResumed(message_args[0]);
  } else if (message_command == "/timerPaused") {
    onTimerPaused(message_args[0]);
  } else if (message_command == "/timerStopped") {
    onTimerStopped(message_args[0]);
  } else if (message_command == "/timerRestarted") {
    onTimerRestarted(message_args[0]);
  } else if (message_command == "/timerDestroyed") {
    onTimerDestroyed(message_args[0]);
  } else {
    alert(evt.data);
    alert(JSON.parse(evt.data).message);
  }
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
function tick() {
  if (G_WEBSOCKET != null && G_WEBSOCKET.readyState == 1) {
    updateTimers();
    updateSensorData(0);
  }
}

var G_INTERVAL = setInterval(function(){tick()}, 1000);

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
    var h = $("#timerH").val();
    var m = $("#timerM").val();
    var s = $("#timerS").val();
    var ms = (h * 3600000) + (m * 60000) + (s * 1000);
    //
    G_WEBSOCKET.send( "/setTimer " + ms );
  }
  displayaddtimerdialog(false)
}

/**
 *
 */
function resumeTimer(timerId) {
  G_WEBSOCKET.send( "/resumeTimer " + timerId );
}

/**
 *
 */
function pauseTimer(timerId) {
  G_WEBSOCKET.send( "/pauseTimer " + timerId );
}

/**
 *
 */
function stopTimer(timerId) {
  G_WEBSOCKET.send( "/stopTimer " + timerId );
}

/**
 *
 */
function restartTimer(timerId) {
  G_WEBSOCKET.send( "/restartTimer " + timerId );
}

/**
 *
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
function shouldAlert(args) {
  if (args.length == 0) {
    $("#alert").css("background-color", "orange");
  } else if (args[0] == "up") {
    $("#alert").css("background-color", "orange");
  } else if (args[0] == "down") {
    $("#alert").css("background-color", "gray");
  }
}

function shouldAlert_2(state) {
  if (state)
    $("#alert").css("background-color", "orange");
  else
    $("#alert").css("background-color", "gray");
}

/**
 *
 */
function drawTimer(frame, id, time) {
  timeStr = moment.unix(Number(time)).format("HH:mm:ss Z");

  var timer = "<div id='timer-" + id + "' class='timer col-xs-6 col-md-2'><div class='timer-inner'>" +
  "<div class='row'><span id='timer-" + id + "-time' class='bigLabel col-xs-12 col-md-12'>" + timeStr + "</span></div>" +
  "<div class='row'>" +
  "<button id='timer-"+ id +"-control-pause' class='pause btn btn-default col-xs-6 col-md-6' onClick='pauseTimer(" + id + ")'>Pause</button>" +
  "<button id='timer-"+ id +"-control-resume' class='resume btn btn-default col-xs-6 col-md-6' onClick='resumeTimer(" + id + ")'>Resume</button>" +
  "<button id='timer-"+ id +"-control-stop' class='stop btn btn-default col-xs-6 col-md-6' onClick='stopTimer(" + id + ")'>Stop</button>" +
  "<button id='timer-"+ id +"-control-restart' class='restart btn btn-default col-xs-6 col-md-6' onClick='restartTimer(" + id + ")'>Restart</button>" +
  "<button id='timer-"+ id +"-control-destroy' class='destroy btn btn-default col-xs-6 col-md-6' onClick='destroyTimer(" + id + ")'>Destroy</button></div></div>" +
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
function displayTimers(args) {
  // SERVER
  serverTimers = args;
  if (serverTimers[0] == "")
    return;
  
  // HTML
  var frameID = "#timerZone";
  var frame = $(frame);

  var clientTimers = frame.children();
  var numberOfTimers = clientTimers.length;
  var html = frame.html();

  for (var i in serverTimers) {
    var timerData = serverTimers[i].split(";");
    var id = timerData[0];
    var time = timerData[1];

    if (frame.html() == "") {
      drawTimer(frameID, id, time);
      continue;
    }
    var timerFound = frame.find("#timer-" + id);
    var timerData = serverTimers[i].split(";");
    if (timerFound.length == 0) {
      drawTimer(frameID, id, time);
    } else {
      $("#timer-" + id + "-time").html(time);
      continue;
    }
  }
}

function displayTimers_2(timerArray) {
  var frameID = "#timerZone";
  var frame = $(frameID);

  var clientTimers = frame.children();
  var numberOfTimers = clientTimers.length;
  var html = frame.html();

  for (var i in timerArray) {
    var id = timerArray[i].ID;
    var time = timerArray[i].remainingTime;

    if (frame.html() == "") {
      drawTimer(frameID, id, time);
      continue;
    }
    var timerFound = frame.find("#timer-" + id);
    if (timerFound.length == 0) {
      drawTimer(frameID, id, time);
    } else {
      $("#timer-" + id + "-time").html(moment.unix(Number(time)).format("HH:mm:ss Z"));
      continue;
    }
  }
}

/*
html +=
"<div id='timer-" + timerData[0] + "' class='timer col-xs-6 col-md-2'><div class='timer-inner'>" +
"<div class='row'><span id='timersTEST' class='bigLabel col-xs-12 col-md-12'>" + timerData[1] + "</span></div>" +
"<div class='row'><button class='pause btn btn-default col-xs-6 col-md-6' onClick='pauseTimer(" + timerData[0] + ")'>Pause</button>" +
"<button class='resume btn btn-default col-xs-6 col-md-6 hidden' onClick='resumeTimer(" + timerData[0] + ")'>Resume</button>" +
"<button class='stop btn btn-default col-xs-6 col-md-6' onClick='stopTimer(" + timerData[0] + ")'>Stop</button>" +
"<button class='restart btn btn-default col-xs-6 col-md-6 hidden' onClick='restartTimer(" + timerData[0] + ")'>Restart</button></div></div>" +
"</div>";
*/

/**
 *
 */
function OLD_displayTimers(args) {
  $("#timers").html("");
  var html = "";
  for (var i in args) {
    html += "<span>" + args[i] + "</span><br />";
  }
  $("#timers").html(html)
}

/**
 *
 */
function displaySensorData(args) {
  var devices = [];

  for (var i = 0; i < args.length; ++i) {
    var deviceData = args[i].split(":");
    devices.push({id: deviceData[0], time: deviceData[1], ppm: deviceData[2], temperatures: deviceData.slice(3, deviceData.length)});
  };

  $("#sensorData").html("");

  for (var i = 0; i < devices.length; ++i) {
    var html = "<span>";
    html += "Device ID: " + devices[i].id;
    html += " Time: " + moment.unix(Number(devices[i].time)).format("YYYY-MM-DD HH:mm:ss");
    html += " PPM: " + devices[i].ppm;
    html += " Temperatures:";
    for (var j = 0; j < devices[i].temperatures.length; ++j) {
      html += " " + parseFloat(devices[i].temperatures[j]).toFixed(2);
    }
    html += "</span><br />"
  }
  $("#sensorData").html(html)
}

function displaySensorData_2(dataArray) {
  $("#sensorData").html("");

  for (var i in dataArray) {
    var html = "<span>";
    html += "Device ID: " + dataArray[i].id;
    html += " Time: " + moment.unix(Number(dataArray[i].time)).format("YYYY-MM-DD HH:mm:ss");
    html += " PPM: " + dataArray[i].ppm;
    html += " Temperatures:";
    for (var j in dataArray[i].temperatures) {
      html += " " + parseFloat(dataArray[i].temperatures[j]).toFixed(2);
    }
    html += "</span><br />"
  }

  $("#sensorData").html(html)
  


  ////////

  // for (var i = 0; i < args.length; ++i) {
  //   var deviceData = args[i].split(":");
  //   devices.push({id: deviceData[0], time: deviceData[1], ppm: deviceData[2], temperatures: deviceData.slice(3, deviceData.length)});
  // };

  // $("#sensorData").html("");

  // for (var i = 0; i < devices.length; ++i) {
  //   var html = "<span>";
  //   html += "Device ID: " + devices[i].id;
  //   html += " Time: " + moment.unix(Number(devices[i].time)).format("YYYY-MM-DD HH:mm:ss");
  //   html += " PPM: " + devices[i].ppm;
  //   html += " Temperatures:";
  //   for (var j = 0; j < devices[i].temperatures.length; ++j) {
  //     html += " " + parseFloat(devices[i].temperatures[j]).toFixed(2);
  //   }
  //   html += "</span><br />"
  // }
  // $("#sensorData").html(html)
}

/**
 *
 */
function drawGraph(args) {
  var device = Object();
  device.id = args[0];
  device.data = Array();
  for (var i = 1; i < args.length; ++i) {
    var data = args[i].split(":");
    var time = data[0];
    var ppm = data[1];
    var temperatures = Array();
    for (var j = 2; j < data.length; ++j) {
      temperatures.push(data[j]);
    };
    device.data.push({time: time, ppm: ppm, temperatures: temperatures});
  };
  graph_drawGraphFromObject(device)
}

function drawGraph_2(devicesRecords) {
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

function test_json() {
  G_WEBSOCKET.send("/test_json");
}