import { config } from "../config";
import { loadApiSmartCaptcha } from "../common/utils";

export function initYandexSmartCaptcha(containerId = 'captcha-container') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Элемент #${containerId} не найден`);
        return;
    }

    loadApiSmartCaptcha((smartCaptcha) => {
        if (!smartCaptcha) {
            console.error('Подключите код виджета каптчи');
            return;
        }

        smartCaptcha.render(containerId, {
            sitekey: config.YANDEX_SMART_CAPTCHA_CLIENT_KEY,
        });
    });
}
