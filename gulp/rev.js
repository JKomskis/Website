const { src, dest, series } = require('gulp');
const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');
const { readFileSync } = require('fs');
const revdel = require('gulp-rev-delete-original');
const del = require('del');
const paths = require('./paths');

function sortBySpecificity(file1, file2) {
    if(file1.split("/").length > file2.split("/").length) {
        return -1;
    } else if(file1.split("/").length < file2.split("/").length) {
        return 1;
    } else if(file1 < file2) {
        return -1;
    } else if(file2 > file1) {
        return 1;
    } else {
        return 0;
    }
}

function revision() {
    return src(`${paths.baseOutputDir}/**/*.{css,js,woff2,jpg,png,svg}`)
        .pipe(rev())
        .pipe(revdel())
        .pipe(dest(paths.baseOutputDir))
        .pipe(rev.manifest())
        .pipe(dest(paths.baseOutputDir));
}

function rewrite() {
    const manifest = JSON.parse(readFileSync(`${paths.baseOutputDir}/rev-manifest.json`));

    const keys = Object.keys(manifest);
    keys.sort(sortBySpecificity);

    const sortedManifest = {};
    keys.forEach((value) => {
        sortedManifest[value] = manifest[value];
    });
    const sortedManifestString = JSON.stringify(sortedManifest);

    return src(`${paths.dest}/**/*.{html,css}`)
        .pipe(revRewrite({ manifest: sortedManifestString }))
        .pipe(dest(paths.dest));
}

function removeManifest() {
    return del([`${paths.dest}/rev-manifest.json`], { force: true });
}

exports.rev = series(revision, rewrite, removeManifest);