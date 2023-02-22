
//Bar Chart Customization Functions

//Choose how many data elements you need


//Change colour of bars
$("select").change(function(){
  let clr = $("select option:selected").val();
  barSettings.barColour = clr;
});

