'use strict';
/* what I need to call the API:
- API key: 306dc4a6c06d4f93835642153baafd56
- Base URL: https://api.spoonacular.com/
*/
const baseUrl = 'https://api.spoonacular.com/';
const randomRecipeEndpoint = 'recipes/random';
const nutritionEndpoint = '/nutritionWidget.json';
const winePairingEndpoint = 'food/wine/pairing';
const apiKey = '306dc4a6c06d4f93835642153baafd56';

/******** RENDER FUNCTIONS ********/
function displayRecipe(details) {
  // add recipe pic
  if (details.recipes[0].image.length === 0) {
    $('.recipe-img').append(
      `<h3>We don't have a picture for this recipe, but we're sure it's delicious!</h3>`
    );
  } else {
    $('.recipe-img').append(
      `<img src="${details.recipes[0].image}" width=100% alt="picture of the dish">`
    );
  }

  // add title and recipe-info (time, servings and nutrition)
  $('.recipe-title').append(
    `<h2 class="title">${details.recipes[0].title}</h2>`
  );
  $('.time-servings-info').append(
    `<h3 class="time">Ready in: ${details.recipes[0].readyInMinutes} minutes</h3>
    <h3 class="servings">Servings: ${details.recipes[0].servings}</h3>`
  );
  // call api for nutrition info
  const recipeId = details.recipes[0].id;
  getNutrition(recipeId).then((responseJson) => displayNutrition(responseJson));
  // display recipe-info and accept/refuse buttons
  $('.recipe-info, .accept-recipe, .refuse-recipe').removeClass('hidden');
  $('.start').addClass('hidden');

  // add recipe instructions
  if (details.recipes[0].instructions.length === 0) {
    $('.instructions').append(
      `<h3>Sorry, we don't have the instructions for this recipe</h3>`
    );
  } else {
    $('.instructions').append(
      `<div>
        <h3>Instructions:</h3>
        <p>${details.recipes[0].instructions}</p>
      </div>`
    );
  }

  // api call for wine pairing
  const recipeIngredients = details.recipes[0].extendedIngredients;
  const meatIngredients = findMeatIngredients(recipeIngredients);
  getWinePairing(meatIngredients).then((responseJson) =>
    displayWinePairing(responseJson)
  );
}

function findMeatIngredients(details) {
  let meatIngredients = '';
  for (let i = 0; i < details.length; i++) {
    if (details[i].aisle === 'Meat') {
      meatIngredients = details[i].name;
    }
  }
  return meatIngredients;
}

function displayNutrition(details) {
  $('.nutrition-info').append(`
    <h3>Nutrition: </h3>
    <p class="carbs">carbs: ${details.carbs}</p>
    <p class="fat">fat: ${details.fat}</p>
    <p class="protein">protein: ${details.protein}</p>
  `);
}

function displayInstructions() {
  // hide recipe-info, buttons and display instructions and end button
  $('.recipe-info, .accept-recipe, .refuse-recipe').addClass('hidden');
  // display instructions
  $('.instructions, .wine-pairing, .end-recipe').removeClass('hidden');
}

function displayWinePairing(details) {
  const wineList = details.pairedWines;
  console.log(wineList);
  if (wineList.length === 0) {
    $('.wine-pairing').append(
      `<h3>Wine pairing:</h3>
      <p>We don't have a suggestion for this recipe:</p>`
    );
  } else {
    $('.wine-pairing').append(
      `<h3>Wine pairing:</h3>
        <p>We suggest:</p>
        <ul>` +
        getWineList(wineList) +
        `</ul>
        <p>${details.pairingText}</p>
      `
    );
  }
}

function getWineList(details) {
  let wineList = '';
  for (let i = 0; i < details.length; i++) {
    wineList += '<li>' + details[i] + '</li>';
  }
  return wineList;
}

function restart() {
  //display start screen
  $(
    '.recipe-img, .recipe-title, .time-servings-info, .nutrition-info, .instructions, .wine-pairing'
  ).empty();
  $('.instructions, .wine-pairing, .end-recipe').addClass('hidden');
  $('.start').removeClass('hidden');
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
      $('.section').text(`An error occured: ${error.message}`);
    });
}

function getNutrition(recipeId) {
  // api call for nutrition details
  const params = {
    apiKey: apiKey,
  };
  const queryString = buildQueryParams(params);
  const apiNutrition =
    baseUrl + 'recipes/' + recipeId + nutritionEndpoint + '?' + queryString;

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

function getWinePairing(meatIngredients) {
  // api call for nutrition details
  const params = {
    apiKey: apiKey,
    food: meatIngredients,
  };
  const queryString = buildQueryParams(params);
  const apiWinePairing = baseUrl + winePairingEndpoint + '?' + queryString;

  return fetch(apiWinePairing)
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
  $('.buttons').on('click', '.start', (event) => {
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
    $(
      '.recipe-img, .recipe-title, .time-servings-info, .nutrition-info, .instructions, .wine-pairing'
    ).empty();
    getRandomRecipe().then((responseJson) => displayRecipe(responseJson));
  });
}

function handleRestart() {
  // event click Done button
  $('.buttons').on('click', '.end-recipe', (event) => {
    event.preventDefault();
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
