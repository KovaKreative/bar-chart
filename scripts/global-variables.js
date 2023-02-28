let barChartData = [[["Data", "Data", "Data"],["Data Set 1","Data Set 2"]], [33, 50, 80]];

let maxLabelLength = 0;

const valuePositions = ["bar-value-bottom", "bar-value-middle", "bar-value-top", "none"];

let barSettings = {
  numOfElements: barChartData[1].length,
  numOfDataSets: barChartData.length - 1,
  valuePosition: valuePositions[2],
  barColour: ["bar-colour-red", "bar-colour-green", "bar-colour-blue", "bar-colour-yellow"],
  barLabelColour: "maroon",
  titleColour: "pink",
  titleSize: 28,
  spacing: 50,
  chartTitle: "Bar Chart Title",
  axisLabelX: "X Axis Label",
  axisLabelY: "Y Axis Label",
  axisLabelColour: "maroon",
  numOfTicks: 3,
  barLabels: true
}

const barElement = document.getElementById("bar-container");
