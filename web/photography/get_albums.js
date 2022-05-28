const { promises: fs } = require('fs');
const glob = require('glob');
const { promisify } = require('util');

const globPromise = promisify(glob);

module.exports = async function () {
    // const albumJsonRegex = /web\/photography\/albums\/([^\\]+)\/\1\.json/;
    let albumFiles = await globPromise('web/photography/albums/*.json');
    // albumFiles = albumFiles.filter((path) => albumJsonRegex.test(path));
    const albums = albumFiles.map(async (filePath) => {
        const fileData = await fs.readFile(filePath);
        const jsonData = JSON.parse(fileData);
        return jsonData;
    });

    return albums;
};
