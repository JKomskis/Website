module.exports = function (eleventyConfig) {
  return {
    dir: {
      input: "web",
      output: "dist",
    },

    markdownTemplateEngine: "njk",
    htmlTemplateEngine: false
  }
};