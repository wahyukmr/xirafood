import icons from "url:../../img/icons.svg";

// exporting the class itself (not creating an instance of the View class)
export default class View {
    _data;

    /**
     * Render the recived to the DOM
     * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
     * @param {Boolean} [render=true] if false, create markup string instead of rendering to the DOM
     * @returns {undefined | string} a markup string is returned if rendering=false
     * @this {Object} View instance
     * @author Wahyukh
     * @todo Finish implementation
     */
    render(data, render = true) {
        // if there is no data or if there is, the data is an array and it is empty
        if (!data || (Array.isArray(data) && !data.length))
            return this.renderError();

        this._data = data;
        const markup = this._generateMarkup();

        if (!render) return markup;

        this._clear();
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    }

    update(data) {
        this._data = data;
        const newMarkup = this._generateMarkup();

        // ALGORITHM : TO UPDATE THE TEXT AND DOM ATTRIBUTES, without having to re-render the entire view
        // Make a new range object and create a DocumentFragment object with initial content
        const newDOM = document
            .createRange()
            .createContextualFragment(newMarkup);
        // Compares the new (virtual) element and the original (current) element in HTML
        const newElements = Array.from(newDOM.querySelectorAll("*")); // Array.from() = konvert to an array
        const currentAlements = Array.from(
            this._parentElement.querySelectorAll("*")
        );

        // loop over the new element
        newElements.forEach((newEl, i) => {
            const curnEl = currentAlements[i];

            // Method isEqualNode = compares content, returns false if curnEl is different from newEl (parent element will also be false)
            // console.log(curnEl, newEl.isEqualNode(curnEl));

            // UPDATE CHANGED TEXT (only executes the element that contains text directly)
            if (
                !newEl.isEqualNode(curnEl) &&
                newEl.firstChild?.nodeValue.trim() !== ""
            ) {
                // updates the text content of the current element(on the page) to a new element
                curnEl.textContent = newEl.textContent;
            }

            // UPDATE CHANGED ATTRIBUTES
            if (!newEl.isEqualNode(curnEl))
                Array.from(newEl.attributes).forEach((attributes) =>
                    curnEl.setAttribute(attributes.name, attributes.value)
                );
        });
    }

    _clear() {
        this._parentElement.innerHTML = "";
    }

    // create loading spinner (public method, so controller can use it)
    renderSpinner() {
        const markup = `
            <div class="spinner">
                <svg>
                    <use href="${icons}#icon-loader"></use>
                </svg>
            </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    }

    renderError(message = this._errorMessage) {
        const markup = `
        <div class="error">
            <div>
                <svg>
                    <use
                        href="${icons}#icon-alert-triangle"
                    ></use>
                </svg>
            </div>
            <p>${message}</p>
        </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    }

    renderMessage(message = this._message) {
        const markup = `
        <div class="message">
            <div>
                <svg>
                    <use
                        href="${icons}#icon-smile"
                    ></use>
                </svg>
            </div>
            <p>${message}</p>
        </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    }
}
