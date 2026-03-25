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
  const data = response.json()
  return data
}
/*
Display Meal Data in the DOM
Receives a meal object with fields like:
  strMeal, strMealThumb, strCategory, strInstructions,
  strIngredientX, strMeasureX, etc.
*/

function displayMealData(meal) {
  const mealInfo = meal.meals[0]

  // current meal info
  const currentMeal = mealInfo.strMeal
  const mealThumb = mealInfo.strMealThumb
  const instructions = mealInfo.strInstructions
  const category = mealInfo.strCategory
  const ingredients = []
  const measurements = []

  for (const mealItem in mealInfo) {
    if (mealItem.includes('strIngredient') && mealInfo[mealItem] !== '') {
      ingredients.push(mealInfo[mealItem])
    }
    else if (mealItem.includes('strMeasure') && mealInfo[mealItem] !== '') {
      measurements.push(mealInfo[mealItem])
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

function fetchCocktailByDrinkIngredient(drinkIngredient) {
  // Fill in
}

/*
Fetch a Random Cocktail (backup in case nothing is found by the search)
Returns a Promise that resolves to cocktail object
*/
function fetchRandomCocktail() {
  // Fill in
}

/*
Display Cocktail Data in the DOM
*/
function displayCocktailData(cocktail) {
  // Fill in
}

/*
Call init() when the page loads
*/
window.onload = init;
