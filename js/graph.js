//Receive a string from the server and
function parseDataString(graphData) {
  var data;
  var moreData = data.split(" ");
  var parsedData;
  if ((moreData.length + 1) == graphData.length) {
    for (var i = 0; i < graphData.length; i++) {
      if(graphData[i].label == "PPM")
        graphData[i].values.push({time:moreData[0], y: moreData[1]});
      else
        graphData[i].values.push({time:moreData[0], y: moreData[i + 1]});
    };
    return true;
  }
  else
    return false;
}

function buildGraphData() {
  var data;
  return data;
}

function TESTGraphData() {
  var lineChartData = [
  // The first series
  {
    label: "PPM",
    values:[
    {time: 1370044800, y: 300},
    {time: 1370044801, y: 410},
    {time: 1370044802, y: 300},
    {time: 1370044803, y: 400},
    {time: 1370044804, y: 300},
    {time: 1370044805, y: 400},
    {time: 1370044806, y: 300},
    {time: 1370044807, y: 405},
    {time: 1370044808, y: 300},
    {time: 1370044809, y: 390},
    {time: 1370044810, y: 300},
    {time: 1370044811, y: 410},
    {time: 1370044812, y: 300},
    {time: 1370044813, y: 400},
    {time: 1370044814, y: 300},
    {time: 1370044815, y: 400},
    {time: 1370044816, y: 300},
    {time: 1370044817, y: 405},
    {time: 1370044818, y: 300},
    {time: 1370044819, y: 390},
    {time: 1370044820, y: 300},
    {time: 1370044821, y: 410},
    {time: 1370044822, y: 300},
    {time: 1370044823, y: 400},
    {time: 1370044824, y: 300},
    {time: 1370044825, y: 400}]
  },
  // The second series
  {
    label: "Temperature",
    values:[
    {time: 1370044800, y: 20},
    {time: 1370044801, y: 20},
    {time: 1370044802, y: 20},
    {time: 1370044803, y: 30},
    {time: 1370044804, y: 30},
    {time: 1370044805, y: 30},
    {time: 1370044806, y: 20},
    {time: 1370044807, y: 20},
    {time: 1370044808, y: 20},
    {time: 1370044809, y: 30},
    {time: 1370044810, y: 30},
    {time: 1370044811, y: 30},
    {time: 1370044812, y: 20},
    {time: 1370044813, y: 20},
    {time: 1370044814, y: 20},
    {time: 1370044815, y: 30},
    {time: 1370044816, y: 30},
    {time: 1370044817, y: 30},
    {time: 1370044818, y: 20},
    {time: 1370044819, y: 20},
    {time: 1370044820, y: 20},
    {time: 1370044821, y: 30},
    {time: 1370044822, y: 30},
    {time: 1370044823, y: 30},
    {time: 1370044824, y: 20},
    {time: 1370044825, y: 20}]
  },
];
  return lineChartData;
}

function TESTsetGraphData() {
  graph.update(TESTGraphData());
}

var lineChartData = [
{
  label: "PPM",
  values:[
  {time: 1370044800, y: 400},
  {time: 1370044801, y: 410},
  {time: 1370044802, y: 405},
  {time: 1370044803, y: 400},
  {time: 1370044804, y: 390},
  {time: 1370044805, y: 400},
  {time: 1370044806, y: 410},
  {time: 1370044807, y: 405},
  {time: 1370044808, y: 400},
  {time: 1370044809, y: 390},
  {time: 1370044810, y: 400},
  {time: 1370044811, y: 410},
  {time: 1370044812, y: 405},
  {time: 1370044813, y: 400},
  {time: 1370044814, y: 390},
  {time: 1370044815, y: 400},
  {time: 1370044816, y: 410},
  {time: 1370044817, y: 405},
  {time: 1370044818, y: 400},
  {time: 1370044819, y: 390},
  {time: 1370044820, y: 400},
  {time: 1370044821, y: 410},
  {time: 1370044822, y: 405},
  {time: 1370044823, y: 400},
  {time: 1370044824, y: 390},
  {time: 1370044825, y: 400}]
},
// The second series
{
  label: "Temperature",
  values:[
  {time: 1370044800, y: 32},
  {time: 1370044801, y: 34},
  {time: 1370044802, y: 40},
  {time: 1370044803, y: 56},
  {time: 1370044804, y: 70},
  {time: 1370044805, y: 32},
  {time: 1370044806, y: 34},
  {time: 1370044807, y: 40},
  {time: 1370044808, y: 56},
  {time: 1370044809, y: 70},
  {time: 1370044810, y: 32},
  {time: 1370044811, y: 34},
  {time: 1370044812, y: 40},
  {time: 1370044813, y: 56},
  {time: 1370044814, y: 70},
  {time: 1370044815, y: 32},
  {time: 1370044816, y: 34},
  {time: 1370044817, y: 40},
  {time: 1370044818, y: 56},
  {time: 1370044819, y: 70},
  {time: 1370044820, y: 32},
  {time: 1370044821, y: 34},
  {time: 1370044822, y: 40},
  {time: 1370044823, y: 56},
  {time: 1370044824, y: 70},
  {time: 1370044825, y: 72}]
},
];

var graph = $('#graph').epoch({
  type: 'time.line',
  data: lineChartData,
  axes: ['left', 'bottom']
});