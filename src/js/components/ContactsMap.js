import { loadApiYmaps } from "../common/utils";
import { iconPlacemark } from "../common/utils";

export default class ContactsMap {
    constructor(mapId, coords, baloon) {
        this.mapId = mapId;
        this.baloon = baloon;
        this.coords = coords; // [широта, долгота]
        this.map = null;

        if (!document.getElementById(this.mapId)) {
            console.warn(`Элемент с селектором ${this.mapId} не найден`);
            return;
        }

        // Загружаем API Яндекс.Карт через функцию, затем инициализируем карту
        loadApiYmaps((ymaps) => {
            if (!ymaps) {
                console.warn('Яндекс.Карты не загружены');
                return;
            }
            ymaps.ready(() => this.init(ymaps));
        });


    }

    init(ymaps) {
        // Создаем карту
        this.map = new ymaps.Map(this.mapId, {
            center: this.coords,
            zoom: 16,
            controls: ['zoomControl', 'fullscreenControl']
        }, {
            searchControlProvider: 'yandex#search'
        });

        // Создаем кастомную точку (Placemark)
        const customIconLayout = ymaps.templateLayoutFactory.createClass(iconPlacemark());

        const placemark = new ymaps.Placemark(this.coords, this.baloon, {
            iconLayout: customIconLayout,
            iconShape: {
                type: 'Circle',
                coordinates: [24, 24],
                radius: 24
            }
        });

        this.map.geoObjects.add(placemark);

        // Отключаем скролл карты при прокрутке страницы
        this.map.behaviors.disable('scrollZoom');
    }
}
