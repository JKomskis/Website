module.exports = function (eleventyConfig) {
    eleventyConfig.addFilter("addLineBreaks", function (value) {
        return value.replace('\n', '<br>');
    });

    eleventyConfig.addFilter("getCdnUrl", function (value) {
        return `${site.cdnUrl}/${value}`;
    });

    return {
        dir: {
            input: "web",
            output: "_site"
        }
    };
}