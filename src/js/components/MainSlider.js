import Splide from "@splidejs/splide";

export default class MainSlider {
  /**
   * @param {string|HTMLElement} selector - Селектор или DOM-элемент контейнера
   */
  constructor(selector) {
    // Находим корневой элемент
    this.root = typeof selector === 'string' ? document.querySelector(selector) : selector;

    if (!this.root) {
      console.warn('InteractiveSlider: root element not found');
      return;
    }

    // Находим внутренние элементы
    this.sliderEl = this.root.querySelector('.interactive-slider__slider');
    this.prevBtn = this.root.querySelector('.js-prev');
    this.nextBtn = this.root.querySelector('.js-next');
    this.textBlocks = this.root.querySelectorAll('.interactive-slider__text-block');

    // Проверяем наличие обязательных элементов
    if (!this.sliderEl) {
      console.warn('InteractiveSlider: slider element not found');
      return;
    }

    // Инициализируем Splide
    this.initSplide();
  }

  initSplide() {
    // Создаем экземпляр Splide
    this.splide = new Splide(this.sliderEl, {
      type: 'fade',
      rewind: true,
      pagination: false,
      arrows: false, // Скрываем стандартные стрелки
      speed: 600,
      fade: {
        crossFade: true
      },
      breakpoints: {
        992: {
            pagination: true
        }
      }
    });

    this.bindEvents();
    this.splide.mount();
  }

  bindEvents() {
    // 1. Кнопки навигации
    if (this.prevBtn && this.nextBtn) {
      this.prevBtn.addEventListener('click', () => this.splide.go('<'));
      this.nextBtn.addEventListener('click', () => this.splide.go('>'));
    }

    // 2. Синхронизация текста при смене слайда
    // Событие 'move' срабатывает в начале анимации переключения
    this.splide.on('move', (newIndex) => {
      this.updateTextBlock(newIndex);
      if(this.root.querySelector('[data-current]')){
        this.root.querySelector('[data-current]').innerHTML = newIndex+1
      }
      if(this.root.querySelector('[data-all]')){
        this.root.querySelector('[data-all]').innerHTML = this.splide.length+1
      }

    });

    this.splide.on('mounted', (newIndex) => {
      if(this.root.querySelector('[data-current]')){
        this.root.querySelector('[data-current]').innerHTML = 1
      }
      if(this.root.querySelector('[data-all]')){
        this.root.querySelector('[data-all]').innerHTML = this.splide.length+1
      }

    });
  }

  /**
   * Обновляет активный текстовый блок
   * @param {number} activeIndex - Индекс активного слайда
   */
  updateTextBlock(activeIndex) {
    this.textBlocks.forEach((block, index) => {
      if (index === activeIndex) {
        block.classList.add('is-active');
      } else {
        block.classList.remove('is-active');
      }
    });
  }
}
