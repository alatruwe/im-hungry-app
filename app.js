'use strict';
/* what I need to call the API:
- API key: 306dc4a6c06d4f93835642153baafd56
- Base URL: https://api.spoonacular.com/
*/
const baseUrl = 'https://api.spoonacular.com/recipes/';
const randomRecipeEndpoint = 'random';
const nutritionEndpoint = '/nutritionWidget.json';
const apiKey = '306dc4a6c06d4f93835642153baafd56';

/******** RENDER FUNCTIONS ********/
function displayRecipe(details) {
  console.log(details);
  // add recipe pic
  if (details.recipes[0].image.length === 0) {
    $('.recipe-content').append(
      `<h3>We don't have a picture for this recipe, but we're sure it's delicious!</h3>`
    );
  } else {
    $('.recipe-content').append(
      `<img src="${details.recipes[0].image}" width=100% alt="picture of the dish">`
    );
  }
  // add title, time and servings
  $('.recipe-content').append(
    `
    <h2 class="title">${details.recipes[0].title}</h2>
    <p class="time">Ready in: ${details.recipes[0].readyInMinutes} minutes</p>
    <p class="servings">Servings: ${details.recipes[0].servings}</p>

    `
  );
  // add and hide recipe instructions
  if (details.recipes[0].instructions.length === 0) {
    $('.recipe-content').append(
      `<h3 class="instructions hidden-instructions">Sorry, we don't have the instructions for this recipe</h3>`
    );
  } else {
    $('.recipe-content').append(
      `<div class="instructions hidden-instructions">
        <h3>Instructions:</h3>` +
        details.recipes[0].instructions +
        `</div>`
    );
  }
  // add buttons
  $('.buttons').append(
    `
    <input class="btn accept-recipe" value="Yum! I want that" type="submit">
    <input class="btn refuse-recipe" value="No thank you!"type="submit">
    <input class="btn end-recipe hidden-instructions" value="Done" type="submit">
    `
  );
  // call api for nutrition info
  const recipeId = details.recipes[0].id;
  getNutrition(recipeId).then((responseJson) => displayNutrition(responseJson));

  $('.recipe-content').removeClass('hidden');
  $('.start-recipe').addClass('hidden');
}

function displayNutrition(details) {
  console.log(details);
  $('.recipe-content').append(`
    <p class="nutrition-content">Nutrition: </p>
    <p class="carbs">carbs: ${details.carbs}</p>
    <p class="fat">fat: ${details.fat}</p>
    <p class="protein">protein: ${details.protein}</p>
  `);
}

function displayInstructions() {
  // hide time, servings, buttons and display instructions and end button
  $(
    '.time, .servings, .nutrition-content, .carbs, .fat, .protein, .accept-recipe, .refuse-recipe'
  ).addClass('hidden');
  // display instructions
  $('.instructions, .end-recipe').removeClass('hidden-instructions');
}

function restart() {
  //display start screen
  $('.recipe-content').addClass('hidden');
  $('.buttons').empty();
  $('.buttons')
    .append(`<input class="btn start-recipe" value="Find a recipe" type="submit">
  `);
}

/******** API CALL FUNCTIONS ********/
function buildQueryParams(params) {
  const queryItems = Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  //return string with params
  return queryItems.join('&');
}

function getRandomRecipe() {
  // api call for recipe details
  const params = {
    limitLicense: 'true',
    number: 1,
    tags: 'meat',
    apiKey: apiKey,
  };
  const queryString = buildQueryParams(params);
  const apiRandomRecipe = baseUrl + randomRecipeEndpoint + '?' + queryString;

  return fetch(apiRandomRecipe)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .catch((error) => {
      $('.recipe-content').text(`An error occured: ${error.message}`);
    });
}

function getNutrition(recipeId) {
  // api call for nutrition details
  const params = {
    apiKey: apiKey,
  };
  const queryString = buildQueryParams(params);
  const apiNutrition =
    baseUrl + recipeId + nutritionEndpoint + '?' + queryString;

  return fetch(apiNutrition)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .catch((error) => {
      $('.recipe-content').text(`An error occured: ${error.message}`);
    });
}

/******** EVENT HANDLER FUNCTIONS ********/
function handleGetRecipe() {
  // event click button
  $('.buttons').on('click', '.start-recipe', (event) => {
    event.preventDefault();
    getRandomRecipe().then((responseJson) => displayRecipe(responseJson));
  });
}

function handleAcceptRecipe() {
  // event click OK button
  $('.buttons').on('click', '.accept-recipe', (event) => {
    event.preventDefault();
    displayInstructions();
  });
}

function handleRefuseRecipe() {
  // event click NO button
  $('.buttons').on('click', '.refuse-recipe', (event) => {
    event.preventDefault();
    // display new recipe
    $('.recipe-content, .buttons').empty();
    getRandomRecipe().then((responseJson) => displayRecipe(responseJson));
  });
}

function handleRestart() {
  // event click Done button
  $('.buttons').on('click', '.end-recipe', (event) => {
    event.preventDefault();
    $('.recipe-content').empty();
    restart();
  });
}

function startApp() {
  handleGetRecipe();
  handleAcceptRecipe();
  handleRefuseRecipe();
  handleRestart();
}

$(startApp);
