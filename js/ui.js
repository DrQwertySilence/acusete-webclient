// Connection buttons
document.getElementById("btn.connection.connect").style.display = "block";
document.getElementById("btn.connection.disconnect").style.display = "none";

var dialogList = [
"seturidialog",
"addtimerdialog",
"consultdatadialog"
];
for (var i = 0; i < dialogList.length; i++) {
  document.getElementById(dialogList[i]).style.display = "none";
}
var navbarList = [
"navbar.connect",
"navbar.disconnect",
"navbar.addtimer",
"navbar.stop",
"navbar.seturi"
];
for (var i = 0; i < dialogList.length; i++) {
  document.getElementById(dialogList[i]).style.display = "none";
}

/**
 *
 */
function displaydialog(name, show) {
  if (show == true)
    document.getElementById(name).style.display = "block";
  else if (show == false)
    document.getElementById(name).style.display = "none";
  else
    document.getElementById(name).style.display = "block";
}

/**
 *
 */
function toggleDialog(name) {
  if (isHidden(name))
    displaydialog(name, true);
  else
    displaydialog(name, false);
}

/**
 *
 */
function isHidden(name) {
  if (document.getElementById(name).style.display == "block")
    return false;
  else if (document.getElementById(name).style.display == "none")
    return true;
  else
    return false;
}

/**
 *
 */
function displayaddtimerdialog(show) {
  displaydialog("addtimerdialog", show);
  if (show == false) {
    document.getElementById("timerH").value = "";
    document.getElementById("timerM").value = "";
    document.getElementById("timerS").value = "";
  }
}

/**
 *
 */
function hideAllDialogs() {
  for (var i = 0; i < dialogList.length; i++) {
    document.getElementById(dialogList[i]).style.display = "none";
  }
}

/**
 *
 */
function hideAllDialogsLess(dialogName) {
  for (var i = 0; i < dialogList.length; i++) {
    if (dialogList[i] != dialogName)
      document.getElementById(dialogList[i]).style.display = "none";
  }
}

/**
 *
 */
function displayseturidialog(show) {
  hideAllDialogs()
  displaydialog("seturidialog", show);
}

/**
 *
 */
function displayGraph(show) {
  displaydialog("deviceX", show);
  displaydialog("graph", show);
  displaydialog("temperatureGraph", show);
}

/**
 *
 */
function toggleGraph() {
  toggleDialog("deviceX");
  toggleDialog("graph");
  toggleDialog("temperatureGraph");
}

/**
 *
 */
function toggleSetURIDialog() {
  hideAllDialogsLess("seturidialog");
  toggleDialog("seturidialog");
}

/**
 *
 */
function toggleAddTimerDialog() {
  hideAllDialogsLess("addtimerdialog");
  toggleDialog("addtimerdialog");
}

/**
 *
 */
function toggleConsultDataDialog() {
  hideAllDialogsLess("consultdatadialog");
  toggleDialog("consultdatadialog");
}

/**
 *
 */
$(function () {
  $('#sandbox-container .input-daterange').datepicker({
  });
});

/****************************************************************
 * EVENTS
 ****************************************************************/

/**
 *
 */
function ui_onopen() {
  document.getElementById("btn.connection.connect").style.display = "none";
  document.getElementById("btn.connection.disconnect").style.display = "block";
}

/**
 *
 */
function ui_onclose() {
  document.getElementById("btn.connection.connect").style.display = "block";
  document.getElementById("btn.connection.disconnect").style.display = "none";
  document.getElementById("sensorData").innerHTML = "";
  document.getElementById("timers").innerHTML = "";
}