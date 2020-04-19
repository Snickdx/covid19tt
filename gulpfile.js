const gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const del = require("del");
const {injectManifest} = require('workbox-build');
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

function manifest(){
    return gulp.src([`${paths.source}/manifest.json`])
        .pipe(gulp.dest(`${paths.build}`));
}


function serviceWorker(){

    return injectManifest({
        swSrc: `${paths.source}/sw-src.js`,
        swDest: `${paths.build}/sw.js`,
        globDirectory: paths.build,
        globPatterns: [
            "**/*.{png,ico,js,html,css,json,mp3}"
        ]
    }).then(({count, size}) => {
        console.log(`Generated sw.js, which will precache ${count} files, totaling ${size} bytes.`);
    });

}

exports.default = exports.build = gulp.series(
    cleanup,
    assets,
    manifest,
    gulp.parallel(javascriptBuild, htmlBuild, cssBuild),
    serviceWorker
);