import View from "./View.js";
import previewViews from "./previewViews.js";

class BookmarksViews extends View {
    _parentElement = document.querySelector(".bookmarks__list");
    _errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it";
    _message = "";

    addHandlerRender(handler) {
        window.addEventListener("load", handler);
    }

    _generateMarkup() {
        return this._data
            .map((bookmark) => previewViews.render(bookmark, false))
            .join("");
    }
}

export default new BookmarksViews();
