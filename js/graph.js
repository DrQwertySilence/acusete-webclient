var graph;
var temperatureGraph;

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
      // time: object.records[i].time,
      x: object.records[i].date,
      y: object.records[i].ppm
    });
  }
  lineChartData.push(ppmLine);

  graph = $('#graph').epoch({
    // type: 'time.line',
    type: 'line',
    data: lineChartData,
    axes: ['left', 'bottom']
  });

  // var asdasd = $('#graph').find(".x").find("text");

  // TEMPERATURE
  for (var i = 0; i < object.records[0].temperatures.length; ++i) { // object.records[0].temperatures.length : The length of the temperature data array (can be any of them)
    var tempLine = {label: "Temperature " + (i + 1)};
    tempLine.values = Array();
    for (var j = 0; j < object.records.length; ++j) {
      tempLine.values.push({
        // time: object.records[j].time,
        x: object.records[j].date,
        y: object.records[j].temperatures[i]
      });
    }
    TemperatureLineChartData.push(tempLine);
  }
  // graph.update(lineChartData);
  // temperatureGraph.update(TemperatureLineChartData);
  //
  
  temperatureGraph = $('#temperatureGraph').epoch({
    // type: 'time.line',
    type: 'line',
    data: TemperatureLineChartData,
    axes: ['left', 'bottom']
  });



  // if (object.data.length == 0)
  //   return;

  // var lineChartData = Array();
  // var TemperatureLineChartData = Array();
  // // PPM
  // var ppmLine = {label: "PPM"};
  // ppmLine.values = Array();
  // for (var i = 0; i < object.data.length; ++i) {
  //   ppmLine.values.push({
  //     // time: object.data[i].time,
  //     x: object.data[i].time,
  //     y: object.data[i].ppm
  //   });
  // }
  // lineChartData.push(ppmLine);
  // // TEMPERATURE
  // for (var i = 0; i < object.data[0].temperatures.length; ++i) { // object.data[0].temperatures.length : The length of the temperature data array (can be any of them)
  //   var tempLine = {label: "Temperature " + (i + 1)};
  //   tempLine.values = Array();
  //   for (var j = 0; j < object.data.length; ++j) {
  //     tempLine.values.push({
  //       // time: object.data[j].time,
  //       x: object.data[j].time,
  //       y: object.data[j].temperatures[i]
  //     });
  //   }
  //   TemperatureLineChartData.push(tempLine);
  // }
  // // graph.update(lineChartData);
  // // temperatureGraph.update(TemperatureLineChartData);
  // //
  // graph = $('#graph').epoch({
  //   // type: 'time.line',
  //   type: 'line',
  //   data: lineChartData,
  //   axes: ['left', 'bottom']
  // });
  // temperatureGraph = $('#temperatureGraph').epoch({
  //   // type: 'time.line',
  //   type: 'line',
  //   data: TemperatureLineChartData,
  //   axes: ['left', 'bottom']
  // });
}