import gulp from 'gulp';
import replace from 'gulp-replace';
import endpoints from './endpoints.config.js';



export const replaceLinks = () => {
    let stream = gulp.src('dist/**/*.{html,js,json}');
    
    // Проходим по всем правилам из endpoints
    for (const [pattern, replacement] of Object.entries(endpoints)) {
        if (typeof replacement === 'string') {
            // Создаем регулярное выражение для поиска URL в кавычках
            const regex = new RegExp(`(['"\`])(${pattern})(['"\`])`, 'g');
            stream = stream.pipe(replace(regex, `$1${replacement}$3`));
        }
    }
    
    return stream.pipe(gulp.dest('dist'));
};

export const versionAssets = () => {

    const getVersion = () => {
        return Date.now(); // или new Date().getTime()
    };

    const version = getVersion();
    
    return gulp.src('dist/**/*.html')
        .pipe(replace(/(<(?:link|script)[^>]*(?:href|src)=["'])([^"']+\.(?:css|js))(["'][^>]*>)/g, 
            (match, prefix, url, suffix) => {
                // Пропускаем внешние ссылки (начинающиеся с http:// или https://)
                if (url.startsWith('http://') || url.startsWith('https://')) {
                    return match;
                }
                
                const separator = url.includes('?') ? '&' : '?';
                return `${prefix}${url}${separator}v=${version}${suffix}`;
            }
        ))
        .pipe(gulp.dest('dist'));
};

 