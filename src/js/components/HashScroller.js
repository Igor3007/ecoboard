export default class HashScroller {
    constructor(options = {}) {
      this.attr = options.attr || 'data-cid';
      this.duration = options.duration ?? 600;
      this.headerSelector = options.headerSelector || '.header.is-fixed';
      this.hashPattern = options.hashPattern || /^#c(\d+)$/i;

      // Плавный скролл при заходе на страницу
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.scrollToHash());
      } else {
        this.scrollToHash();
      }
    }

    scrollToHash() {
      const match = window.location.hash.match(this.hashPattern);
      if (!match) return;

      const id = match[1];
      const target = document.querySelector(`[${this.attr}="${id}"]`);
      if (!target) return;

      this.scrollToElement(target);
    }

    scrollToElement(target) {
      // Отступ под фиксированный хедер
      const header = document.querySelector(this.headerSelector);
      const headerOffset = header ? header.offsetHeight : 0;

      const targetTop =
        target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      this.smoothScrollTo(Math.max(targetTop, 0), this.duration);
    }

    smoothScrollTo(to, duration) {
      const start = window.pageYOffset;
      const distance = to - start;
      if (Math.abs(distance) < 1) return;

      const startTime = performance.now();

      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeInOutCubic
        const eased =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        window.scrollTo(0, start + distance * eased);

        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    }
  }

  // Инициализация
  new HashScroller({
    attr: 'data-cid',
    duration: 600,
    // если фиксированный хедер имеет класс is-fixed — учтём его высоту
    headerSelector: '.header.is-fixed',
  });
