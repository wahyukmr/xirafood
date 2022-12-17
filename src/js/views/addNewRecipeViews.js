import View from "./View";
import icons from "url:../../img/icons.svg";

class AddNewRecipeViews extends View {
    _parentElement = document.querySelector(".upload");
    _message = "Recipe was successfully added";

    _window = document.querySelector(".add-recipe-window");
    _overlay = document.querySelector(".overlay");
    _btnOpen = document.querySelector(".nav__btn--add-recipe");
    _btnClose = document.querySelector(".btn--close-modal");

    constructor() {
        super();
        this._addHandlerShowWindow();
        this._addHandlerHiddenWindow();
    }

    toggleWindow() {
        this._overlay.classList.toggle("hidden");
        this._window.classList.toggle("hidden");
    }

    // to display this window, there is no need to interfere with the controller file
    _addHandlerShowWindow() {
        this._btnOpen.addEventListener("click", this.toggleWindow.bind(this));
    }

    _addHandlerHiddenWindow() {
        this._btnClose.addEventListener("click", this.toggleWindow.bind(this));
        this._overlay.addEventListener("click", this.toggleWindow.bind(this));
    }

    addHandlerUpload(handler) {
        this._parentElement.addEventListener("submit", function (e) {
            e.preventDefault();
            // FormData = selects all the form elements one by one, then reads the value property of all of them
            const dataArray = [...new FormData(this)];
            const dataObject = Object.fromEntries(dataArray); // convert entries to objects
            handler(dataObject);
        });
    }
}
export default new AddNewRecipeViews();
