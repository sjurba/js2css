'use strict';
var js3 = require('./lib/js3.js');

var styles = require('./test.css.js');

console.log(js3(styles));

var styles2 = require('./test2.css.js');

console.log(js3(styles2));



js3.plugins.sjurba = function (val) {
    return {
        color: 'sjurba ' + val
    };
};

console.log(js3({
    body: {
        sjurba: 123
    }
}));


console.log(js3({
    styles: {
        body: {
            sjurba: 123
        }
    },
    plugins: {
        sjurba: function (val) {
            return {
                color: 'Gabe ' + val
            };
        }
    }
}));

console.log(js3({
    body: {
        color: ['red', 'blue']
    }
}));

console.log(js3([{
    body: {
        color: ['red', 'blue', 123]
    }
}, {
    styles: {
        body: {
            sjurba: 123
        }
    },
    plugins: {
        sjurba: function (val) {
            return {
                color: val
            };
        }
    }
}]));

console.log(js3({
    body: {
        '&.div': {
            color: 'red'
        },
        '&:div': {
            color: 'red'
        }
    }
}));
