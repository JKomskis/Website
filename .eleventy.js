module.exports = function (eleventyConfig) {
    eleventyConfig.addFilter("addLineBreaks", function (value) {
        return value.replace('\n', '<br>');
    });

    return {
        dir: {
            input: "web",
            output: "_site"
        }
    };
}