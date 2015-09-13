var dialogList = [
"seturidialog",
"addtimerdialog",
"consultdatadialog"
]
for (var i = 0; i < dialogList.length; i++) {
  document.getElementById(dialogList[i]).style.display = "none";
};
var navbarList = [
"navbar.connect",
"navbar.disconnect",
"navbar.addtimer",
"navbar.stop",
"navbar.seturi"
]
for (var i = 0; i < dialogList.length; i++) {
  document.getElementById(dialogList[i]).style.display = "none";
};

function displaydialog(name, show) {
  if (show == true)
    document.getElementById(name).style.display = "block";
  else if (show == false)
    document.getElementById(name).style.display = "none";
  else
    document.getElementById(name).style.display = "block";
}

function toggleDialog(name) {
  if (isHidden(name))
    displaydialog(name, true);
  else
    displaydialog(name, false);
}

function isHidden(name) {
  if (document.getElementById(name).style.display == "block")
    return false;
  else if (document.getElementById(name).style.display == "none")
    return true;
  else
    return false;
}

function displayaddtimerdialog(show) {
  displaydialog("addtimerdialog", show);
  if (show == false) {
    document.getElementById("timerH").value = "";
    document.getElementById("timerM").value = "";
    document.getElementById("timerS").value = "";
  }
}

function hideAllDialogs() {
  for (var i = 0; i < dialogList.length; i++) {
    document.getElementById(dialogList[i]).style.display = "none";
  };
}

function hideAllDialogsLess(dialogName) {
  for (var i = 0; i < dialogList.length; i++) {
    if (dialogList[i] != dialogName)
      document.getElementById(dialogList[i]).style.display = "none";
  };
}

function displayseturidialog(show) {
  hideAllDialogs()
  displaydialog("seturidialog", show);
}

function displayGraph(show) {
  hideAllDialogs()
  displaydialog("graph", show);
}

function toggleGraph() {
  toggleDialog("graph");
}

function toggleSetURIDialog() {
  hideAllDialogsLess("seturidialog");
  toggleDialog("seturidialog");
}


function toggleAddTimerDialog() {
  hideAllDialogsLess("addtimerdialog");
  toggleDialog("addtimerdialog");
}

function toggleConsultDataDialog() {
  hideAllDialogsLess("consultdatadialog");
  toggleDialog("consultdatadialog");
}

$(function () {
  $('#datetimepicker6').datetimepicker();
  $('#datetimepicker7').datetimepicker({
    useCurrent: false //Important! See issue #1075
  });
  $("#datetimepicker6").on("dp.change", function (e) {
    $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
  });
  $("#datetimepicker7").on("dp.change", function (e) {
    $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
  });
});