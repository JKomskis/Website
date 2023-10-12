const pluginSass = require('./_11ty/sassPlugin.js');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginSass);

  return {
    dir: {
      input: "web",
      output: "dist",
    },

    markdownTemplateEngine: "njk",
    htmlTemplateEngine: false
  }
};