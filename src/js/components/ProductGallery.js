import Splide from "@splidejs/splide";

export default class ProductGallery {
    constructor(selector) {
      this.root = document.querySelector(selector);
      if (!this.root) return;

      this.mainEl = this.root.querySelector('.product-gallery__main');
      this.thumbsEl = this.root.querySelector('.product-gallery__thumbs');

      if (!this.mainEl || !this.thumbsEl) return;

      this.initSplide();
    }

    initSplide() {
      // 1. Инициализация миниатюр
      this.thumbsSplide = new Splide(this.thumbsEl, {
        fixedWidth: 80,
        fixedHeight: 80,
        gap: 12,
        rewind: true,
        pagination: false,
        arrows: false,
        isNavigation: true, // Включаем режим навигации
        breakpoints: {
          576: {
            fixedWidth: 60,
            fixedHeight: 60,
          }
        }
      });

      // 2. Инициализация основного слайдера
      this.mainSplide = new Splide(this.mainEl, {
        //type: 'fade', // Используем затухание для основного
        rewind: true,
        pagination: false,
        arrows: true, // Включаем стандартные стрелки (или можно кастомные)
        cover: true,
        breakpoints: {
            576: {
                pagination: true,
            }
          }

      });

      // 3. Синхронизация
      this.mainSplide.sync(this.thumbsSplide);

      // 4. Монтирование
      this.thumbsSplide.mount();
      this.mainSplide.mount();
    }
  }
