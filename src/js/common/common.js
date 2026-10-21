import '../vendor/lazysizes';
import ReviewsSlider from '../components/ReviewsSlider';
import MainSlider from '../components/MainSlider';

document.addEventListener('DOMContentLoaded', function () {
    new ReviewsSlider();
    new MainSlider('.interactive-slider')
});
