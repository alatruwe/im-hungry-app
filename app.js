'use strict';
/* what I need to call the API:
- API key: 306dc4a6c06d4f93835642153baafd56
- Base URL: https://api.spoonacular.com/
*/
const baseUrl = 'https://api.spoonacular.com/';
const randomRecipeEndpoint = 'recipes/random'
const apiKey = '306dc4a6c06d4f93835642153baafd56';


/******** RENDER FUNCTIONS ********/
//function homeScreen()
//function displayRecipe(details)
//function displayInstructions(instructions)
//function endRecipe()


/******** API CALL FUNCTIONS ********/
function buildQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  //return string with params
  return queryItems.join('&');
}

function getRandomRecipe() {
  //api call for recipe details
  const params = {
    limitLicense: "true",
    number: 1,
    apiKey: apiKey
  }

  const queryString = buildQueryParams(params);
  console.log("queryString is: " + queryString);
  const apiRandomRecipe = baseUrl + randomRecipeEndpoint + '?' + queryString;
  console.log('apiRandomRecipe is: ' + apiRandomRecipe)

  fetch(apiRandomRecipe)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .then(responseJson => console.log(responseJson))
  .catch(error => {
    $('.recipe-content').text(`An error occured: ${error.message}`);
  });
}

//function getRecipeInstructions()


/******** EVENT HANDLER FUNCTIONS ********/
function handleStartClick() {
  //event click button
  $('form').submit(event => {
    event.preventDefault();
    console.log("handleStartClick");

    //api call for recipe details - function getRandomRecipe() => return details
    const details = getRandomRecipe();
    console.log(details);
  });
}  
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