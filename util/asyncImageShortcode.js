const Image = require('@11ty/eleventy-img');

module.exports = async function (src, alt, sizes) {
    let metadata = await Image(src, {
        widths: [300, 600],
        formats: ['jpeg', 'webp'],
    });

    let imageAttributes = {
        alt,
        sizes,
        loading: 'lazy',
        decoding: 'async',
    };

    // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
    return Image.generateHTML(metadata, imageAttributes);
};
