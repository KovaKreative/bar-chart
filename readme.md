# Bar Chart

## About
This page will allow you to input various data and create a visual representation of that data as a bar chart

This probject was created as a stretch goal for the Prep Module for the Lighthouse Labs Web Development Bootcamp

It was completed over the course of roughtly 24 hours of continuous work from scratch.

Defining your chart data and settings is done through a simple HTML interface, which then works with JavaScript and jQuery to generate the bar graph using HTML elements and CSS styles.

You can enter the data in the following form:

![Bar chart form](/img/screen2.png)

Once you click the button to generate the chart, it will produce something that looks like this:

![Bar chart example](/img/screen1.png)

The main function that generates the graph is the drawBarChart function, which takes in an array of Data, an object of options, and the HTML element which will contain the bar graph.

The data array consists of the label information in index 0, which in itself is a 2 dimensional array, consisting of the labels for each individual data element, and the labels for each separate set of data if applicable.
Index 1, 2, 3, etc. all contain an array of numbers for each set of data.

The drawBarChart function establishes a few local variables, then executes three main local functions:
One to establish the range of numbers that the data will need to represent, one to generate the HTML elements require for th bar chart, and one to stylize the CSS elements based on the settings.

In addition, this bar chart generator uses several other functions:

updateDataInputFields takes no parameters, and simply refreshes the HTML of the form to reflect how many bar elements and sets of data the user wants to edit and display.

updateNumberOfDataSets takes in a number value from the HTML form and makes the amount of data sets equivalent to that value.

updateNumberOfElements takes in a number value from the HTML form and makes the amount of data items (number of bars) equivalent to that value.

updateChartOptions takes in a property and a value parameters, and updates the bar settings object accordingly. It's a simple but versatile function that can be used to change any property of the settings object.

updateBarColour takes in an index, and a value parameters and updates the array which lists what colour each data set will be. It then makes sure that if there is alreay another data set with that colour, that it switches the colours around so that multiple data sets don't have the same colour.

writeLabel and writeData functions both simply update the data array, one updating the labels, the other updating the values of the data. they both take in an index and a value parameters, with the writeLabel function taking in an additional subindex parameter to access the two sets of data arrays.

At the moment, you are able to have data of up to 20 separate bars, which each bar potentially stacking 4 sets of data each. You can assign them up to four different colours. These limitations were implemented for the purpose of simplicity and because stacking too many sets of data can potentially make it harder to read and decipher.

List of future features:

At the moment, you can choose the colours through a drop down menu, where you only get a choice of four colours. Adding additional colours this way would bloat the code, so in the future, I would like to implement a colour picker that would allow the user to choose their own colours from the entire spectrum.

I would also like to include the option to resize your graph dynamically, which would open up the possibility to work with larger sets of data that won't look too cluttered.

This project was made from scratch, using HTML, CSS, JavaScript and the jQuery library using primarily educational websites and a lot of trial and error and tinkering.
The main outside resources used for this project were:

[https://www.w3schools.com](https://www.w3schools.com/)

[https://developer.mozilla.org](https://developer.mozilla.org/)

[https://stackoverflow.com](https://stackoverflow.com/)
