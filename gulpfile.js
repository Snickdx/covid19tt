const gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const del = require("del");
const workbox = require('workbox-build');
const minify = require('gulp-minify');

const paths = {
	source: "./src",
	build: "./public"
};


function javascriptBuild() {
  return gulp.src([`${paths.source}/*.js`])
    .pipe(minify({
        noSource:true,
         ext:{
            min:'.js'
        },
    }))
    .pipe(gulp.dest(paths.build))
}

function htmlBuild() {
	return gulp
		.src(`${paths.source}/*.html`)
		.pipe(htmlmin())
		.pipe(gulp.dest(paths.build));
}

function cssBuild() {
	return gulp
		.src(`${paths.source}/*.css`)
		.pipe(postcss([cssnano()]))
		.pipe(gulp.dest(`${paths.build}`));
}

function cleanup() {
	return del([paths.build]);
}

function assets(){
    return gulp.src([`${paths.source}/assets/**/*`])
        .pipe(gulp.dest(`${paths.build}/assets`));
}


function serviceWorker(){
  return workbox.generateSW({
    globDirectory: paths.build,
    globPatterns: [
      '\*\*/\*.{html,js}'
    ],
    swDest: `${paths.build}/sw.js`,
    clientsClaim: true,
    skipWaiting: true
  }).then(({warnings}) => {
    for (const warning of warnings) {
      console.warn(warning);
    }
    console.info('Service worker generation completed.');
  }).catch((error) => {
    console.warn('Service worker generation failed:', error);
  });
}

exports.default = exports.build = gulp.series(
    cleanup,
    assets,
    gulp.parallel(javascriptBuild, htmlBuild, cssBuild),
    serviceWorker
);