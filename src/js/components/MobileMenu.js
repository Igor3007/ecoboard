export default class MobileMenu {
    constructor() {
      // Находим элементы
      this.openBtns = document.querySelectorAll('[data-mobile-menu="open"]');
      this.menu = document.querySelector('.mobile-menu');
      this.closeBtn = document.querySelector('.mobile-menu__close');

      // Если меню нет на странице, выходим
      if (!this.menu) return;



      // Инициализируем события
      this.init();
    }

    init() {

        this.overlay = document.createElement('div')
        this.overlay.classList.add('overlay')
        document.body.append(this.overlay)

      // Открытие меню (может быть несколько кнопок, например, в хедере и футере)
      this.openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault(); // Предотвращаем переход, если это ссылка
          this.open();
        });
      });

      // Закрытие меню по крестику
      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.close());
      }

      // Закрытие по клику на оверлей (затемненный фон), если он есть
      // Предполагается, что оверлей — это родительский контейнер или отдельный элемент с классом .overlay
      const overlay = document.querySelector('.overlay');
      if (overlay) {
        overlay.addEventListener('click', (e) => {
          // Закрываем, только если кликнули именно по оверлею, а не по меню
          if (e.target === overlay) {
            this.close();
          }
        });
      }

      // Закрытие по клавише Escape (для удобства)
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.menu.classList.contains('open')) {
          this.close();
        }
      });
    }

    open() {
      this.menu.classList.add('open');
      this.toggleBodyScroll(true);

      // Если у вас есть оверлей, можно показать его здесь
      const overlay = document.querySelector('.overlay');
      if (overlay) overlay.classList.add('open');
    }

    close() {
      this.menu.classList.remove('open');
      this.toggleBodyScroll(false);

      // Скрываем оверлей
      const overlay = document.querySelector('.overlay');
      if (overlay) overlay.classList.remove('open');
    }

    /**
     * Блокировка/разблокировка скролла страницы
     * @param {boolean} lock - true чтобы заблокировать, false чтобы разблокировать
     */
    toggleBodyScroll(lock) {
      if (lock) {
        document.body.style.overflow = 'hidden';
        // Для iOS Safari добавляем position: fixed, чтобы избежать артефактов
        document.body.style.paddingRight = this.getScrollbarWidth() + 'px';
      } else {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }
    }

    /**
     * Вычисляет ширину скроллбара, чтобы контент не прыгал при его исчезновении
     */
    getScrollbarWidth() {
      return window.innerWidth - document.documentElement.clientWidth;
    }
  }
