'use strict';
var js2css = require('../lib/js2css.js');

describe('JS2CSS', function () {

    describe('compile', function () {
        it('basic', function () {
            js2css({
                body: {
                    color: 'red'
                }
            });
        });
    });

});
