import '../vendor/lazysizes';
import fslightbox from 'fslightbox';

import ReviewsSlider from '../components/ReviewsSlider';
import MainSlider from '../components/MainSlider';
import ProductGallery from '../components/ProductGallery';
import ProductAnchors from '../components/ProductAnchors';
import CertSlider from '../components/CertsSlider';
import TextPageTOC from '../components/TextPage';
import ContactsMap from '../components/ContactsMap.js';
import { initAjaxPopups } from '../components/AjaxPopups.js';
import { FloatMenuHover } from '../components/FloatMenu.js';
import MobileMenu from '../components/MobileMenu.js';



document.addEventListener('DOMContentLoaded', function () {

    if (document.querySelector('.reviews-section')) {
        new ReviewsSlider();
    }

    new MainSlider('.interactive-slider')
    new ProductGallery('.product-detail');
    new ProductAnchors('.product-sections');
    new CertSlider('.product-sections')
    new TextPageTOC('.text-page')
    new FloatMenuHover();
    new MobileMenu();

    // Координаты: [Широта, Долгота]
    // Примерные координаты для Касли, Советская 68/29
    const coords = [55.8925, 60.7628];
    new ContactsMap('map', coords);

    initAjaxPopups()
});
