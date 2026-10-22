import '../vendor/lazysizes';
import fslightbox from 'fslightbox';

import ReviewsSlider from '../components/ReviewsSlider';
import MainSlider from '../components/MainSlider';
import ProductGallery from '../components/ProductGallery';
import ProductAnchors from '../components/ProductAnchors';
import CertSlider from '../components/CertsSlider';

document.addEventListener('DOMContentLoaded', function () {
    new ReviewsSlider();
    new MainSlider('.interactive-slider')
    new ProductGallery('.product-detail');
    new ProductAnchors('.product-sections');
    new CertSlider('.product-sections')
});
