const { createHash } = require('node:crypto');

function getHash(content, length = 8) {
    return createHash('md5')
        .update(content)
        .digest('hex')
        .substring(0, length);
}

exports.getHash = getHash;