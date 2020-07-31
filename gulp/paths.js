module.exports = {
    src: "./web",
    dest: "./_site",
    css: {
        src: './web/css/**/*.scss',
        dest: './_site/css'
    },
    fonts: {
        base: './node_modules/@ibm/plex/',
        src: [
            './node_modules/@ibm/plex/IBM-Plex-Mono/fonts/**/*.woff',
            './node_modules/@ibm/plex/IBM-Plex-Mono/fonts/**/*.woff2',
            './node_modules/@ibm/plex/IBM-Plex-Sans/fonts/**/*.woff',
            './node_modules/@ibm/plex/IBM-Plex-Sans/fonts/**/*.woff2',
            './node_modules/@ibm/plex/IBM-Plex-Serif/fonts/**/*.woff',
            './node_modules/@ibm/plex/IBM-Plex-Serif/fonts/**/*.woff2',
        ],
        dest: './_site/assets/fonts/'
    },
    assets: {
        src: './web/assets/**/*',
        dest: './_site/assets'
    },
};
