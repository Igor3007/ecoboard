export default class TextPageTOC {
    constructor(selector) {
        this.root = document.querySelector(selector);
        if (!this.root) return;

        this.content = this.root.querySelector('.formated-text');
        this.tocList = this.root.querySelector('.text-page__toc-list');
        this.tocDetails = this.root.querySelector('.text-page__toc');

        if (!this.content || !this.tocList) return;

        // На десктопе принудительно открываем details
        this.handleDesktopTOC();

        // Генерируем содержание
        this.generateTOC();

        // Инициализируем скроллспай (подсветку активного пункта)
        this.initScrollSpy();
    }

    handleDesktopTOC() {
        // Если экран большой, делаем details открытым по умолчанию
        const mediaQuery = window.matchMedia('(min-width: 992px)');

        const updateTOCState = (e) => {
            if (e.matches) {
                this.tocDetails.setAttribute('open', '');
            } else {
                this.tocDetails.removeAttribute('open');
            }
        };

        // Вызываем сразу и вешаем слушатель
        updateTOCState(mediaQuery);
        mediaQuery.addListener(updateTOCState);
    }

    generateTOC() {
        // Находим все заголовки h2 внутри контента
        const headings = this.content.querySelectorAll('h2');

        if (headings.length === 0) {
            // Если заголовков нет, скрываем сайдбар
            const sidebar = this.root.querySelector('.text-page__sidebar');
            if (sidebar) sidebar.style.display = 'none';
            return;
        }

        headings.forEach((heading, index) => {
            // Если у заголовка нет id, генерируем его
            if (!heading.id) {
                // Транслитерация или просто index
                heading.id = `section-${index + 1}`;
            }

            // Создаем пункт меню
            const li = document.createElement('li');
            const a = document.createElement('a');

            a.href = `#${heading.id}`;
            a.className = 'text-page__toc-link';
            a.textContent = heading.textContent.trim();

            // Плавный скролл
            a.addEventListener('click', (e) => {
                e.preventDefault();

                const target = document.getElementById(heading.id);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Обновляем URL
                    history.pushState(null, null, `#${heading.id}`);

                    // Если мобилка, закрываем меню после клика
                    if (window.innerWidth < 992) {
                        this.tocDetails.removeAttribute('open');
                    }
                }
            });

            li.appendChild(a);
            this.tocList.appendChild(li);
        });
    }

    initScrollSpy() {
        const links = this.tocList.querySelectorAll('.text-page__toc-link');
        const headings = this.content.querySelectorAll('h2');

        // Настройки обсервера: срабатывает, когда заголовок появляется в верхней части экрана
        const options = {
            root: null,
            rootMargin: '-100px 0px -60% 0px', // Учитываем высоту липкого меню
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;

                    // Снимаем активный класс со всех ссылок
                    links.forEach(link => {
                        link.classList.remove('is-active');

                        // Если ссылка ведет на этот заголовок, делаем её активной
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('is-active');
                        }
                    });
                }
            });
        }, options);

        headings.forEach(heading => {
            observer.observe(heading);
        });
    }
}
