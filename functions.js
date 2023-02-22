//Prevent form from submitting when user pushes enter upon filling in an input field

$(document).ready(function() {
  $(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
});


//Bar Chart Customization Functions

//Choose how many data elements you need


//Change colour of bars
$("select").change(function(){
  let clr = $("select option:selected").val();
  barSettings.barColour = clr;
});

