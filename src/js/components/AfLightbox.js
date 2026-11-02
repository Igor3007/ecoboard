export class afLightbox {
    constructor(opion) {

        this.modal = '';
        this.instanseIndex = null;
        this.isSelecting = false; // Флаг для отслеживания выделения текста
        this.isOpen = false; // Флаг для отслеживания открытого состояния
        if (opion) {
            this.mobileBottom = (opion.mobileInBottom ? opion.mobileInBottom : false)
            this.clases = (opion.clases ? opion.clases : null)
            this.closeOnOutsideClick = (opion.closeOnOutsideClick !== undefined ? opion.closeOnOutsideClick : true) // Новая опция
        }

        this.init()
    }

    init() {

        if (typeof window.afLightbox == 'undefined') {
            window.afLightbox = {
                items: [],
                close: null,
                closeAll: null
            };
        }

        window.afLightbox.items.push(this);
        this.instanseIndex = (window.afLightbox.items.length - 1)

        window.afLightbox.closeAll = () => {
            window.afLightbox.items.forEach(el => el.close())
            window.afLightbox.items = [];
        }

        window.afLightbox.close = () => {
            if (window.afLightbox.items.length > 0) {
                window.afLightbox.items[(window.afLightbox.items.length - 1)].close()
            }
        }

    }

    createTemplate() {
        let template = document.createElement('div')
        template.innerHTML = `<div class="af-popup ${this.clases} "> <div class="af-popup__bg"></div><div class="af-popup__wrp"><div class="af-popup__container"><div class="af-popup__close btnClose"><i></i><i></i></div><div class="af-popup__content"></div></div></div></div>`
        document.body.append(template)
        this.instanse = template;
        return template;
    }

    open(content, afterShow) {

        let _this = this;
        this.modal = this.createTemplate();

        if (window.innerWidth <= 480 && this.mobileBottom) {
            this.modal.querySelector(".af-popup").classList.add("af-popup--mobile")
        }

        document.body.classList.add('page-hidden')

        this.modal.querySelector('.af-popup__content').innerHTML = content
        this.modal.querySelector('.af-popup__close').addEventListener('click', function () {
            _this.close()
        })

        if (this.modal.querySelector('[data-af-popup="close"]')) {
            this.modal.querySelector('[data-af-popup="close"]').addEventListener('click', function (e) {
                _this.close()
            })
        }

        if (afterShow) afterShow(this.modal);

        setTimeout(() => {
            this.modal.querySelector(".af-popup").classList.add("af-popup--visible")
        }, 10)

        this.isOpen = true;
        this.createEvent();

    }

    changeContent(content) {
        this.modal.querySelector('.af-popup__content').innerHTML = content

        if (this.modal.querySelector('[data-af-popup="close"]')) {
            this.modal.querySelector('[data-af-popup="close"]').addEventListener('click',  (e) => {
                this.close()
            })
        }
    }

    createEvent() {

        let _this = this

        // Отслеживаем начало выделения текста
        const handleMouseDown = (e) => {
            // Если клик начался внутри контейнера, сбрасываем флаг
            if (e.target.closest('.af-popup__container')) {
                _this.isSelecting = false;
            } else {
                // Если клик начался вне контейнера, устанавливаем флаг
                _this.isSelecting = true;
            }
        }

        // Отслеживаем выделение текста
        const handleMouseUp = (e) => {
            // Проверяем, есть ли выделенный текст
            const selection = window.getSelection();
            const hasSelection = selection && selection.toString().length > 0;

            // Если есть выделение текста, закрытие не происходит
            if (hasSelection) {
                _this.isSelecting = true;
                return;
            }

            // Сбрасываем флаг
            _this.isSelecting = false;
        }

        // Обработчик клавиши ESC
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' || e.keyCode === 27) {
                e.preventDefault();
                if (_this.isOpen) {
                    _this.close();
                }
            }
        }

        // Добавляем обработчики на весь документ
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('keydown', handleKeyDown);

        // Обработчик клика на фон
        this.instanse.querySelector('.af-popup').addEventListener('click', function (e) {
            // Если клик не по контейнеру и разрешено закрытие
            if (!e.target.closest('.af-popup__container') && _this.closeOnOutsideClick !== false) {
                // Дополнительная проверка на выделение текста
                const selection = window.getSelection();
                const hasSelection = selection && selection.toString().length > 0;

                if (!hasSelection) {
                    _this.close();
                }
            }
        })

        // Сохраняем обработчики для удаления при закрытии
        this.handleMouseDown = handleMouseDown;
        this.handleMouseUp = handleMouseUp;
        this.handleKeyDown = handleKeyDown;
    }

    close() {
        // Проверяем, открыто ли окно
        if (!this.isOpen) return;

        this.isOpen = false;

        // Удаляем обработчики событий
        if (this.handleMouseDown) {
            document.removeEventListener('mousedown', this.handleMouseDown);
            document.removeEventListener('mouseup', this.handleMouseUp);
            document.removeEventListener('keydown', this.handleKeyDown);
        }

        this.instanse.querySelector('.af-popup').classList.remove('af-popup--visible')
        document.body.classList.remove('page-hidden')

        setTimeout(() => {
            this.instanse.remove()
            window.afLightbox.items.splice(this.instanseIndex, 1);

            if (!window.afLightbox.items.length) {
                document.body.classList.toggle('page-hidden', false)
            }

        }, 300)
    }
}
