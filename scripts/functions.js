//This function is to determine how much space the bar labels take up
function countMaxLabelLength(data){
  maxLabelLength = 0;
  for(let i = 0; i < data[0][0].length; i++){
    if(data[0][0][i].length > maxLabelLength){
      maxLabelLength = data[0][0][i].length;
    }
  }

  if(maxLabelLength > 25){
    $("#bar-container").css("padding-bottom", "300px");
  } else {
    $("#bar-container").css("padding-bottom", "200px");
  }
}

//This function updates the input fields specific to the data, if the user changes the amount of items, it increases the number of entry fields
function updateDataInputFields(){
  let output = barSettings.barLabels ? `<br><label>Data Label colour:</label>` +
  `<select autocomplete="off" class="colour-picker" onchange="updateChartOptions('barLabelColour', this.value)">` +
  `<option class="colour-choice" value="maroon">Red</option>` +
  `<option class="colour-choice" value="darkslategray">Green</option>` +
  `<option class="colour-choice" value="navy">Blue</option>` +
  `<option class="colour-choice" value="peru">Yellow</option></select>` : `<br>`;

  output += `<br><br><table><tr>`;

  output += barSettings.barLabels ? `<th>Data Label</th>` : ``;
  if(barSettings.numOfDataSets > 1){
    for(let i = 1; i <= barSettings.numOfDataSets; i++){
      output += `<th><input type="text" maxlength="30" class="data-label-input" oninput="writeLabel(1, ${i-1}, value)" value="${barChartData[0][1][i-1]}"></th>`;
    }
  }

  output += `</tr><tr>`;

  for(let i = 0; i < barSettings.numOfElements; i++){
    if(barSettings.barLabels){
      output += `<td><input type="text" maxlength="30" class="data-label-input" oninput="writeLabel(0, ${i}, value)" value="${barChartData[0][0][i]}"></td>`;
    }
    for(let j = 1; j <= barSettings.numOfDataSets; j++){
     output += `<td><input type="number" class="data-value-input" oninput="writeData(${j}, ${i}, value)" value="${barChartData[j][i]}"></td>`;
    }
    output += `</tr>`;
  }

  output += `<tr><th>Bar Colour:</th>`;

  for(let i = 0; i < barSettings.numOfDataSets; i++){
    output+=`<td><select autocomplete="off" class="bar-colour-picker" onchange="updateBarColour(${i}, this.value); updateDataInputFields()">` +
    `<option ` + (barSettings.barColour[i] === 'bar-colour-red' ? `selected="selected"` : ``) + ` class="colour-choice" value="bar-colour-red">Red</option>` +
    `<option ` + (barSettings.barColour[i] === 'bar-colour-green' ? `selected="selected"` : ``) + ` class="colour-choice" value="bar-colour-green">Green</option>` +
    `<option ` + (barSettings.barColour[i] === 'bar-colour-blue' ? `selected="selected"` : ``) + ` class="colour-choice" value="bar-colour-blue">Blue</option>` +
    `<option ` + (barSettings.barColour[i] === 'bar-colour-yellow' ? `selected="selected"` : ``) + ` class="colour-choice" value="bar-colour-yellow">Yellow</option>` +
    `</select></td>`;
  }

  output += `</tr></table>`;

  $("#data-form").html(output);
}

//This function updates the data to increase or decrease the number of data sets for stacking multiple data in single bars
function updateNumberOfDataSets(val){
  barSettings.numOfDataSets = val;
  for(let i = 1; i <= barSettings.numOfDataSets; i++){
    if(barChartData[i] === undefined){
      barChartData.push(new Array(barSettings.numOfElements));
    }
    if(barChartData[0][1][i-1] === undefined){
      barChartData[0][1][i-1] = "Data Set " + i;
    }
  }
  updateNumberOfElements(barSettings.numOfElements);
}

//This function updates the amount of data elements the user wants to display
function updateNumberOfElements(val){
  val = Math.ceil(val);
    val = Math.max(val, 2);

      for(let i = 0; i < val; i++){
        for(let j = 1; j <= barSettings.numOfDataSets; j++){
          if(barChartData[j][i] === undefined){
            barChartData[j][i] = 0;
          }
        }
        if(barChartData[0][0][i] === undefined){
          barChartData[0][0][i] = "Data";
        }
      }
  barSettings.numOfElements = val;
  updateDataInputFields();
}

//This function updates any specified property of the data settings
function updateChartOptions(property, value){
  barSettings[property] = value;
}

//This function updates the bar colours and makes sure that multiple data sets aren't assigned the same colour
function updateBarColour(index, value){
  for(let i = 0; i < barSettings.barColour.length; i++){
    if(barSettings.barColour[i] === value){
      barSettings.barColour[i] = barSettings.barColour[index];
    }
  }
  barSettings.barColour[index] = value;
}

//This function is for updating any individual data label
function writeLabel(index, subindex, value){
  barChartData[0][index][subindex] = value;
  countMaxLabelLength(barChartData);
}

//This function is for updating any individual data amount
function writeData(set, index, value){
  barChartData[set][index] = value;
}

