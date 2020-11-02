
//this is how to get cookies from the page script
alert(document.cookie);


var submit = document.getElementById("submit");
var fitDisplay = document.getElementById("fitLevel");

submit.addEventListener("click", function(){
	var height = document.getElementById("height").value;
	var weight = document.getElementById("lbs").value;
	if (height && weight != ''){
		event.preventDefault();
		var fitLevel = calcFit(height, weight);
		display(fitLevel);
		submit.disabled = true; 
	}
	else{
		return;
	}
});



function calcFit(height, weight){
	var bmi = (weight / height / height) * 703;
	var level = null;
	if (bmi >= 30){
		level = "beginner";
	}
	else if (25 <= bmi){
		level = "intermediate";
	}
	else{
		level = "expert";
	}

	return level;

};


function display(num){
	var heading = document.createElement("H1");
	var htext = document.createTextNode("Your estimated current fitness level is " + num + "!");
  
	var ptag = document.createElement("p");
	var fitTxt = document.createTextNode("This means that whenever you are trying to personalize your hike to your current fitness level, the app will best match you with your preferred difficulty when compared to your estimated fitness level. For example, if your fitness level is estimated to be beginner, and you choose that you want to be challeneged during the hike. The app will then match you with nearby hiking trails that are more challenging than beginner trails.");
	
        var ptag2 = document.createElement("p");
	var bmiTxt = document.createTextNode("This is calcualted based off your Body Mass Index (BMI).")
	
        var list = document.createElement("UL");
	var liBeg = document.createElement("LI"); 
	var liInt = document.createElement("LI"); 
	var liExp = document.createElement("LI");                 
	var liBegTxt = document.createTextNode("If your BMI is 30 or over, your estimated fitness level is beginner.");         
	var liIntTxt = document.createTextNode("If your BMI is 25 to 30, your estimated fitness level is intermediate.");
        var liExpTxt = document.createTextNode("If your BMI is under 25, your estimated fitness level is expert.");
  
        var img = document.createElement("img");
        img.src = "/public/images/bmi.jpg"
  
        // Adds 3 elements to list
	liBeg.appendChild(liBegTxt);     
	liInt.appendChild(liIntTxt); 
	liExp.appendChild(liExpTxt);                          
	list.appendChild(liBeg);
	list.appendChild(liInt);
	list.appendChild(liExp);
  
	// Adds text to appropriate tag
	heading.appendChild(htext);
	ptag.appendChild(fitTxt);
	ptag2.appendChild(bmiTxt);
  
	// Adds each tag to fitDisplay div
	fitDisplay.appendChild(heading);
	fitDisplay.appendChild(ptag);
	fitDisplay.appendChild(ptag2);
	fitDisplay.appendChild(list);
	fitDisplay.appendChild(img);
};
