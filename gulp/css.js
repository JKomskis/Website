const { series, src, dest } = require('gulp');
const rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
sass.compiler = require('node-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const gulpStylelint = require('gulp-stylelint');
const paths = require('./paths');

function compileCss() {
    const postCssPlugins = [
        autoprefixer()
    ];
    return src(paths.css.src)
        .pipe(gulpStylelint({
            reporters: [
                { formatter: 'string', console: true }
            ]
        }))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(postCssPlugins))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(paths.css.dest));
}

function minifyCss() {
    // minify .css files, but not .min.css files
    return src([`${paths.css.dest}/**/*.css`, `!${paths.css.dest}/**/*.min.css`])
        .pipe(sourcemaps.init())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(postcss([
            cssnano()
        ]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(paths.css.dest));
}

exports.css = series(compileCss, minifyCss);