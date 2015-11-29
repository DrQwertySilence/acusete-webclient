var graph = $('#graph').epoch({
    type: 'scatter',
    data: Array(),
    axes: ['left', 'bottom']
});
var temperatureGraph = $('#temperatureGraph').epoch({
    type: 'scatter',
    data: Array(),
    axes: ['left', 'bottom']
});

/**
 * 
 */
function graph_drawGraphFromObject(object) {
    if (object.records.length == 0)
        return;
    
    var lineChartData = Array();
    var TemperatureLineChartData = Array();

    // PPM
    var ppmLine = {label: "PPM"};
    ppmLine.values = Array();
    for (var i = 0; i < object.records.length; ++i) {
        ppmLine.values.push({
            x: object.records[i].date,
            y: object.records[i].ppm
        });
    }
    lineChartData.push(ppmLine);

    graph.update(lineChartData);
    
    // TEMPERATURE
    var tempSensorCuantity = object.records[0].temperatures.length; // object.records[0].temperatures.length : The length of the temperature data array (can be any of them).
    for (var i = 0; i < tempSensorCuantity; ++i) {
        var tempLine = {label: "Temperature " + (i + 1)};
        tempLine.values = Array();
        for (var j = 0; j < object.records.length; ++j) {
            tempLine.values.push({
                x: object.records[j].date,
                y: object.records[j].temperatures[i]
            });
        }
        TemperatureLineChartData.push(tempLine);
    }

    temperatureGraph.update(TemperatureLineChartData);

    $('#graph').find(".x").find("text").each(function () {
        $(this).html(moment.tz(Number($(this).html()), "").format("HH:mm:ss"));
    });

    $('#temperatureGraph').find(".x").find("text").each(function () {
        $(this).html(moment.tz(Number($(this).html()), "").format("HH:mm:ss"));
    });

    
}