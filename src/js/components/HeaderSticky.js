export default class HeaderSticky {
    constructor(options = {}) {
      this.header = document.querySelector(options.selector || '.header');
      if (!this.header) return;

      this.offset = options.offset ?? 150;
      this.fixedClass = options.fixedClass || 'is-fixed';
      this.height = 0;
      this.isFixed = false;

      this.onScroll = this.onScroll.bind(this);

      // Пассивный слушатель для производительности
      window.addEventListener('scroll', this.onScroll, { passive: true });

      // Пересчёт при ресайзе (высота может измениться)
      window.addEventListener('resize', () => {
        if (this.isFixed) this.height = this.header.offsetHeight;
      });

      this.onScroll();
    }

    onScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > this.offset && !this.isFixed) {
        // Измеряем высоту ДО добавления класса
        this.height = this.header.offsetHeight;

        // Резервируем место через инлайн-стиль, чтобы избежать скачка
        this.header.style.height = `${this.height}px`;

        this.header.classList.add(this.fixedClass);
        this.isFixed = true;
      } else if (scrollTop <= this.offset && this.isFixed) {
        this.header.classList.remove(this.fixedClass);
        this.header.style.height = '';
        this.isFixed = false;
      }
    }

    destroy() {
      window.removeEventListener('scroll', this.onScroll);
      this.header.classList.remove(this.fixedClass);
      this.header.style.height = '';
    }
  }

