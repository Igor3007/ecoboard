const ZBRangeSlider = function (id) {
    const self = this;
    let startX = 0, x = 0;

    // Безопасный поиск элемента
    const slider = typeof id === 'string' ? document.getElementById(id) : id;
    if (!slider) {
        console.warn(`ZBRangeSlider: Element with id "${id}" not found`);
        return null;
    }

    const touchLeft = slider.querySelector('.slider-touch-left');
    const touchRight = slider.querySelector('.slider-touch-right');
    const lineSpan = slider.querySelector('.slider-line span');

    if (!touchLeft || !touchRight || !lineSpan) return null;

    const min = parseFloat(slider.getAttribute('se-min')) || 0;
    const max = parseFloat(slider.getAttribute('se-max')) || 100;

    let defaultMinValue = slider.hasAttribute('se-min-value')
        ? parseFloat(slider.getAttribute('se-min-value'))
        : min;
    let defaultMaxValue = slider.hasAttribute('se-max-value')
        ? parseFloat(slider.getAttribute('se-max-value'))
        : max;

    // Валидация значений
    defaultMinValue = Math.max(min, Math.min(defaultMinValue, defaultMaxValue));
    defaultMaxValue = Math.min(max, Math.max(defaultMaxValue, defaultMinValue));

    const step = Math.abs(parseFloat(slider.getAttribute('se-step'))) || 0;
    const normalizeFact = 26;

    self.slider = slider;

    self.reset = function () {
        touchLeft.style.left = '0px';
        touchRight.style.left = (slider.offsetWidth - touchLeft.offsetWidth) + 'px';
        lineSpan.style.marginLeft = '0px';
        lineSpan.style.width = (slider.offsetWidth - touchLeft.offsetWidth) + 'px';
        startX = 0;
        x = 0;
    };

    self.setMinValue = function (minValue) {
        const ratio = ((minValue - min) / (max - min));
        touchLeft.style.left = Math.ceil(ratio * (slider.offsetWidth - (touchLeft.offsetWidth + normalizeFact))) + 'px';
        lineSpan.style.marginLeft = touchLeft.offsetLeft + 'px';
        lineSpan.style.width = (touchRight.offsetLeft - touchLeft.offsetLeft) + 'px';
        slider.setAttribute('se-min-value', minValue);
    };

    self.setMaxValue = function (maxValue) {
        const ratio = ((maxValue - min) / (max - min));
        touchRight.style.left = Math.ceil(ratio * (slider.offsetWidth - (touchLeft.offsetWidth + normalizeFact)) + normalizeFact) + 'px';
        lineSpan.style.marginLeft = touchLeft.offsetLeft + 'px';
        lineSpan.style.width = (touchRight.offsetLeft - touchLeft.offsetLeft) + 'px';
        slider.setAttribute('se-max-value', maxValue);
    };

    self.reset();

    const maxX = slider.offsetWidth - touchRight.offsetWidth;
    let selectedTouch = null;
    const initialValue = (lineSpan.offsetWidth - normalizeFact);

    self.setMinValue(defaultMinValue);
    self.setMaxValue(defaultMaxValue);

    function onStart(event) {
        event.preventDefault();
        const eventTouch = event.touches ? event.touches[0] : event;
        x = (this === touchLeft) ? touchLeft.offsetLeft : touchRight.offsetLeft;
        startX = eventTouch.pageX - x;
        selectedTouch = this;

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onStop);
        document.addEventListener('touchmove', onMove);
        document.addEventListener('touchend', onStop);
    }

    function onMove(event) {
        const eventTouch = event.touches ? event.touches[0] : event;
        x = eventTouch.pageX - startX;

        if (selectedTouch === touchLeft) {
            x = Math.max(0, Math.min(x, touchRight.offsetLeft - selectedTouch.offsetWidth + 10));
        } else {
            x = Math.max(touchLeft.offsetLeft + touchLeft.offsetWidth - 10, Math.min(x, maxX));
        }

        selectedTouch.style.left = x + 'px';
        lineSpan.style.marginLeft = touchLeft.offsetLeft + 'px';
        lineSpan.style.width = (touchRight.offsetLeft - touchLeft.offsetLeft) + 'px';

        calculateValue();

        // Вызов колбэков
        const onChangeAttr = slider.getAttribute('on-change');
        if (onChangeAttr) new Function('min, max', onChangeAttr)(slider.getAttribute('se-min-value'), slider.getAttribute('se-max-value'));
        if (self.onChange) self.onChange(slider.getAttribute('se-min-value'), slider.getAttribute('se-max-value'));
    }

    function onStop() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onStop);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onStop);
        selectedTouch = null;
        calculateValue();

        const didChangedAttr = slider.getAttribute('did-changed');
        if (didChangedAttr) new Function('min, max', didChangedAttr)(slider.getAttribute('se-min-value'), slider.getAttribute('se-max-value'));
        if (self.didChanged) self.didChanged(slider.getAttribute('se-min-value'), slider.getAttribute('se-max-value'));
    }

    function calculateValue() {
        let currMin = (lineSpan.offsetLeft / initialValue) * (max - min) + min;
        let currMax = ((lineSpan.offsetLeft + lineSpan.offsetWidth - normalizeFact) / initialValue) * (max - min) + min;

        if (step !== 0.0) {
            currMin = Math.round(currMin / step) * step;
            currMax = Math.round(currMax / step) * step;
        }

        slider.setAttribute('se-min-value', currMin);
        slider.setAttribute('se-max-value', currMax);
    }

    touchLeft.addEventListener('mousedown', onStart);
    touchRight.addEventListener('mousedown', onStart);
    touchLeft.addEventListener('touchstart', onStart, {passive: false});
    touchRight.addEventListener('touchstart', onStart, {passive: false});
};

// ЭКСПОРТ ДЛЯ VITE
export default ZBRangeSlider;
