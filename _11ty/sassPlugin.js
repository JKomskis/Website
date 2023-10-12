const sass = require('sass');
const path = require('node:path');
const { getHash } = require('./util.js');
const eleventyConfig = require('../eleventy.config.js');

module.exports = function (config) {
    config.addTemplateFormats('scss');

    config.addExtension('scss', {
        // Sass package will read file content
        read: false,

        getData: function (inputPath) {
            const data = {
                eleventyExcludeFromCollections: true
            };

            if (path.basename(inputPath).startsWith('_')) {
                return data;
            }

            let parsed = path.parse(inputPath);
            const compileResult = sass.compile(inputPath, {
                loadPaths: [
                    parsed.dir || '.'
                ]
            });



            data._content = compileResult.css;
            data._hash = getHash(compileResult.css);
            data._dependencies = compileResult.loadedUrls;

            return data;
        },

        compileOptions: {
            cache: false,
            permalink: function (permalink, inputPath) {
                if (path.basename(inputPath).startsWith('_')) {
                    return false;
                }

                return data => `${data.page.filePathStem}.${data._hash}.css`;
            }
        },

        compile: function (inputContent, inputPath) {
            let eleventyConfig = this;

            return (data) => {
                eleventyConfig.addDependencies(inputPath, data._dependencies);

                return data._content;
            }
        }
    });
}