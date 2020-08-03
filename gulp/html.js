const { src, dest } = require('gulp');
const htmlmin = require('gulp-htmlmin');

function minifyHtml() {
    return src('_site/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest('_site'));
}

exports.minifyHtml = minifyHtml;