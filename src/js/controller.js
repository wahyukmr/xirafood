import * as model from "./model.js";
import { MODEL_CLOSE_SEC } from "./config.js";
import recipeViews from "./views/recipeViews.js";
import searchViews from "./views/searchViews.js";
import resultsViews from "./views/resultsViews.js";
import paginationViews from "./views/paginationViews.js";
import bookmarksViews from "./views/bookmarksViews.js";
import addNewRecipeViews from "./views/addNewRecipeViews.js";

import "core-js/actual"; // polyfilling everything else
import "regenerator-runtime/runtime"; // polyfilling async/await
import { async } from "regenerator-runtime";

// API
// https://forkify-api.herokuapp.com/v2

// MAKE AN AJAX REQUEST TO THE API
async function controlRecipes() {
    try {
        const getId = window.location.hash.slice(1);

        if (!getId) return;
        recipeViews.renderSpinner();

        // 0. UPDATE RESULT VIEW TO MARK SELECTED SEARCH RESULTS
        resultsViews.update(model.getSearchResultsPage());

        // 1. LOADING THE RECIPE
        // await is used to handle this function that returns a Promise
        await model.loadRecipe(getId);

        // 2. RENDERING RECIPE TO THE SCREEN WITH DATA FROM API
        // const recipeView = new recipeView(model.state.recipe);
        recipeViews.render(model.state.recipe); // render method will receive the data and will store it in the object
    } catch (err) {
        recipeViews.renderError(`${err} ⛔`);
    }
}

async function controlSearchResult() {
    try {
        resultsViews.renderSpinner();

        // 1. Get search query
        const query = searchViews.getQuery();
        if (!query) return;

        // 2. Load search results
        await model.loadSearchResults(query);

        // 3. Render results
        // resultsView.render(model.state.search.results);
        resultsViews.render(model.getSearchResultsPage());

        // 4. Render initial pagination buttons
        paginationViews.render(model.state.search);
    } catch (err) {
        console.log(err);
    }
}

// will be executed every time a button is clicked
function controlPagination(gotoPage) {
    // Render NEW result
    resultsViews.render(model.getSearchResultsPage(gotoPage));

    //Render new pagination buttons
    paginationViews.render(model.state.search);
}

function controlServings(newServings) {
    // Update the servings (in state)
    model.updateServings(newServings);

    // Update the recipeView
    recipeViews.update(model.state.recipe);
}

function controlAddBookmark() {
    // 1. Add / remove bookmark
    if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
    else model.deleteBookmark(model.state.recipe.id);

    // 2. Update recipe view
    recipeViews.update(model.state.recipe);

    // 3. Render bookmarks
    bookmarksViews.render(model.state.bookmarks);
}

function controlBookmark() {
    bookmarksViews.render(model.state.bookmarks);
}

async function controlAddNewRecipe(newRecipeData) {
    try {
        // add render spinner
        addNewRecipeViews.renderSpinner();

        // Upload the new recipe data
        await model.uploadNewRecipe(newRecipeData);

        // Render the new recipe
        recipeViews.render(model.state.recipe);

        // Success message
        addNewRecipeViews.renderMessage();

        // Render Bookmarks view
        bookmarksViews.render(model.state.bookmarks);

        // Change ID in URL
        window.history.pushState(null, "", `#${model.state.recipe.id}`);

        // Close form window
        setTimeout(function () {
            addNewRecipeViews.toggleWindow();
            location.reload();
        }, MODEL_CLOSE_SEC * 1000);
    } catch (err) {
        addNewRecipeViews.renderError(err.message);
    }
}

// the Publisher-Subscriber design pattern
function init() {
    bookmarksViews.addHandlerRender(controlBookmark);
    recipeViews.addHandlerRender(controlRecipes);
    recipeViews.addHandlerUpdateNewServings(controlServings);
    recipeViews.addHandlerBookmark(controlAddBookmark);
    searchViews.addHandlerSearch(controlSearchResult);
    paginationViews.addHandlerPagination(controlPagination);
    addNewRecipeViews.addHandlerUpload(controlAddNewRecipe);
}
init();
