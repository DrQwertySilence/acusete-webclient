// Connection buttons
$("#btn-connection-connect").css("display", "block");
$("#btn-connection-disconnect").css("display", "none");

var dialogList = [
"seturidialog",
"addtimerdialog",
"consultdatadialog"
];
for (var i = 0; i < dialogList.length; i++) {
    $("#" + dialogList[i]).css("display", "none");
}

/****************************************************************
* DIALOG CLEANING
****************************************************************/

/**
 *
 */
function cleanUriDialog()
{

}

/**
 *
 */
function cleanTimerDialog()
{
    $("#timerDescription").val("");
    $("#timerH").val("");
    $("#timerM").val("");
    $("#timerS").val("");
}

/**
 *
 */
function cleanConsultDialog()
{

}

/****************************************************************
* ????
****************************************************************/

/**
*
*/
function displaydialog(name, show)
{
    if (show == true)
        $("#" + name).css("display", "block");
    else if (show == false)
        $("#" + name).css("display", "none");
    else
        $("#" + name).css("display", "block");
}

/**
*
*/
function toggleDialog(name)
{
    if (isHidden(name))
        displaydialog(name, true);
    else
        displaydialog(name, false);
}

/**
*
*/
function isHidden(name)
{
    var property = $("#" + name).css("display");
    if (property == "block")
        return false;
    else if (property == "none")
        return true;
    else
        return false;
}

/**
*
*/
function displayaddtimerdialog(show)
{
    displaydialog("addtimerdialog", show);
    if (show == false) {
        cleanTimerDialog();
    }
}

/**
*
*/
function hideAllDialogs()
{
    for (var i = 0; i < dialogList.length; i++) {
        $("#" + dialogList[i]).css("display", "none");
    }
}

/**
*
*/
function hideAllDialogsLess(dialogName)
{
    for (var i = 0; i < dialogList.length; i++) {
        if (dialogList[i] != dialogName)
          $("#" + dialogList[i]).css("display", "none");
  }
}

/**
*
*/
function displayseturidialog(show)
{
    hideAllDialogs()
    displaydialog("seturidialog", show);
}

/**
*
*/
function displayGraph(show)
{
    displaydialog("deviceX", show);
    displaydialog("graph", show);
    displaydialog("temperatureGraph", show);
}

/**
*
*/
function toggleGraph()
{
    toggleDialog("deviceX");
    toggleDialog("graph");
    toggleDialog("temperatureGraph");
}

/**
*
*/
function toggleSetURIDialog()
{
    hideAllDialogsLess("seturidialog");
    toggleDialog("seturidialog");
}

/**
*
*/
function toggleAddTimerDialog()
{
    hideAllDialogsLess("addtimerdialog");
    toggleDialog("addtimerdialog");
}

/**
*
*/
function toggleConsultDataDialog()
{
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
function ui_onopen()
{
    $("#btn-connection-connect").css("display", "none");
    $("#btn-connection-disconnect").css("display", "block");
}

/**
*
*/
function ui_onclose()
{
    $("#btn-connection-connect").css("display", "block");
    $("#btn-connection-disconnect").css("display", "none");
    $("#sensorData").html("");
    $("#timers").html("");
    $("#timerZone").html("");
    hideAllDialogs();
}