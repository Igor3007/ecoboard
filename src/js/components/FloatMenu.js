export class FloatMenuHover {
    constructor(options = {}) {
      this.triggerSelector = options.triggerSelector || '[data-float-menu="open"]';
      this.bodyClass = options.bodyClass || 'open-float-menu';
      this.headerSelector = options.headerSelector || '.header';

      this.triggers = document.querySelectorAll(this.triggerSelector);
      this.header = document.querySelector(this.headerSelector);

      if (!this.triggers.length) return;

      this.onTriggerEnter = this.onTriggerEnter.bind(this);
      this.onTriggerLeave = this.onTriggerLeave.bind(this);
      this.onHeaderLeave = this.onHeaderLeave.bind(this);

      this.init();
    }

    init() {
      this.triggers.forEach((trigger) => {
        trigger.addEventListener('mouseenter', this.onTriggerEnter);
        trigger.addEventListener('mouseleave', this.onTriggerLeave);
      });

      if (this.header) {
        this.header.addEventListener('mouseleave', this.onHeaderLeave);
      }
    }

    addBodyClass() {
      document.body.classList.add(this.bodyClass);
    }

    removeBodyClass() {
      document.body.classList.remove(this.bodyClass);
    }

    onTriggerEnter() {
      this.addBodyClass();
    }

    onTriggerLeave(event) {
      const related = event.relatedTarget;

      // Если ушли с кнопки на .header — ничего не делаем
      if (related && this.header && this.header.contains(related)) {
        return;
      }

      this.removeBodyClass();
    }

    onHeaderLeave() {
      this.removeBodyClass();
    }

    destroy() {
      this.triggers.forEach((trigger) => {
        trigger.removeEventListener('mouseenter', this.onTriggerEnter);
        trigger.removeEventListener('mouseleave', this.onTriggerLeave);
      });

      if (this.header) {
        this.header.removeEventListener('mouseleave', this.onHeaderLeave);
      }

      this.removeBodyClass();
    }
  }

