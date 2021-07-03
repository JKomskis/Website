const { src, dest, series, parallel } = require('gulp');
const rollup = require('@rollup/stream');
const rename = require('gulp-rename');
const replace = require('@rollup/plugin-replace');
const rollupTypescript = require('@rollup/plugin-typescript');
const nodeResolve = require('@rollup/plugin-node-resolve');
const filesize = require('rollup-plugin-filesize');
const alias = require('@rollup/plugin-alias');
const commonjs = require('@rollup/plugin-commonjs');
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');
const eslint = require('gulp-eslint');
const paths = require('./paths');
const path = require('path');
const { promisify } = require('util');
const glob = require('glob');

const globSync = promisify(glob);

function lintTs() {
    return src(paths.ts.src)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

// declare the cache variable outside of task scopes
let cache;

async function compileTs() {
    const entryPoints = await globSync(paths.ts.src);
    console.log(entryPoints);
    return Promise.all(entryPoints.map((entryPoint) => {
        return rollup({
            input: entryPoint,
            output: {
                sourcemap: true,
                format: 'es'
            },
            plugins: [
                replace({
                    'process.env.API_BASE_PATH': JSON.stringify(process.env.API_BASE_PATH),
                    preventAssignment: true
                }),
                rollupTypescript(),
                nodeResolve.nodeResolve({ browser: true }),
                commonjs({
                    include: '**'
                }),
                filesize(),
            ],
            cache: cache
        })
            .on('bundle', (bundle) => {
                // update the cache after every new bundle is created
                cache = bundle;
            })
            .pipe(source('bundle.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(terser({
                compress: {
                    ecma: 2015
                },
                output: {
                    ecma: 2015
                },
                module: true
            }))
            .pipe(sourcemaps.write('.'))
            .pipe(rename((file) => {
                const relativeDirname = path.join(path.dirname(path.dirname(path.relative(paths.src, entryPoint))),
                                                  'js');

                file.dirname = path.join(paths.ts.dest, relativeDirname);
            }))
            .pipe(dest('.'));
    }));    
}

exports.ts = series(lintTs, compileTs);
exports.lintTs = lintTs