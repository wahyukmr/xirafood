import View from "./View";
import icons from "url:../../img/icons.svg"; // importing file icons

class PaginationView extends View {
    _parentElement = document.querySelector(".pagination");

    addHandlerPagination(handler) {
        this._parentElement.addEventListener("click", function (e) {
            const button = e.target.closest(".btn--inline");
            if (!button) return;

            const gotoPage = +button.dataset.goto;

            handler(gotoPage);
        });
    }

    _generateMarkup() {
        const currentPage = this._data.page;
        const numPage = Math.ceil(
            this._data.results.length / this._data.resultPerPage
        );

        const generateMarkupButtonNext = `
            <button data-goto="${
                currentPage + 1
            }" class="btn--inline pagination__btn--next">
                <span>Page ${currentPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
        `;

        const generateMarkupButtonPrev = `
            <button data-goto="${
                currentPage - 1
            }" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${currentPage - 1}</span>
            </button>
        `;

        // Page 1, and there are other pages
        if (currentPage === 1 && numPage > 1) {
            return generateMarkupButtonNext;
        }

        // Last page
        if (currentPage === numPage && numPage > 1) {
            return generateMarkupButtonPrev;
        }

        // Other page
        if (currentPage < numPage) {
            return generateMarkupButtonPrev + generateMarkupButtonNext;
        }

        // Page 1, and there are NO other pages
        return "";
    }
}
export default new PaginationView();
