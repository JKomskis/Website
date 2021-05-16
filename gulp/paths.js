module.exports = {
    src: "./web",
    dest: "./_site",
    html: {
        src: './web/**/*.html',
        dest: './_site'
    },
    css: {
        src: './web/**/css/**/*.scss',
        dest: './_site'
    },
    ts: {
        src: './web/**/ts/**/main.ts',
        dest: './_site'
    },
    fonts: {
        base: './node_modules/@ibm/plex/',
        src: [
            './node_modules/@ibm/plex/IBM-Plex-{Mono,Sans,Serif}/fonts/complete/**/*.woff2',
            './node_modules/@ibm/plex/IBM-Plex-{Mono,Sans,Serif}/fonts/split/**/*Latin1.woff2',
        ],
        dest: './_site/assets/fonts/'
    },
    assets: {
        src: './web/assets/**/*',
        dest: './_site/assets'
    },
};
