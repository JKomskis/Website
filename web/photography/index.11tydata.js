const Image = require("@11ty/eleventy-img");
const get_albums = require('./get_albums');
const cdnUrl = require('../../util/cdnUrl');

module.exports = async function () {
    console.log("Calling index.11tydata.js");
    let albums = await get_albums();
    albums = albums.map(async (album) => {
        let albumObj = await album;
        albumObj.pictures = albumObj.pictures.filter((pictureObj) => {
            return pictureObj.preview === true;
        });

        const picturePromises = albumObj.pictures.map(async (picture) => {
            let pictureObj = await picture;
            pictureObj.fullUrl = cdnUrl(`photography/${albumObj.path}/${picture.name}`);
            
            const stats = await Image(pictureObj.fullUrl, {
                widths: [null],
                formats: [null],
                urlPath: `/assets/img/photography/${albumObj.path}/`,
                outputDir: `./_site/assets/img/photography/${albumObj.path}/`,
            });
            pictureObj.url = stats.jpeg[0].url;
            pictureObj.width = stats.jpeg[0].width;
            pictureObj.height = stats.jpeg[0].height;
            return pictureObj;
        });
        albumObj.pictures = await Promise.all(picturePromises);
        return albumObj;
    });

    albums = await Promise.all(albums);
    return {
        albums: albums
    };
};
