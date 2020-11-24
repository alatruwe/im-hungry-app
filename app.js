'use strict';
/* what I need to call the API:
- API key: 306dc4a6c06d4f93835642153baafd56
- Base URL: https://api.spoonacular.com/
*/
const baseUrl = 'https://api.spoonacular.com/';
const randomRecipeEndpoint = 'recipes/random';
const apiKey = '306dc4a6c06d4f93835642153baafd56';

/******** RENDER FUNCTIONS ********/
function displayRecipe(details) {
  console.log(details);
  //add recipe pic, title, time and servings
  $('.recipe-content').append(
    `
    <img src=" ` + details.recipes[0].image + ` " alt="pic of the dish">
    <h2 class="title">${details.recipes[0].title}</h2>
    <p class="time">Ready in: ${details.recipes[0].readyInMinutes} minutes</p>
    <p class="servings">Servings: ${details.recipes[0].servings}</p>

    `
  )
  //add and hide recipe instructions
  if (details.recipes[0].instructions.length === 0) {
    $('.recipe-content').append(
      `<h3 class="instructions hidden-instructions">Sorry, we don't have the instructions for this recipe</h3>`
    );}
  else {
    $('.recipe-content').append(
      `<div class="instructions hidden-instructions">
        <h3>Instructions:</h3>`
        + details.recipes[0].instructions +
      `</div>`
    );
  }
  //add buttons
  $('.start-recipe').addClass('hidden');
  $('.buttons').append(
    `
    <input class="btn accept-recipe" value="Yum!" type="submit">
    <input class="btn refuse-recipe" value="No thank you!"type="submit">
    <input class="btn end-recipe hidden-instructions" value="Done" type="submit">
    `
  );
  $('.recipe-content').removeClass('hidden');
}

function displayInstructions() {
  console.log("display instructions");
  //hide time, servings, buttons and display instructions and end button
  $('.time, .servings, .accept-recipe, .refuse-recipe').addClass('hidden');
  $('.instructions, .end-recipe').removeClass('hidden-instructions');
}

function endRecipe() {
  //display start screen
  $('.recipe-content').empty();
  $('.buttons').empty();
  $('.recipe-content').addClass('hidden');
  $('.buttons').append(`
    <input class="btn start-recipe" value="Find something to cook" type="submit">
  `);
}


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
  //build api url to call to get a random recipe
  const queryString = buildQueryParams(params);
  const apiRandomRecipe = baseUrl + randomRecipeEndpoint + '?' + queryString;

  fetch(apiRandomRecipe)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .then(responseJson => displayRecipe(responseJson))
  .catch(error => {
    $('.recipe-content').text(`An error occured: ${error.message}`);
  });
} 


/******** EVENT HANDLER FUNCTIONS ********/
function handleStartClick() {
  //event click button
  $('.buttons').on('click', '.start-recipe', event => {
    event.preventDefault();
    console.log("handleStartClick");
    getRandomRecipe();
  });
}  

function handleAcceptRecipe() {
  //event click OK button
  $('.buttons').on('click', '.accept-recipe', (event) => {
    event.preventDefault();
    console.log("handleAcceptRecipe");
    displayInstructions();
  })
}  

function handleRefuseRecipe() {
    //event click NO button 
    $('.buttons').on('click', '.refuse-recipe', (event) => {
      event.preventDefault();
      console.log("handleRefuseRecipe");
      //display new recipe
      $('.recipe-content').empty();
      $('.buttons').empty();
      getRandomRecipe()
    });
}

function handleEndRecipe() {
  //event click Done button
  $('.buttons').on('click', '.end-recipe', (event) => {
    event.preventDefault();
    console.log("handleEndRecipe");
    endRecipe();
  });
}

function startApp() {
  handleStartClick()
  handleAcceptRecipe()
  handleRefuseRecipe()
  handleEndRecipe()
}

$(startApp);