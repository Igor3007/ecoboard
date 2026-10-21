import gulp from "gulp";
import browserSync from "browser-sync";
import {handleApiRequest} from "./browserSyncUtilits.js"

export function browserSyncTask () {
    
gulp.task('browser-sync', function () {
    const bs = browserSync.init({
      server: {
        baseDir: "./dist/",
        port: 4000,
        middleware: [handleApiRequest]
      },
      notify: true,
      open: true,
      reloadOnRestart: true,
      ghostMode: false,
    });
    
    // Следим за изменениями в конфигурации эндпоинтов
    gulp.watch('./endpoints.config.js').on('change', async () => {
      try {
        // Динамически перезагружаем конфигурацию
        const timestamp = new Date().getTime();
        const newModule = await import(`./endpoints.config.js?update=${timestamp}`);
        endpoints = newModule.default;
        console.log('[BrowserSync] Конфигурация эндпоинтов перезагружена');
        
        // Перезагружаем браузер
        browserSync.reload();
      } catch (err) {
        console.error('[BrowserSync] Ошибка при перезагрузке конфигурации:', err);
      }
    });
    
    return bs;
  });
}
