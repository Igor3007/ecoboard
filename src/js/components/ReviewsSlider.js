import Splide from "@splidejs/splide";
import ReviewPopup from "./ReviewPopups";

export default class ReviewsSlider {
    constructor() {
        this.el = document.querySelector('.reviews-section__slider');
        this.slider = null;
        this.prevBtn = null;
        this.nextBtn = null;
        this.popup = null;

        this.init();
        this.addEvents();
    }

    init() {
        if (!this.el) return;

        this.slider = new Splide(this.el, {
            type: 'slide',
            perPage: 1,
            perMove: 1,
            gap: '16px',
            pagination: true,
            arrows: false,
            mediaQuery: 'min',
            breakpoints: {
                992: {
                    perPage: 3,
                    pagination: false,
                    arrows: false,
                    drag: 'free',
                },
            },
        }).mount();

        this.bindNav();
    }

    bindNav() {
        const nav = this.el.closest('.reviews-section')?.querySelector('.reviews-section__nav')
            || document.querySelector('.reviews-section__nav');

        if (!nav) return;

        this.prevBtn = nav.querySelector('.reviews-section__nav-btn--prev');
        this.nextBtn = nav.querySelector('.reviews-section__nav-btn--next');

        this.onPrev = () => this.slider.go('-');
        this.onNext = () => this.slider.go('+');

        this.prevBtn?.addEventListener('click', this.onPrev);
        this.nextBtn?.addEventListener('click', this.onNext);
    }

    addEvents() {
        // Попап работает только внутри нашего слайдера
        // this.popup = new ReviewPopup({
        //     triggerSelector: '.review-card__more',
        //     cardSelector: '.review-card',
        //     root: this.el,
        // });
    }

    destroy() {
        if (this.prevBtn && this.onPrev) {
            this.prevBtn.removeEventListener('click', this.onPrev);
        }
        if (this.nextBtn && this.onNext) {
            this.nextBtn.removeEventListener('click', this.onNext);
        }
        this.prevBtn = null;
        this.nextBtn = null;
        this.onPrev = null;
        this.onNext = null;

        this.popup?.destroy();
        this.popup = null;

        if (this.slider) {
            this.slider.destroy();
            this.slider = null;
        }
    }
}
