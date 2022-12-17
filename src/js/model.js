import { _ } from "core-js";
import { async } from "regenerator-runtime";
import { API_URL, RESULT_PER_PAGE, KEY } from "./config.js";
import { AJAX } from "./helpers.js";

// contains recipes
export const state = {
    recipe: {},
    search: {
        query: {},
        results: [],
        page: 1,
        resultPerPage: RESULT_PER_PAGE,
    },
    bookmarks: [],
};

function createRecipeObject(data) {
    const { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        // CONTITIONALLY ADD PROPERTIES TO OBJECT (if recipe.key evaluates to false/none then nothing will happen, if it evaluates to true then the second part will be executed and returned)
        ...(recipe.key && { key: recipe.key }),
    };
}

// retrieve recipe data from Forkify API
export async function loadRecipe(getId) {
    try {
        const dataResult = await AJAX(`${API_URL}${getId}?key=${KEY}`);
        state.recipe = createRecipeObject(dataResult);

        // some method = loops through the arrays and then returns true if any of them actually has the specified condition
        if (state.bookmarks.some((bookmark) => bookmark.id === getId))
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;
    } catch (err) {
        // temp error handling
        throw err;
    }
}

// Make an AJAX call
export async function loadSearchResults(query) {
    try {
        state.search.query = query;

        const dataResult = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

        state.search.results = dataResult.data.recipes.map((recipe) => {
            return {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                image: recipe.image_url,
                ...(recipe.key && { key: recipe.key }),
            };
        });

        state.search.page = 1;
    } catch (err) {
        throw err;
    }
}

export function getSearchResultsPage(page = state.search.page) {
    // Update the current page
    state.search.page = page;

    const start = (page - 1) * state.search.resultPerPage; // 0
    const end = page * state.search.resultPerPage; // 10

    return state.search.results.slice(start, end); // results 0 - 9
}

export function updateServings(newServings) {
    state.recipe.ingredients.forEach((ing) => {
        // new quantity = (old quantity * new servings) / old servings
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    });

    state.recipe.servings = newServings;
}

// Save data bookmarks on local storage
function persisBookmarks() {
    localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
}

// A common pattern in programming when adding something, we have to get its data as a parameter
export function addBookmark(recipe) {
    // add bookmarks
    state.bookmarks.push(recipe);

    // Mark current recipe as Bookmarked
    recipe.bookmarked = true;

    persisBookmarks();
}

// when want to delete something, just get the id only
export function deleteBookmark(id) {
    // remove bookmarks
    const getIndexTrue = state.bookmarks.findIndex(
        (element) => element.id === id
    );
    state.bookmarks.splice(getIndexTrue, 1);

    // Mark current recipe as NOT Bookmarked
    state.recipe.bookmarked = false;

    persisBookmarks();
}

// get bookmark from local storage
function init() {
    const storage = localStorage.getItem("bookmarks");
    if (storage) state.bookmarks = JSON.parse(storage);
}
init();

// delete bookmarks from local storage
// function clearBookmarks() {
//     localStorage.clear("bookmarks");
// }
// clearBookmarks()

export async function uploadNewRecipe(newRecipes) {
    try {
        console.log(newRecipes);
        const ingredients = Object.entries(newRecipes)
            .filter(
                (entry) => entry[0].startsWith("ingredient") && entry[1] !== ""
            )
            .map((ingredient) => {
                const ingredientsArray = ingredient[1]
                    .split(",")
                    .map((el) => el.trim());

                if (ingredientsArray.length !== 3)
                    throw new Error("Wrong ingredient format");

                const [quantity, unit, description] = ingredientsArray;
                return {
                    quantity: quantity ? +quantity : null,
                    unit,
                    description,
                };
            });

        const recipe = {
            title: newRecipes.title,
            source_url: newRecipes.sourceUrl,
            image_url: newRecipes.image,
            publisher: newRecipes.publisher,
            cooking_time: newRecipes.cookingTime,
            servings: newRecipes.servings,
            ingredients,
        };
        console.log(recipe);

        const newRecipeFromAPI = await AJAX(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = createRecipeObject(newRecipeFromAPI);
        addBookmark(state.recipe);
    } catch (err) {
        throw err;
    }
}
