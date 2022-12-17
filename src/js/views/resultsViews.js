import View from "./View.js";
import previewViews from "./previewViews.js";

class ResultsView extends View {
    _parentElement = document.querySelector(".results");
    _errorMessage = "No recipe found for your query! Please try again...";
    _message = "";

    _generateMarkup() {
        return this._data
            .map((result) => previewViews.render(result, false))
            .join("");
    }
}

export default new ResultsView();
