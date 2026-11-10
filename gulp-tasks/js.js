"use strict";

import gulp from "gulp";
import rollup from "@rollup/stream";
import {nodeResolve} from "@rollup/plugin-node-resolve";
import source from "vinyl-source-stream";
import buffer from "vinyl-buffer";
import gulpSrcMap from "gulp-sourcemaps";
import gulpTerser from "gulp-terser";
import {paths} from "./config.js";
import browserSync from "browser-sync";
import commonjs from '@rollup/plugin-commonjs';
import merge from 'merge-stream';

let cache = {};

// Конфигурация страниц
const pages = [
    {
        name: 'common',
        src: './src/js/common/common.js',
        dist: 'common.js'
    }
];

// Функция для создания потока для одной страницы
const createPageStream = (page, isProd = false) => {
    return rollup({
        input: page.src,
        plugins: [
            nodeResolve(),
            commonjs()
        ],
        cache: cache[page.name],
        output: {
            format: 'iife',
        },
        treeshake: false,
    })
    .on('bundle', function (bundle) {
        cache[page.name] = bundle;
    })
    .pipe(source(page.dist))
    .pipe(buffer());
};

// Dev задача
export const jsDev = () => {
    const streams = pages.map(page => {
        let stream = createPageStream(page, false);

        if (!stream) return null;

        return stream
            .pipe(gulpSrcMap.init({loadMaps: true}))
            .pipe(gulpSrcMap.write('.'))
            .pipe(gulp.dest(paths.scripts.dist))
            .pipe(browserSync.reload({stream: true}));
    }).filter(Boolean);

    return merge(streams);
};

// Prod задача
export const jsProd = () => {
    console.log('🚀 Starting jsProd task');
    console.log('📁 Dist path:', paths.scripts.dist);

    const streams = pages.map(page => {
        console.log(`Processing page: ${page.name} -> ${page.dist}`);

        try {
            let stream = createPageStream(page, true);

            if (!stream) {
                console.log(`⚠️ Stream is null for page: ${page.name}`);
                return null;
            }

            return stream
                .pipe(gulpTerser({format: {comments: false}}))
                .on('error', (error) => {
                    console.error(`❌ Terser error for ${page.name}:`, error);
                })
                .pipe(gulp.dest(paths.scripts.dist))
                .on('end', () => console.log(`✅ Successfully wrote: ${paths.scripts.dist}${page.dist}`))
                .on('error', (error) => {
                    console.error(`❌ Error writing ${page.dist}:`, error);
                });
        } catch (error) {
            console.error(`❌ Exception for ${page.name}:`, error);
            return null;
        }
    }).filter(Boolean);

    console.log(`📊 Number of streams in prod: ${streams.length}`);
    return merge(streams);
};
