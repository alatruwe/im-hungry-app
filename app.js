'use strict';
/* what I need to call the API:
- API key: 306dc4a6c06d4f93835642153baafd56
- Base URL: https://api.spoonacular.com/
*/
const baseUrlApiSpoonacular = 'https://api.spoonacular.com/';
const randomRecipeEndpoint = 'recipes/random';
const apiKeyApiSpoonacular = '306dc4a6c06d4f93835642153baafd56';
const apiHeaderApiYelp =
  'Bearer IgKbPs4muj6TgBgDOmeX0t_KrFo4MCNZU1XeFk1mMNpGw-Ln4wBtH92R7oQ1atF5jOJHuY3tQNvEqVSloH3wjukb-f5SmmStGEyY7LxEHBaib9qDijNELtxpiqfGX3Yx';

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
    <h2 id="recipe-title">${details.recipes[0].title}</h2>
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
  $('.recipe-content').append(
    `
    <input class="btn accept-recipe" value="Yum! I want that" type="submit">
    <input class="btn refuse-recipe" value="No thank you!"type="submit">
    <input class="btn end-recipe hidden-instructions" value="Done" type="submit">
    `
  );
  $('.recipe-content').removeClass('hidden');
}

function displayInstructions() {
  // hide time, servings, buttons and display instructions and end button
  $('.time, .servings, .accept-recipe, .refuse-recipe').addClass('hidden');
  // display instructions
  $('.instructions, .end-recipe').removeClass('hidden-instructions');
}

/* function displayRestaurant(){
  display list of restaurants
}*/

function restart() {
  //display start screen
  $('.recipe-content').addClass('hidden');
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
    apiKey: apiKeyApiSpoonacular,
  };
  // build api url to call to get a random recipe
  const queryString = buildQueryParams(params);
  const apiRandomRecipe =
    baseUrlApiSpoonacular + randomRecipeEndpoint + '?' + queryString;

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

/* function getRestaurant() {
  return api response
}*/

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
  $('.recipe-content').on('click', '.accept-recipe', (event) => {
    event.preventDefault();
    displayInstructions();
  });
}

function handleRefuseRecipe() {
  // event click NO button
  $('.recipe-content').on('click', '.refuse-recipe', (event) => {
    event.preventDefault();
    // display new recipe
    $('.recipe-content').empty();
    getRandomRecipe().then((responseJson) => displayRecipe(responseJson));
  });
}

/*function handleGetRestaurant() {
  // add form to ask for a location
  // save location
  // call api with getRestaurant() and displayRestaurant()
}*/

function handleRestart() {
  // event click Done button
  $('.recipe-content').on('click', '.end-recipe', (event) => {
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
