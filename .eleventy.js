const { library, icon, findIconDefinition } = require('@fortawesome/fontawesome-svg-core');
const { fas } = require('@fortawesome/free-solid-svg-icons');
const cdnUrl = require('./util/cdnUrl');
const imageShortcode = require('./util/asyncImageShortcode');

library.add(fas);

module.exports = function (eleventyConfig) {
    eleventyConfig.addFilter("addLineBreaks", function (value) {
        return value.replace('\n', '<br>');
    });

    eleventyConfig.addFilter("cdnUrl", function (value) {
        return cdnUrl(value);
    });

    eleventyConfig.addFilter("removeLineBreak", (value) => {
        return value.replace(/\r/g, '').replace(/\n/g, ' ');
    });

    eleventyConfig.addFilter("formatTime", (value) => {
        let date = new Date(value);
        const year = date.getUTCFullYear().toString().substring(2, 4);
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = date.getUTCDate().toString().padStart(2, '0');
        let hour = (date.getUTCHours());
        let timeSuffix = "AM";
        if(hour > 12) {
            hour -= 12;
            timeSuffix = "PM";
        } else if(hour == 12) {
            timeSuffix = "PM";
        }
        else if(hour == 0) {
            hour = 12;
        }
        hour = hour.toString().padStart(2, "0");
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');

        return `${month}/${day}/${year} ${hour}:${minutes} ${timeSuffix}`;
    });

    eleventyConfig.addFilter("reverse", function(value) {
        return value.reverse();
    });

    eleventyConfig.addFilter("makePathRelative", function(value) {
        if(value[0] === '/') {
            return value.substring(1);
        }
        return value;
    });

    eleventyConfig.addFilter("stem", function(value) {
        return value.substr(0, value.indexOf('.'));
    });

    eleventyConfig.addNunjucksShortcode("faIcon", function(value) {
        const iconDef = findIconDefinition({ prefix: 'fas', iconName: value });
        const iconSize = 16;
        return icon(
            iconDef,
            {
                transform: {
                    size: iconSize,
                },
                classes: "height-100p"
            },
        ).html[0];
    });

    eleventyConfig.addFilter("jsonString", function(value) {
        return JSON.stringify(value);
    });

    eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

    let pathPrefix = process.env.FRONTEND_PATH_PREFIX || "/";
    if(pathPrefix.startsWith("/")) {
        pathPrefix.substr(1);
    }
    if(pathPrefix.endsWith("/")) {
        pathPrefix.substr(0, pathPrefix.length-1);
    }

    let outputDir = './_site'
    if(pathPrefix !== "") {
        outputDir = `./_site/${pathPrefix}`;
    }

    return {
        dir: {
            input: "web",
            output: outputDir
        },
        pathPrefix: pathPrefix
    };
}