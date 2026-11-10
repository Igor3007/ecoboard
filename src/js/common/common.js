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
import HeaderSticky from '../components/HeaderSticky.js';
import HashScroller from '../components/HashScroller.js';
import ReviewPopup from '../components/ReviewPopups.js';

document.addEventListener('DOMContentLoaded', function () {

    if (document.querySelector('.reviews-section')) {
        new ReviewsSlider();
    }


    new HeaderSticky({ offset: 5 });
    new MainSlider('.interactive-slider')
    new ProductGallery('.product-detail');
    new ProductAnchors('.product-sections');
    new CertSlider('.product-sections')
    new TextPageTOC('.text-page')
    new FloatMenuHover();
    new MobileMenu();
    new ReviewPopup();
    new ContactsMap('map', [55.8925, 60.7628], {
        hintContent: 'ООО ТСК «Перспектива»',
        balloonContent: 'Челябинская область, Касли, Советская, 68/29'
    });
    new HashScroller({
        attr: 'data-cid',
        duration: 600,
        headerSelector: '.header.is-fixed',
    });

    initAjaxPopups()
});
