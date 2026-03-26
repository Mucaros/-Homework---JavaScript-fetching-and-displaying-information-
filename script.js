/*
Mapping from MealDB Categories to TheCocktailDB drink ingredient
You can customize or expand this object to suit your needs.
*/
const mealCategoryToCocktailIngredient = {
  Beef: "whiskey",
  Chicken: "gin",
  Dessert: "amaretto",
  Lamb: "vodka",
  Miscellaneous: "vodka",
  Pasta: "tequila",
  Pork: "tequila",
  Seafood: "rum",
  Side: "brandy",
  Starter: "rum",
  Vegetarian: "gin",
  Breakfast: "vodka",
  Goat: "whiskey",
  Vegan: "rum",
  // Add more if needed; otherwise default to something like 'cola'
};

/*
    2) Main Initialization Function
       Called on page load to start all the requests:
       - Fetch random meal
       - Display meal
       - Map meal category to spirit
       - Fetch matching (or random) cocktail
       - Display cocktail
*/
function init() {
  fetchRandomMeal()
    .then((meal) => {
      displayMealData(meal);
      const spirit = mapMealCategoryToDrinkIngredient(meal.strCategory);
      return fetchCocktailByDrinkIngredient(spirit);
    })
    .then((cocktail) => {
      displayCocktailData(cocktail);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

/*
 Fetch a Random Meal from TheMealDB
 Returns a Promise that resolves with the meal object
 */

async function fetchRandomMeal() {
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
  const data = await response.json()
  return data.meals[0]
}
/*
Display Meal Data in the DOM
Receives a meal object with fields like:
  strMeal, strMealThumb, strCategory, strInstructions,
  strIngredientX, strMeasureX, etc.
*/

function displayMealData(meal) {
  // current meal info
  const currentMeal = meal.strMeal
  const mealThumb = meal.strMealThumb
  const instructions = meal.strInstructions
  const category = meal.strCategory
  const ingredients = []
  const measurements = []

  for (const mealItem in meal) {
    if (mealItem.includes('strIngredient') && meal[mealItem] !== '') {
      ingredients.push(meal[mealItem])
    }
    else if (mealItem.includes('strMeasure') && meal[mealItem] !== '') {
      measurements.push(meal[mealItem])
    }
  }
  
  const mealInfoArray = [currentMeal, instructions, category]
  const mealContainer = document.querySelector('.meal')
  const table = document.createElement('table')
  const mealImg = document.createElement('img')
  mealImg.src = mealThumb


  mealContainer.append(mealImg)

  for (const mealVariableInfo of mealInfoArray) {
    const paragraph = document.createElement('p')
    paragraph.textContent = mealVariableInfo
    mealContainer.append(paragraph)
  }

  mealContainer.append(table)

  //adds a youtube video for the recipe, if present
  if(meal.strYoutube){
    const video=meal.strYoutube.split("v=")[1];
    const iframe=document.createElement("iframe");

    iframe.src=`https://www.youtube.com/embed/${videoId}`;
    iframe.width="300";
    iframe.height="200";

    mealContainer.append(iframe);
  }

  for (let i = 0; i < ingredients.length; i++) {
    const tableRow = document.createElement('tr')
    const tableData1 = document.createElement('td')
    const tableData2 = document.createElement('td')

    tableData1.textContent = ingredients[i]
    tableData2.textContent = measurements[i]

    tableRow.append(tableData1)
    tableRow.append(tableData2)
    table.append(tableRow)
  }
}


/*
Convert MealDB Category to a TheCocktailDB Spirit
Looks up category in our map, or defaults to 'cola'
*/

function mapMealCategoryToDrinkIngredient(category) {
  if (!category) return "cola";
  return mealCategoryToCocktailIngredient[category] || "cola";
}

/*
Fetch a Cocktail Using a Spirit from TheCocktailDB
Returns Promise that resolves to cocktail object
We call https://www.thecocktaildb.com/api/json/v1/1/search.php?s=DRINK_INGREDIENT to get a list of cocktails
Don't forget encodeURIComponent()
If no cocktails found, fetch random
*/

async function fetchCocktailByDrinkIngredient(drinkIngredient) {
  const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drinkIngredient}`)
  const data = await response.json()
  return data.drinks
}

/*
Fetch a Random Cocktail (backup in case nothing is found by the search)
Returns a Promise that resolves to cocktail object
*/
async function fetchRandomCocktail(drinkIngredient) {
  const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
  const data = await response.json()
    
  if (!data.drinks) {
    return fetchRandomCocktail()
  }
  
  return data.drinks
}


/*
Display Cocktail Data in the DOM
*/
function displayCocktailData(cocktail) {
  const randomCocktail = cocktail[Math.floor(Math.random() * cocktail.length)];
  const drinkName = randomCocktail.strDrink
  const drinkThumb = randomCocktail.strDrinkThumb

  const drinkContainer = document.querySelector('.cocktail')
  const img = document.createElement('img')
  img.src = drinkThumb
  drinkContainer.append(img)

  const paragraph = document.createElement('p')
  paragraph.textContent = drinkName
  drinkContainer.append(drinkName)


  // ingredients and measurements
  const ingredients = []
  const measurements = []

  for (const cocktailItem in randomCocktail){
    if (cocktailItem.includes('strIngredient') && randomCocktail[cocktailItem] !== null) {
      ingredients.push(randomCocktail[cocktailItem])}
    else if (cocktailItem.includes('strMeasure') && randomCocktail[cocktailItem] !== null) {
      measurements.push(randomCocktail[cocktailItem])}  
  }
  
  // table with measurements and ingredients
  const table = document.createElement('table')

  for (let i = 0; i < ingredients.length; i++) {
    const tableRow = document.createElement('tr')
    const tableData1 = document.createElement('td')
    const tableData2 = document.createElement('td')

    tableData1.textContent = ingredients[i]
    tableData2.textContent = measurements[i]

    tableRow.append(tableData1)
    tableRow.append(tableData2)
    table.append(tableRow)
  }

  drinkContainer.append(table)
}

/*
Call init() when the page loads
*/
window.onload = init;
