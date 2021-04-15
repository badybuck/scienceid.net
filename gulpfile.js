'use strict';

global.$ = {
    gulp: require('gulp'),
    del: require('del'),
    babel: require('gulp-babel'),
    pug: require('gulp-pug'),
    notify: require('gulp-notify'), 
    svgmin: require('gulp-svgmin'),
    cheerio: require('gulp-cheerio'),
    replace: require('gulp-replace'),
    svgSprite: require('gulp-svg-sprite'),
    sass: require('gulp-sass'),
    npmDist: require('gulp-npm-dist'),
    newer: require('gulp-newer'),
    rename: require('gulp-rename'),
    gp: require('gulp-load-plugins'),
    responsive: require('@tigersway/gulp-responsive'),

    gulpif: require('gulp-if'),
    sassGlob: require('gulp-sass-glob'),
    tabify: require('gulp-tabify'),
    envDev: false,
    gcmq: require('gulp-group-css-media-queries'),
    // "gulp-group-css-media-queries": "^1.2.2",
    gp: require('gulp-load-plugins')(),
    browserSync: require('browser-sync').create(),
    postcss: require('gulp-postcss'),
    autoprefixer: require('autoprefixer'),
    postcssPresetEnv: require('postcss-preset-env'),
    cssnano: require('cssnano'),
    nested: require('postcss-nested'),
    plumber: require('gulp-plumber'),
    webpack: require('webpack-stream'),
    resizer: require('gulp-images-resizer'),
    path: {
        tasks: require('./gulp/config/tasks.js'),
    },
    public: 'public',
    sourse: 'sourse',
}
$.path.tasks.forEach(function (taskPath) {
    require(taskPath)();
});



$.gulp.task('default', $.gulp.series( 
    $.gulp.parallel( 
        'pug',  
        'scripts:common',
        'sass',
        'serv', 'watch'
        // 'scripts:common',
        // 'scripts:app',
    ),
    // $.gulp.parallel()
));
