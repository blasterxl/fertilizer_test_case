'use strict';

var gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  sass = require('gulp-sass'),
  browserSync = require("browser-sync"),
  rigger = require('gulp-rigger'),
  bourbon = require('node-bourbon'),
  del = require('del'),
  reload = browserSync.reload;

var path = {
  dev: {
    html: 'dev/',
    js: 'dev/js/',
    css: 'dev/css',
    img: 'dev/img/',
    fonts: 'dev/fonts/'
  },
  src: {
    html: 'src/*.html',
    js: 'src/js/*.js',
    style: 'src/style/*.sass',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*'
  }
};

var config = {
  server: {
    baseDir: 'dev'
  },
  tunnel: false,
  host: 'localhost',
  port: 8080,
  logPrefix: "gulp-starter"
};

gulp.task('webserver', function() {
  browserSync(config);
});

gulp.task('html:build', function() {
  return gulp.src(path.src.html)
    .pipe(rigger())
    .pipe(gulp.dest(path.dev.html))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('js:build', function() {
  return gulp.src(path.src.js)
    .pipe(rigger())
    .pipe(gulp.dest(path.dev.js))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('style:build', function() {
  return gulp.src(path.src.style)
    .pipe(sass({
      includePaths: bourbon.includePaths
    }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(path.dev.css))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('image:build', function() {
  return gulp.src(path.src.img)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest(path.dev.img))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('fonts:build', function() {
  return gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.dev.fonts))
    .pipe(reload({stream: true}));
});

gulp.task('clean', function() {
  return del.sync('./dev');
});

gulp.task('watch', ['webserver'], function() {
  gulp.watch('src/*.html', ['html:build']);
  gulp.watch('src/style/*.sass', ['style:build']);
  gulp.watch('src/js/*.js', ['js:build']);
  gulp.watch('src/img/**/*.*', ['image:build']);
  gulp.watch('src/fonts/**/*.*', ['fonts:build']);
});

gulp.task('build', [
  'clean',
  'html:build',
  'style:build',
  'js:build',
  'image:build',
  'fonts:build'
]);

gulp.task('default', ['build', 'webserver', 'watch']);
