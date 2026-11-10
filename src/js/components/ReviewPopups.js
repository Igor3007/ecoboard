import fslightbox from "fslightbox";

export default class ReviewPopup {
    /**
     * @param {Object} options
     * @param {string} options.triggerSelector — селектор кнопки-триггера (например, '.review-card__more')
     * @param {string} options.cardSelector   — селектор карточки, которую клонируем (например, '.review-card')
     * @param {Element|Document} options.root — корень поиска триггеров (по умолчанию document)
     */
    constructor({
        triggerSelector = '.review-card__more',
        cardSelector = '.review-card',
        root = document,
    } = {}) {
        this.triggerSelector = triggerSelector;
        this.cardSelector = cardSelector;
        this.root = root;

        this.handlers = new Map(); // trigger -> bound handler
        this.bind();
    }

    bind() {
        const triggers = this.root.querySelectorAll(this.triggerSelector);
        triggers.forEach((trigger) => {
            const handler = (e) => this.open(e);
            this.handlers.set(trigger, handler);
            trigger.addEventListener('click', handler);
        });
    }

    open(e) {
        e.stopPropagation();

        const card = e.currentTarget.closest(this.cardSelector);
        if (!card) return;

        const instance = new FsLightbox();
        instance.props.sources = [card.cloneNode(true)];
        instance.open();
    }

    destroy() {
        this.handlers.forEach((handler, trigger) => {
            trigger.removeEventListener('click', handler);
        });
        this.handlers.clear();
    }
}
