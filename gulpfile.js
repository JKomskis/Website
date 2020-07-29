const { series, parallel } = require('gulp');
const { assets } = require('./gulp/assets');
const { clean } = require('./gulp/clean');
const { compress } = require('./gulp/compress');
const { css } = require('./gulp/css');
const { eleventy } = require('./gulp/eleventy');
const { fonts } = require('./gulp/fonts');
const { serve } = require('./gulp/serve');

exports.clean = clean;
exports.build = series(
    clean,
    parallel(assets, css, fonts, eleventy),
    compress
);
exports.serve = series(exports.build, serve);
exports.default = exports.build;