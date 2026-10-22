import Splide from "@splidejs/splide";

export default class CertSlider {
    constructor(selector) {
      this.root = document.querySelector(selector);
      if (!this.root) return;

      this.buttons = this.root.querySelectorAll('.product-tabs__btn');
      this.panes = this.root.querySelectorAll('.product-tabs__pane');

      this.initSlider();
    }

    initSlider() {
      const sliderEl = this.root.querySelector('.certs-slider');
      if (!sliderEl) return;

      this.certsSplide = new Splide(sliderEl, {
        type: 'slide',
        perPage: 1,
        gap: '16px',
        pagination: true,
        arrows: false,
        mediaQuery: 'min',
        breakpoints: {
          // Мобилка
          576: {
            perPage: 2,
            arrows: false,
          },
          // Планшет
          760: {
            perPage: 4.2,
            pagination: false,
          },
          // Десктоп
          992: {
            perPage: 5.2,
            pagination: false,
          }
        }
      });

      // Монтируем только при первом открытии вкладки (или сразу, но с refresh при переключении)
      // Для простоты монтируем сразу, но не забываем вызвать refresh при переключении
      this.certsSplide.mount();
    }
  }
