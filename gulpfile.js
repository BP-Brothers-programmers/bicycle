'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    browserSync  = require('browser-sync').create(),
    sass = require('gulp-sass'),
    pug = require('pug'),
    gulpPug = require('gulp-pug'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-clean-css'),
    wait = require('gulp-wait'),
    include = require('gulp-include'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    flatten = require('gulp-flatten'),
    iconfont = require('gulp-iconfont');

var runTimestamp = Math.round(Date.now() / 1000);

var path = {
    build: { // куда складывать
        html: './build/',
        images: './app/assets/images',
        css: './app/assets/stylesheets/',
        iconfont: './app/assets/iconfont/'
    },
    src: { // откуда брать
        html: ['assets/pages/**/*.pug', 'assets/pages/*.pug'],
        images: 'assets/images/*.*',
        style: 'assets/import.scss',
        styleLibs: 'assets/libs/css/*.css',
        iconfont: 'assets/images/iconfont/*.svg'
    },
    watch: { // за чем наблюдать
        html: 'assets/**/*.pug',
        images: 'assets/images/*.*',
        style: 'assets/modules/**/*.scss',
        styleLibs: 'assets/libs/css/*.css'
    },
    clean: './assets'
};


/* собрать pug в html */

function log(error) {
    console.log([
        '',
        "----------ERROR MESSAGE START----------",
        ("[" + error.name + " in " + error.plugin + "]"),
        error.message,
        "----------ERROR MESSAGE END----------",
        ''
    ].join('\n'));
    this.end();
}

gulp.task('html:build', function () {

    var config = require(__dirname + '/assets/content.json');

    return gulp.src(path.src.html)
    .pipe(gulpPug({
        pug: pug,
        pretty: true,
        locals: config
    }))
    .on('error', log)
    .pipe(flatten())
    .pipe(gulp.dest(path.build.html))
});

/* блоки котировок для ajax */

gulp.task('quotesBlock:build', function () {
  return gulp.src('assets/modules/quotes-info/*.pug')
    .pipe(gulpPug({
      pug: pug,
      pretty: true
    }))
    .pipe(gulp.dest('build/server/quotes-info/'))
});

/* собрать scss в css */
gulp.task('style:build', function () {
    gulp.src([
        path.src.style,
        'node_modules/tiny-slider/dist/tiny-slider.css',
        'node_modules/flatpickr/dist/flatpickr.css'
    ])
        .pipe(wait(200))
        .pipe(sass().on('error', sass.logError))
        .pipe(prefixer())
        .pipe(concat('main.css'))
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.stream())
});

// библиотеки

gulp.task('styleLibs:build', function () {
    gulp.src(path.src.styleLibs)
        .pipe(wait(200))
        .pipe(cssmin())
        .pipe(concat('libs.css'))
        .pipe(gulp.dest(path.build.css))
});


gulp.task('images:build', function () {
    gulp.src(path.src.images)
        .pipe(imagemin())
        .pipe(gulp.dest(path.build.images))
});

gulp.task('iconfont:build', function() {
    return gulp.src(path.src.iconfont)
        .pipe(
            iconfont({
                fontName: 'iconfont',
                prependUnicode: true,
                formats: ['ttf', 'eot', 'woff', 'svg'],
                timestamp: runTimestamp
            })
        )
        .on('glyphs', function(glyphs, options) {
            console.log(glyphs, options);
        })
        .pipe(gulp.dest(path.build.iconfont));
});

/* собрать всё */
gulp.task('build', [
    'html:build',
    //'quotesBlock:build',
    'style:build',
    'styleLibs:build',
    'images:build',
    'iconfont:build'
]);


/* собрать всё */
gulp.task('devBuild', [
    'html:build',
    //'quotesBlock:build',
    'style:build',
    'styleLibs:build'
]);

gulp.task('browser-sync', function() {
    return browserSync.init({
      server: {
        baseDir: "./",
        directory: true
     },
     notify: false
  })
})

/* следить за изменениями */
gulp.task('watch', ['browser-sync'], function(){
    gulp.watch([path.watch.html], function(event, cb) {
        //console.log(event.path);
        gulp.start('html:build');
        // var config = require(__dirname + '/assets/content.json');
        // return gulp.src(event.path)
        //     .pipe(gulpPug({
        //         pug: pug,
        //         pretty: true,
        //         locals: config
        //     }))
        //     .on('error', log)
        //     .pipe(flatten())
        //     .pipe(gulp.dest(path.build.html))
    });
    gulp.watch(['assets/modules/quotes-info/*.pug'], function(event, cb) {
        gulp.start('quotesBlock:build');
    });
    gulp.watch(['assets/modules/**/*.scss', 'assets/default.scss', 'assets/buttons.scss', 'assets/landing-default.scss'], function(event, cb) {
        gulp.start('style:build');
    });
    gulp.watch(['assets/style.scss'], function(event, cb) {
        gulp.start('style:build');
    });
    gulp.watch(['assets/parts/**/*.pug'], function(event, cb) {
        gulp.start('html:build');
    });
    gulp.watch(['assets/parts/**/*.scss', 'assets/default.scss', 'assets/buttons.scss', 'assets/landing-default.scss'], function(event, cb) {
        gulp.start('style:build');
    });
    gulp.watch([path.watch.styleLibs], function(event, cb) {
        gulp.start('styleLibs:build');
    });
    gulp.watch([path.watch.images], function(event, cb) {
        gulp.start('images:build');
    });
    gulp.watch('build/*.html').on('change', browserSync.reload);
});

gulp.task('dev', ['devBuild', 'watch']);
gulp.task('default', ['build', 'watch']);