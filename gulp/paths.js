// let pathPrefix = process.env.FRONTEND_PATH_PREFIX || "/";
// if(pathPrefix.startsWith("/")) {
//     pathPrefix.substr(1);
// }
// if(pathPrefix.endsWith("/")) {
//     pathPrefix.substr(0, pathPrefix.length-1);
// }

let outputDir = './_site'
// if(pathPrefix !== "") {
//     outputDir = `./_site/${pathPrefix}`;
// }

module.exports = {
    src: "./web",
    baseOutputDir: './_site',
    dest: outputDir,
    html: {
        src: './web/**/*.html',
        dest: outputDir
    },
    css: {
        src: './web/**/css/**/*.scss',
        dest: outputDir
    },
    ts: {
        src: './web/**/ts/**/main.ts',
        dest: outputDir
    },
    fonts: {
        base: './node_modules/@ibm/plex/',
        src: [
            './node_modules/@ibm/plex/IBM-Plex-{Mono,Sans,Serif}/fonts/complete/**/*.woff2',
            './node_modules/@ibm/plex/IBM-Plex-{Mono,Sans,Serif}/fonts/split/**/*Latin{1,2,3}.woff2',
        ],
        dest: `${outputDir}/assets/fonts/`
    },
    assets: {
        src: './web/assets/**/*',
        dest: `${outputDir}/assets`
    },
};
