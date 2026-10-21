
import endpoints from './endpoints.config.js';
import fs from 'fs';
import path from 'path';
import url from 'url'; 

export function matchEndpoint(requestUrl) {
    for (const [pattern, target] of Object.entries(endpoints)) {
      // Проверяем, является ли паттерн регулярным выражением
      if (pattern.includes('\\d') || pattern.includes('*') || pattern.includes('+')) {
        // Создаем RegExp из строки паттерна
        const regex = new RegExp('^' + pattern.replace(/\\\d/g, '(\\d+)') + '$');
        if (regex.test(requestUrl)) {
          return { pattern, target, regex: true };
        }
      } 
      // Простое сравнение строк
      else if (requestUrl === pattern || requestUrl.startsWith(pattern)) {
        return { pattern, target, regex: false };
      }
    }
    return null;
}
   

export function handleApiRequest(req, res, next) {
    const parsedUrl = url.parse(req.url);
    const requestPath = parsedUrl.pathname;
    
    //console.log(`[BrowserSync] Запрос: ${req.url}`);
    
    // Проверяем, есть ли эндпоинт в конфигурации
    const match = matchEndpoint(requestPath);
    
    if (match) {
      let targetPath = match.target;
      
      // Если target - функция, вызываем её для динамического определения пути
      if (typeof target === 'function') {
        targetPath = target(req);
      }
      
      // Формируем полный путь к файлу
      let filePath = path.join('./dist', targetPath);
      
      // Проверяем существование файла
      if (fs.existsSync(filePath)) {
        console.log(`[BrowserSync] Подмена: ${req.url} -> ${targetPath}`);
        
        // Определяем Content-Type по расширению
        const ext = path.extname(filePath);
        const contentTypes = {
          '.json': 'application/json',
          '.js': 'application/javascript',
          '.html': 'text/html',
          '.css': 'text/css',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.gif': 'image/gif',
          '.svg': 'image/svg+xml'
        };
        
        res.writeHead(200, { 
          'Content-Type': contentTypes[ext] || 'text/plain',
          'X-Endpoint-Mapped': 'true',
          'X-Original-URL': req.url
        });
        
        // Читаем и отправляем файл
        const content = fs.readFileSync(filePath);
        res.end(content);
        return;
      } else {
        console.warn(`[BrowserSync] Файл не найден: ${filePath}`);
        
        // Если файл не найден, можно вернуть 404 или пустой JSON
        if (ext === '.json') {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Mock file not found', path: targetPath }));
          return;
        }
      }
    }
    
    // Если нет подмены или файл не найден, продолжаем обычную обработку
    next();
}