//This is the main function that generates and displays the bar chart
function drawBarChart(data, options, element){
  $("main").css("display", "initial");
  countMaxLabelLength(data);

  const offset = 100; //This offset allows room for the Y-Axis label and the numbers for scale, the bar chart itself will be located to the left of this offset

  const chartSize = { //Get size of the container to determine the size of the bars
    width: $("#bar-container").width() - offset - 20,
    height: $("#bar-container").height()
  };

  const bottomOffset = parseInt($("#bar-container").css("padding-bottom"), 10);
  const spacing = 1 - Math.floor(options.spacing) * 0.01;
  const barArea = Math.floor(chartSize.width / options.numOfElements);
  const spaceSize = Math.floor(barArea * spacing);
  const barSize = barArea - spaceSize;

  const startLocation = offset + barSize * spacing;

  let lowestDataNum = 0;
  let highestDataNum = 0;

  //This functions combs through the data to determine the range of the data numbers
  function getRange(){
    for(let d = 0; d < options.numOfElements; d++){
      let sumOfEntries = 0;
      for(let s = 1; s <= options.numOfDataSets; s++){
        let entry = parseFloat(data[s][d]);
        if(isNaN(entry)){
          data[s][d] = 0;
        } else {
          sumOfEntries += entry;
        }
        if(d == 0){ //The lowest data value needs to be at least as big as the first entry
          lowestDataNum = sumOfEntries;
        }
      }
      if(sumOfEntries < lowestDataNum){
        lowestDataNum = sumOfEntries;
      }
      if(sumOfEntries > highestDataNum){
        highestDataNum = sumOfEntries;
      }
    }
    lowestDataNum = Math.floor(lowestDataNum);
    //Round the upper range to the nearest 10 to make the scale value more round
    highestDataNum *= 0.1;
    highestDataNum = Math.ceil(highestDataNum) * 10;
  }

  //This local function generates all the necessary HTML inside the bar chart itself
  function createChartHTML(){
    //update title
    $("#chart-title").html(options.chartTitle);

    let output = `<h3 id="y-axis-label" class="axis-label">${options.axisLabelY}</h3>` +
    `<h4 class="scale-number" style="top: 0 margin-top: 10px">${highestDataNum}</h4>` +
    `<h4 class="scale-number" style="top: ${Math.round(chartSize.height * 0.5) + 10}px">${highestDataNum * 0.5}</h4>` +
    `<h4 class="scale-number" style="top: ${chartSize.height}px">0</h4>` +
    `<div id="data-scale">`;

    for(let i = 0; i < options.numOfTicks; i++){
      output += `<hr>`;
    }

    output += `</div>`;

    for(let i = 0; i < options.numOfElements; i++){
      let additionalVerticalOffset = 0;
      for(let s = 1; s <= options.numOfDataSets; s++){
        const dataHeight = (data[s][i] / highestDataNum) * chartSize.height;
        const verticalAdjustment = parseInt($(".bar").css("border-top-width"), 10);
        const normalizedHeight = dataHeight - verticalAdjustment;
        const barLocation = (startLocation + barArea * i).toString();
        const labelPositionY = chartSize.height + 30;

        if(dataHeight < 1){
          continue;
        }

        output += `<div class="bar ${options.barColour[s-1]}" style="height: ${normalizedHeight}px; margin-left: ${barLocation}px;` +
        `bottom: ${bottomOffset + additionalVerticalOffset}px">`;

        if(options.valuePosition != valuePositions[3]){
          const fontSize = Math.min(normalizedHeight, 12);
          if(fontSize >= 8){ //If the text is too small to fit into the bar, don't bother printing it
            output += `<p class="bar-value ${options.valuePosition}" style="font-size: ${fontSize}px">${data[s][i]}</p>`;
          }
        }

        output += `</div>`;
        if(options.barLabels){
          const verticalLabels = maxLabelLength > 25 && barArea < 150 ? "bar-label-vertical" : "";
          output += `<div class="bar-label ${verticalLabels}" style="margin-left: ${barLocation}px; top: ${labelPositionY}px">${data[0][0][i]}</div>`;
        }

        additionalVerticalOffset += dataHeight - 1;
      }
    }
    output += `<h3 id="x-axis-label" class="axis-label">${options.axisLabelX}</h3>`;

    if(options.numOfDataSets > 1){
      for(let i = 0; i < options.numOfDataSets; i++){
        const leftOffset = offset + (Math.round(chartSize.width * 0.25) * i);
        output += `<div style="display: flex; position: absolute; bottom: 40px; left: ${leftOffset}px"><div class="legend-icon ${options.barColour[i]}"></div><p style="margin: auto 0px auto 5px">${data[0][1][i]}</p></div>`;
      }
    }

    element.innerHTML = output;
  }

  //Once all the necessary HTML elements are generated and inserted into the chart container, this local function applies any necessary style preferences to those existing elements
  function applyChartCSS(){
    $("#chart-title").css("color", options.titleColour);
    let titleBackgroundColour;
    switch(options.titleColour){
      case "pink":
        titleBackgroundColour = "maroon";
        break;
      case "palegreen":
        titleBackgroundColour = "darkslategray";
        break;
      case "lightskyblue":
        titleBackgroundColour = "navy";
        break;
      case "khaki":
        titleBackgroundColour = "saddlebrown";
        break;
      default:
        titleBackgroundColour = "indigo";
    }
    $("#chart-title").css("background-color", titleBackgroundColour);
    $("#chart-title").css("font-size", options.titleSize + "px");
    $(".axis-label").css("color", options.axisLabelColour);

    $("#data-scale").css("width", chartSize.width + "px");
    $("#data-scale").css("height", (chartSize.height - 4) + "px");

    $(".bar-label").css("color", options.barLabelColour);
    $(".bar-label").width(barSize + "px");
    $(".bar").width(barSize + "px");
    let gap = Math.floor(parseInt($("#data-scale").css("height"), 10) / (parseInt(options.numOfTicks) + 1)) - 1.5;

    $("#data-scale hr").css("margin-top", gap + "px");

  }

  //Run all the local functions
  getRange();
  createChartHTML();
  applyChartCSS();

  //The chart is unveiled at the top of the windows, this ensures that the window is scrolled all the way up and focused on the chart
  window.scrollTo(0,0);
}

