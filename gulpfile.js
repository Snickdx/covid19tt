'use strict';

var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var del = require('del');
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
const minify = require('gulp-minify');
const workbox = require('workbox-build');


const dist = './public/';

// Gulp task to minify CSS files
gulp.task('styles', function () {
  return gulp.src('./src/main.css')
    // Minify the file
    .pipe(csso())
    // Output
    .pipe(gulp.dest(dist))
});

// Gulp task to minify JavaScript files
gulp.task('scripts', function() {
  gulp.src(['./src/*.js'])
    .pipe(minify({
        noSource:true,
         ext:{
            min:'.js'
        },
    }))
    .pipe(gulp.dest(dist))
});


// Gulp task to minify HTML files
gulp.task('pages', function() {
  return gulp.src(['./src/**/*.html'])
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest(dist));
});

gulp.task('assets', function(){
    return gulp.src(['src/assets/**/*'])
        .pipe(gulp.dest('public/assets'));
});

gulp.task('manifest', function(){
    return gulp.src(['src/manifest.json'])
        .pipe(gulp.dest('public/'));
});

gulp.task('generate-service-worker', () => {
  return workbox.generateSW({
    globDirectory: dist,
    globPatterns: [
      '\*\*/\*.{html,js}'
    ],
    swDest: `${dist}/sw.js`,
    clientsClaim: true,
    skipWaiting: true
  }).then(({warnings}) => {
    // In case there are any warnings from workbox-build, log them.
    for (const warning of warnings) {
      console.warn(warning);
    }
    console.info('Service worker generation completed.');
  }).catch((error) => {
    console.warn('Service worker generation failed:', error);
  });
});


// Clean output directory
gulp.task('clean', () => del(['public']));

// Gulp task to minify all files
gulp.task('default', ['clean'], function () {
  runSequence(
    'styles',
    'scripts',
    'pages',
    'assets',
    'manifest',
    'generate-service-worker'
  );
});