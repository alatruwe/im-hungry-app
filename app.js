'use strict';

const baseUrl = 'https://api.spoonacular.com/';
const randomRecipeEndpoint = 'recipes/random';
const nutritionEndpoint = '/nutritionWidget.json';
const winePairingEndpoint = 'food/wine/pairing';
const apiKey = '306dc4a6c06d4f93835642153baafd56';

/******** RENDER FUNCTIONS ********/
function displayRecipeElements(details) {
  // api call for nutrition info
  const recipeId = details.recipes[0].id;
  getNutrition(recipeId).then((responseJson) => displayNutrition(responseJson));

  // api call for wine pairing
  const recipeIngredients = details.recipes[0].extendedIngredients;
  const meatIngredients = findMeatIngredients(recipeIngredients);
  getWinePairing(meatIngredients).then((responseJson) =>
    displayWinePairing(responseJson)
  );

  displayImage(details);
  displayTitle(details);
  displayRecipeInfo(details);
  addInstructions(details);

  $('.recipe-info, .accept-recipe, .refuse-recipe').removeClass('hidden');
  $('.start').addClass('hidden');
}

function displayImage(details) {
  if (details.recipes[0].image.length === 0) {
    $('.recipe-img').append(
      `<h3>We don't have a picture for this recipe, but we're sure it's delicious!</h3>`
    );
  } else {
    $('.recipe-img').append(
      `<img src="${details.recipes[0].image}" width=100% alt="picture of the dish">`
    );
  }
}

function displayTitle(details) {
  if (details.recipes[0].title.length === 0) {
    $('.recipe-title').append(
      `<h2 class="title">Oops, we don't know the name of this recipe</h2>`
    );
  } else {
    $('.recipe-title').append(
      `<h2 class="title">${details.recipes[0].title}</h2>`
    );
  }
}

function displayRecipeInfo(details) {
  // time info
  if (details.recipes[0].readyInMinutes === 0) {
    $('.time-servings-info').append(
      `<h3 class="time">Ready in: oops, we don't know how long this recipe takes to make</h3>`
    );
  } else {
    $('.time-servings-info').append(
      `<h3 class="time">Ready in: ${details.recipes[0].readyInMinutes} minutes</h3>`
    );
  }
  // servings info
  if (details.recipes[0].servings === 0) {
    $('.time-servings-info').append(
      `<h3 class="servings">Servings: oops, we don't know how many servings this recipe yields</h3>`
    );
  } else {
    $('.time-servings-info').append(
      `<h3 class="servings">Servings: ${details.recipes[0].servings}</h3>`
    );
  }
}

function displayNutrition(details) {
  if (details.carbs === 0 || details.fat === 0 || details.protein === 0) {
    $('.nutrition-info').append(`
    <h3>Nutrition: </h3>
    <p class="carbs">Oops, we don't have this information</p>
  `);
  } else {
    $('.nutrition-info').append(`
    <h3>Nutrition: </h3>
    <p class="carbs">carbs: ${details.carbs}</p>
    <p class="fat">fat: ${details.fat}</p>
    <p class="protein">protein: ${details.protein}</p>
  `);
  }
}

function addInstructions(details) {
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
}

function displayInstructions() {
  $('.recipe-info, .accept-recipe, .refuse-recipe').addClass('hidden');
  $('.instructions, .wine-pairing, .end-recipe').removeClass('hidden');
}

function displayWinePairing(details) {
  const wineList = details.pairedWines;
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

function findMeatIngredients(details) {
  let meatIngredients = '';
  for (let i = 0; i < details.length; i++) {
    if (details[i].aisle === 'Meat') {
      meatIngredients = details[i].name;
    }
  }
  return meatIngredients;
}

function getWineList(details) {
  let wineList = '';
  for (let i = 0; i < details.length; i++) {
    wineList += '<li>' + details[i] + '</li>';
  }
  return wineList;
}

function restart() {
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
  // api call for wine pairing
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
  $('.buttons').on('click', '.start', (event) => {
    event.preventDefault();
    getRandomRecipe().then((responseJson) =>
      displayRecipeElements(responseJson)
    );
  });
}

function handleAcceptRecipe() {
  $('.buttons').on('click', '.accept-recipe', (event) => {
    event.preventDefault();
    displayInstructions();
  });
}

function handleRefuseRecipe() {
  $('.buttons').on('click', '.refuse-recipe', (event) => {
    event.preventDefault();
    $(
      '.recipe-img, .recipe-title, .time-servings-info, .nutrition-info, .instructions, .wine-pairing'
    ).empty();
    getRandomRecipe().then((responseJson) =>
      displayRecipeElements(responseJson)
    );
  });
}

function handleRestart() {
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
