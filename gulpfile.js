const gulp = require("gulp");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const babelify = require("babelify");
const uglify = require("gulp-uglify");
const htmlmin = require("gulp-htmlmin");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const del = require("del");

const paths = {
	source: "./src",
	build: "./public"
};

function javascriptBuild() {
	return browserify({
		entries: [`${paths.source}/scripts/main.js`],
		transform: [babelify.configure({ presets: ["@babel/preset-env"] })]
	})
		.bundle()
		.pipe(source("bundle.js"))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest(`${paths.build}/scripts`));
}

function htmlBuild() {
	return gulp
		.src(`${paths.source}/*.html`)
		.pipe(htmlmin())
		.pipe(gulp.dest(paths.build));
}

function cssBuild() {
	return gulp
		.src(`${paths.source}/styles/**/*.css`)
		.pipe(postcss([cssnano()]))
		.pipe(gulp.dest(`${paths.build}/styles`));
}

function cleanup() {
	return del([paths.build]);
}

function assets(){
    return gulp.src(['src/assets/**/*'])
        .pipe(gulp.dest('public/assets'));
}


function serviceWorker(){
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
}


// Run using gulp or gulp build
exports.default = exports.build = gulp.series(
    cleanup,
    assets,
    gulp.parallel(javascriptBuild, htmlBuild, cssBuild),
    serviceWorker
);