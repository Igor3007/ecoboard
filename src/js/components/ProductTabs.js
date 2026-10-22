import Splide from "@splidejs/splide";

export default class ProductTabs {
    constructor(selector) {
      this.root = document.querySelector(selector);
      if (!this.root) return;

      this.buttons = this.root.querySelectorAll('.product-tabs__btn');
      this.panes = this.root.querySelectorAll('.product-tabs__pane');

      this.initTabs();
      this.initSlider();
    }

    initTabs() {
      this.buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.dataset.tab;

          // 1. Переключаем кнопки
          this.buttons.forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');

          // 2. Переключаем контент
          this.panes.forEach(pane => {
            if (pane.dataset.pane === target) {
              pane.classList.add('is-active');

              // Если открыли вкладку с сертификатами, нужно обновить слайдер,
              // так как он мог быть инициализирован со скрытым размером (display: none)
              if (target === 'certs' && this.certsSplide) {
                this.certsSplide.refresh();
              }
            } else {
              pane.classList.remove('is-active');
            }
          });
        });
      });
    }

    initSlider() {
      const sliderEl = this.root.querySelector('.certs-slider');
      if (!sliderEl) return;

      this.certsSplide = new Splide(sliderEl, {
        type: 'slide',
        perPage: 2,
        gap: '16px',
        pagination: true,
        arrows: true,
        breakpoints: {
          // Мобилка
          576: {
            perPage: 2,
            arrows: false,
          },
          // Планшет
          760: {
            perPage: 3,
          },
          // Десктоп
          992: {
            perPage: 4,
          }
        }
      });

      // Монтируем только при первом открытии вкладки (или сразу, но с refresh при переключении)
      // Для простоты монтируем сразу, но не забываем вызвать refresh при переключении
      this.certsSplide.mount();
    }
  }
