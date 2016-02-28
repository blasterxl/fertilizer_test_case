'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    rename = require('gulp-rename'),
    bourbon = require('node-bourbon'),
    uglify = require('gulp-uglify'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

//переменная путей
var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css',
        img: 'build/img/',
        fonts: 'build/fonts/',
        //libs: 'build/libs'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html',
        js: 'src/js/common.js',
        style: 'src/style/*.sass',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        //libs: 'src/libs/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/*.sass',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

//переменная с настройками dev сервера
var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "gulp-starter"
};

gulp.task('webserver', function () {
    browserSync(config);
});

//Удаляем папку ./build
gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

//Собираем html
gulp.task('html:build', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.html)) //в папку build
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

//Собираем js
gulp.task('js:build', function () {
    gulp.src(path.src.js) //Найдем наш main файл
        //.pipe(rigger()) //Прогоним через rigger
        //.pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js
        //.pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest(path.build.js)) //готовый файл в build
        .pipe(reload({stream: true})); //перезагрузим сервер
});

//Собираем стили
gulp.task('style:build', function () {
    gulp.src(path.src.style) //Выберем наш main.sass
    //.pipe(sourcemaps.init())
    .pipe(sass({
        includePaths: require('node-bourbon').includePaths
    }).on('error', sass.logError))
    .pipe(rename({suffix: '.min'}))
    .pipe(prefixer({ //Добавим вендорные префиксы
        browsers: ['last 15 versions'],
        cascade: false
    }))
    .pipe(cssmin()) //Сожмем
    //.pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css)) //И в build
    .pipe(reload({stream: true})); //И перезагрузим сервер
});

//Собираем картинки
gulp.task('image:build', function () {
    gulp.src(path.src.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        .pipe(reload({stream: true}));
});

//Шрифты
gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

//libs
/*gulp.task('libs:build', function() {
    gulp.src(path.src.libs)
        .pipe(gulp.dest(path.build.libs))
});
*/
//Task Build
gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build',
    //'libs:build'
]);

//Следим за изменением файлов
gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
/*    watch([path.watch.libs], function(event, cb) {
        gulp.start('libs:build');
    });
*/
});

//default
gulp.task('default', ['build', 'webserver', 'watch']);
