import { config } from "../config";

export function initYandexSmartCaptcha() {
    if (window.smartCaptcha) {
        window.smartCaptcha.render('captcha-container', {
          sitekey: config.YANDEX_SMART_CAPTCHA_CLIENT_KEY, // Вставьте сюда Client key
        });
    }else {
        console.error('Подключите код виджета каптчи')
    }
}
