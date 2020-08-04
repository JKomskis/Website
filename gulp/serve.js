const { watch, parallel } = require('gulp');
const browserSync = require('browser-sync').create();
const { assets } = require('./assets');
const { css } = require('./css');
const watchEleventy = require('./eleventy').watch;

function watchFiles() {
    watch("./web/css/**/*.scss", css);
    watch("./web/assets/**/*", assets);
    watchEleventy();
}

function serve() {
    browserSync.init({
        server: "./_site",
        watch: true
    });
}

exports.serve = parallel(watchFiles, serve);