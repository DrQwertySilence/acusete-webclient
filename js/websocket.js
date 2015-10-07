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
  var message = evt.data.split(" ");
  var message_command = message[0];
  var message_args = message.slice(1, message.length);
  //
  if (message_command == "/alert") {
    shouldAlert(message_args)
  } else if (message_command == "/displayTimers") {
    displayTimers(message_args);
  } else if (message_command == "/displaySensorData") {
    displaySensorData(message_args)
  } else if (message_command == "/recordedDataForGraph") {
    drawGraph(message_args);
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


/**
 *
 */
function playTimer(timerId) {
  G_WEBSOCKET.send( "/playTimer " + timerId );
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
function displayTimers(args) {
  $("#timerZone").html("");
  var html = "";
  if (args[0] == "")
    return;
  for (var i in args) {
    var timerData = args[i].split(";");
    html +=
    "<div class='timer col-xs-6 col-md-2'><div class='timer-inner'>" +
    "<div class='row'><span id='timersTEST' class='bigLabel col-xs-12 col-md-12'>" + timerData[1] + "</span></div><div class='row'>" +
    "<button class='btn btn-default col-xs-6 col-md-6' onClick='pauseTimer(" + timerData[0] + ")'>X</button>" +
    "<button class='btn btn-default col-xs-6 col-md-6 hidden' onClick='playTimer(" + timerData[0] + ")'>X</button>" +
    "<button class='btn btn-default col-xs-6 col-md-6' onClick='stopTimer(" + timerData[0] + ")'>X</button>" +
    "<button class='btn btn-default col-xs-6 col-md-6 hidden' onClick='restartTimer(" + timerData[0] + ")'>X</button></div></div></div>";
  }
  $("#timerZone").html(html)
}

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
    G_WEBSOCKET.send( "/getRecordedData "+ "Derp " + start + " " + end); // a complete day
  }
}