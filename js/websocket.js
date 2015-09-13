/**
UGLY GLOBALS
*/
var G_DEBUG_TEXTAREA = document.getElementById("debugTextArea");
var G_DEBUG = false;

/**
Put a dem message into the 'console'... yeah.
*/
function debug(message) {
  if (G_DEBUG == true) {
    G_DEBUG_TEXTAREA.value += message + "\n";
    G_DEBUG_TEXTAREA.scrollTop = G_DEBUG_TEXTAREA.scrollHeight;
  }
}

/**
Send any UTF-8 base array message to the server
*/
function sendMessage() {
  var msg = document.getElementById("inputText").value;
  var args = msg.split(" ");
  if ( websocket != null ) {
    document.getElementById("inputText").value = "";
    websocket.send( msg );
    console.log( "string sent :", '"'+ msg +'"' );
  }
}

var wsUri = "ws://drqwertysilence.no-ip.biz:1234";
var websocket = null;

/**
Set the websocket url to the textbox 'wsuri'.
*/
function setWsUri() {
  if (websocket)
    websocket.close();
  wsUri = "ws://" + document.getElementById("ip").value + ":" + document.getElementById("port").value;
  document.getElementById("wsuri").innerHTML = wsUri;
}

/**
Init the connection with the server and implement a bunch of crap. Refactor please. qq
*/
function initWebSocket() {
  try {
    if (typeof MozWebSocket == 'function')
      WebSocket = MozWebSocket;
    if ( websocket && websocket.readyState == 1 )
      websocket.close();
    websocket = new WebSocket( wsUri );
    websocket.onopen = function (evt) {
      debug("CONNECTED");
      document.getElementById("connection").style.backgroundColor = "green";
    };
    websocket.onclose = function (evt) {
      debug("DISCONNECTED");
      document.getElementById("connection").style.backgroundColor = "red";
    };
    websocket.onmessage = function (evt) {
      var args = evt.data.split(" ");
      debug( args[0] );
      if (args[0] == "/alert") {
        if (args.length == 1) {
          document.getElementById("alert").style.backgroundColor = "orange";
        } else if (args[1] == "up") {
          document.getElementById("alert").style.backgroundColor = "orange";
        } else if (args[1] == "down") {
          document.getElementById("alert").style.backgroundColor = "gray";
        }
      } else if (args[0] == "/displayTimers") {
        var timers = args.slice(1, args.length);
        document.getElementById("timers").innerHTML = "";
        for (var i in timers) {
          document.getElementById("timers").innerHTML += "<span>" + timers[i] + "</span><br />";
        }
      } else if (args[0] == "/displaySensorData") {
        var serverData = args.slice(1, args.length);
        var deviceID = serverData[0];
        var time = serverData[1];
        var ppm = serverData[2];
        var temperatureData = serverData.slice(3, args.length);

        var msg = "";

        msg += "Device " + deviceID + " data:";
        
        msg += " Time: " + time;

        msg += " PPM: ";
        if (Number(ppm) < 50)
          msg += "N/A";
        else
          msg += ppm;

        msg += " Temperature:";
        for (var i = 0; i < temperatureData.length; ++i) {
          tempFloat = parseFloat(temperatureData[i]);
          if (tempFloat < -273 || tempFloat == "NaN")
            msg += " N/A";
          else
            msg += " " + parseFloat(temperatureData[i]).toFixed(2);
        }
        document.getElementById("sensorData").innerHTML = "<span>" + msg + "</span><br />";
      }
      console.log( "Message received :", evt.data );
      debug( evt.data );
    };
    websocket.onerror = function (evt) {
      debug('ERROR: ' + evt.data);
    };
  } catch (exception) {
    debug('ERROR: ' + exception);
  }
}

/**
Close the connection with the server.
*/
function stopWebSocket() {
  if (websocket)
    websocket.close();
}

/**
Get the state of the websocket.
*/
function checkSocket() {
  if (websocket != null) {
    var stateStr;
    switch (websocket.readyState) {
      case 0: {
        stateStr = "CONNECTING";
        break;
      }
      case 1: {
        stateStr = "OPEN";
        break;
      }
      case 2: {
        stateStr = "CLOSING";
        break;
      }
      case 3: {
        stateStr = "CLOSED";
        break;
      }
      default: {
        stateStr = "UNKNOW";
        break;
      }
    }
    debug("WebSocket state = " + websocket.readyState + " ( " + stateStr + " )");
  } else {
    debug("WebSocket is null");
  }
}
/**
Stop the annoy alarm.
*/
function stop() {
  if ( websocket != null )
  {
    websocket.send( "/alert stop" );
  }
}
/**
Set a timer server side. Need a refactor (take args).
*/
function setTimer() {
  if ( websocket != null ) {
    var h = document.getElementById("timerH").value
    var m = document.getElementById("timerM").value
    var s = document.getElementById("timerS").value
    var ms = (h * 3600000) + (m * 60000) + (s * 1000)
    debug(ms)
    websocket.send( "/setTimer " + ms );
  }
  displayaddtimerdialog(false)
}
/**
Get timers from server and display them on the webpage.
*/
function updateTimers() {
  if ( websocket != null ) {
    websocket.send( "/getTimers" );
  }
}

function updateSensorData(deviceNumber) {
  if ( websocket != null ) {
    websocket.send( "/getSensorData "+ deviceNumber);
  }
}

function tick() {
  debug("[Tick]");
  updateTimers();
  updateSensorData(0);
}

var G_INTERVAL = setInterval(function(){tick()}, 1000);
