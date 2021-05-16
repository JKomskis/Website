module.exports = function (eleventyConfig) {
    eleventyConfig.addFilter("addLineBreaks", function (value) {
        return value.replace('\n', '<br>');
    });

    eleventyConfig.addFilter("getCdnUrl", function (value) {
        return `${site.cdnUrl}/${value}`;
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

    return {
        dir: {
            input: "web",
            output: "_site"
        }
    };
}