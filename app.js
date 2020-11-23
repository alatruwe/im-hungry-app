'use strict';
/* what I need to call the API:
- API key: 306dc4a6c06d4f93835642153baafd56
- Base URL: https://api.spoonacular.com/
*/

/******** RENDER FUNCTIONS ********/
//function homeScreen()
//function displayRecipe(details)
//function displayInstructions(instructions)
//function endRecipe()


/******** API CALL FUNCTIONS ********/
//function getRandomRecipe()
//function getRecipeInstructions()


/******** EVENT HANDLER FUNCTIONS ********/
function handleStartClick() {
  //event click button
  $('form').submit(event => {
    event.preventDefault();
    console.log("handleStartClick")
    
  });
}  
  //api call for recipe details - function getRandomRecipe() => return details
  //function displayRecipe(details)

//function handleAcceptRecipe()
  //event click OK button
  //api call for recipe instructions - function getRecipeInstructions() => return instructions
  //function displayInstructions(instructions)

//function handleNewRecipe()
  //event click NO button 
  //api call for recipe details - function getRandomRecipe() => return details
  //function displayRecipe(details)

//function handleEndRecipe()
  //event click button Done
  //function homeScreen()  

function startApp() {
  handleStartClick()
  //handleAcceptRecipe()
  //handleNewRecipe()
  //handleEndRecipe()
}

$(startApp);