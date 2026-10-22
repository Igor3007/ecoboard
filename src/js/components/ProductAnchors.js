import Splide from "@splidejs/splide";

export default class ProductAnchors {
    constructor(selector) {
      this.root = document.querySelector(selector);
      if (!this.root) return;

      this.links = this.root.querySelectorAll('.product-sections__link');
      this.blocks = this.root.querySelectorAll('.product-sections__block');

      // Если блоков нет, выходим
      if (!this.links.length || !this.blocks.length) return;

      this.initSmoothScroll();
      this.initIntersectionObserver();
    }

    initSmoothScroll() {
      this.links.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();

          const targetId = link.getAttribute('href');
          const targetBlock = document.querySelector(targetId);

          if (targetBlock) {
            // Плавный скролл к элементу
            targetBlock.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });

            // Обновляем URL (опционально, без прыжка)
            history.pushState(null, null, targetId);
          }
        });
      });
    }

    initIntersectionObserver() {
      // Настройки обсервера: срабатывает, когда блок появляется в верхней трети экрана
      const options = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Блок попал в зону видимости
            const id = entry.target.getAttribute('id');

            // Снимаем активный класс со всех ссылок
            this.links.forEach(link => {
              link.classList.remove('is-active');
              // Если ссылка ведет на этот блок, делаем её активной
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('is-active');
              }
            });
          }
        });
      }, options);

      // Наблюдаем за каждым блоком
      this.blocks.forEach(block => {
        observer.observe(block);
      });
    }
  }
