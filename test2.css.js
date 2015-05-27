'use strict';
var themeColor = '#BADA55';
var textStyles = function (size) {
    return {
        color: themeColor,
        fontSize: size + 'px',
        lineHeight: size + 'px'
    };
};

var coolPadz = function (pad) {
    return {
        paddingTop: pad * 0.6 + 'px',
        paddingBottom: pad * 0.6 + 'px',
        paddingLeft: pad + 'px',
        paddingRight: pad + 'px',
    };
};

var style = {
    body: {
        color: themeColor,
        p: textStyles(16),
        '.title': {
            color: '#000',
            coolPadz: 40
        }
    }
};

module.exports = {
    styles: style,
    plugins: {
        coolPadz: coolPadz
    }
};
