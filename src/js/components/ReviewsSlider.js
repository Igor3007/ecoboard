import Splide from "@splidejs/splide";
import fslightboxssssssssssssssssssssssssss from "fslightbox";

export default class ReviewsSlider {
    constructor() {
      this.el = document.querySelector('.reviews-section__slider');
      this.slider = null;
      this.prevBtn = null;
      this.nextBtn = null;
      this.init()
      this.addEvents()
    }

    init() {
      if (!this.el) return;

      this.slider = new Splide(this.el, {
        type: 'slide',
        perPage: 1,
        perMove: 1,
        gap: '16px',
        pagination: true, // Точки на мобилке
        arrows: false,    // Стрелки скрыты (используем свои кнопки на десктопе)
        mediaQuery: 'min',
        breakpoints: {
          // Настройки для десктопа
          992: {
            perPage: 3,
            pagination: false,
            arrows: false, // Можно включить true, если не используем кастомные кнопки
            drag: 'free', // Или false, если хотим жесткую сетку
          },
        },
      }).mount();

      this.bindNav();
    }

    bindNav() {
      // Ищем кнопки внутри блока навигации, а не по всему документу
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

      if (this.slider) {
        this.slider.destroy();
        this.slider = null;
      }
    }

    openPopupReview(e) {
        e.stopPropagation()
        const instance = new FsLightbox();
        instance.props.sources = [e.target.closest('.review-card').cloneNode(true)];
        instance.open();
    }

    addEvents() {
        this.el.querySelectorAll('.review-card__more').forEach(item => {
            item.addEventListener('click', (e) => this.openPopupReview(e))
        })
    }
  }