//This function generates a sample chart preconfigured with various settings
function generateSampleChart(index){

  //Data for chart 1
  const animalLegsData = [
    [
      ["Ocelot", "Sparrow", "Tarantula", "Bumblebee"],
      []
    ],
    [4, 2, 8, 6]
  ];

  const animalLegsSettings = {
    numOfElements: 4,
    numOfDataSets: 1,
    valuePosition: valuePositions[0],
    barColour: ["bar-colour-yellow", "bar-colour-red", "bar-colour-green", "bar-colour-blue"],
    barLabelColour: "peru",
    titleColour: "khaki",
    titleSize: 32,
    spacing: 70,
    chartTitle: "Number of Animal Legs",
    axisLabelX: "Animal Name",
    axisLabelY: "Number of Legs",
    axisLabelColour: "saddlebrown",
    numOfTicks: 9,
    barLabels: true
  };
  //Data for chart 2
  const dreamTheaterData = [
    [
      ["When Dream And Day Unite", "Images and Words", "Awake", "Falling Into Infinity", "Scenes From A Memory",
        "Six Degrees Of Inner Turbulence", "Train of Thought", "Octavarium", "Systematic Chaos", "Black Clouds and Silver Linings",
        "A Dramatic Turn Of Events", "Dream Theater", "The Astonishing", "Distance Over Time", "A View From The Top Of The World"],
      ["Longest Track", "Shortest Track"]
    ],
    [8, 11.5, 11, 13.1, 12.5, 13.9, 14.3, 24, 16.6, 19.3, 12.4, 22.3, 7.7, 9.3, 20.4],
    [4.3, 2.5, 3.8, 4.3, 1, 2.1, 3, 4.5, 5.6, 5.4, 3.9, 2.7, 0.5, 4, 6.4]
  ];

  const dreamTheaterSettings = {
    numOfElements: 15,
    numOfDataSets: 2,
    valuePosition: valuePositions[1],
    barColour: ["bar-colour-blue", "bar-colour-yellow", "bar-colour-red", "bar-colour-green"],
    barLabelColour: "navy",
    titleColour: "lightskyblue",
    titleSize: 28,
    spacing: 70,
    chartTitle: "Dream Theater's Longest and Shortest Studio Tracks",
    axisLabelX: "Album Name",
    axisLabelY: "Song Length In Minutes",
    axisLabelColour: "navy",
    numOfTicks: 5,
    barLabels: true
  };
  //Data for chart 3
  const nutritionData = [
    [
      ["3% Milk", "Coca Cola", "Ensure Max Protein Drink", "Vita Coconut Water", "Tim Hortons Ice Cap"],
      ["Carbs", "Fat", "Protein"]
    ],
    [12, 27.4, 4.5, 11.4, 32.3],
    [8, 0, 1.1, 0, 5.1],
    [9, 0, 22.7, 0, 4.4]
  ];

  const nutritionSettings = {
    numOfElements: 5,
    numOfDataSets: 3,
    valuePosition: valuePositions[4],
    barColour: ["bar-colour-green", "bar-colour-blue", "bar-colour-yellow", "bar-colour-red"],
    barLabelColour: "darkslategray",
    titleColour: "palegreen",
    titleSize: 30,
    spacing: 70,
    chartTitle: "Nutritional Ratio Of Beverages",
    axisLabelX: "Beverage",
    axisLabelY: "Grams Per 250ml",
    axisLabelColour: "darkslategray",
    numOfTicks: 1,
    barLabels: true
  };

  switch(index){
    case 1:
      drawBarChart(animalLegsData, animalLegsSettings, barElement);
      break;
    case 2:
      drawBarChart(dreamTheaterData, dreamTheaterSettings, barElement);
      break;
    case 3:
      drawBarChart(nutritionData, nutritionSettings, barElement);
      break;
    default:
      drawBarChart(dreamTheaterData, dreamTheaterSettings, barElement);
  }

}
