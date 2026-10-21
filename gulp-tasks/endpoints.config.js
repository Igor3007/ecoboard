// Файл с маппингом эндпоинтов
export default {
    // Оригинальный эндпоинт: файл для подмены
    '/shops/178/pickups': '/json/points.json',
    '/shops/\\d+/phones': '/json/phones.json',
    '/shops/undefined/phones': '/json/phones.json',
    '/login': '/personal/_popup-login.html',
    '/register': '/personal/_popup-registration.html',
    '/wishlist/get': '/json/empty.json',
    '/compare/get': '/json/empty.json',
    '/property/12456/info': '/json/tooltips.json',
    // '/api/users': '/json/users.json',
    // '/api/products/\\d+': '/json/product.json', // поддержка regex для динамических URL
    // '/api/categories': '/json/categories.json',
    // '/api/auth/login': '/json/auth/login.json',
    // '/api/orders/\\d+/items': '/json/order-items.json',

    // Можно также использовать функции для динамического определения
    // '/api/search': (req) => {
    //   const query = req.url.split('?')[1];
    //   return `/json/search-results.json?${query}`;
    // }
  };
