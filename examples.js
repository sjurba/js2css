'use strict';
var js2css = require('./lib/js2css.js');

var styles = require('./test.css.js');

console.log(js2css(styles));

var styles2 = require('./test2.css.js');

console.log(js2css(styles2));



js2css.mixins.sjurba = function (val) {
    return {
        color: 'sjurba ' + val
    };
};

console.log(js2css({
    body: {
        sjurba: 123
    }
}));


console.log(js2css({
    styles: {
        body: {
            sjurba: 123
        }
    },
    mixins: {
        sjurba: function (val) {
            return {
                color: 'Gabe ' + val
            };
        }
    }
}));

console.log(js2css({
    body: {
        color: ['red', 'blue']
    }
}));

console.log(js2css({
    body: {
        color: 'red'
    }
}));

console.log(js2css([{
    body: {
        color: ['red', 'blue', 123]
    }
}, {
    styles: {
        body: {
            sjurba: 123
        }
    },
    mixins: {
        sjurba: function (val) {
            return {
                color: val
            };
        }
    }
}]));

console.log(js2css({
    body: {
        '&.div': {
            color: 'red'
        },
        '&:div': {
            color: 'red'
        }
    }
}));
