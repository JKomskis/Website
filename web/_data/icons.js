const fa = require('@fortawesome/fontawesome-svg-core');
const faIcons = require('@fortawesome/free-solid-svg-icons');

module.exports = function () {
    fa.library.add(faIcons.faArrowRight);

    return {
        rightArrow: fa.icon(
            { prefix: 'fas', iconName: 'arrow-right' },
            {
                classes: ['side-project-header__return-link-arrow'],
            },
        ).html[0],
    };
};
