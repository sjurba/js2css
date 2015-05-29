'use strict';
var js2css = require('../lib/js2css.js');
var expect = require('chai').expect;

describe('JS2CSS', function () {

    describe('compile', function () {

        beforeEach(function () {
            js2css.mixins = {};
        });

        function consolidate(css) {
            return css.replace(/\n*/g, '').replace(/([;:{}])\s/g, '$1').replace(/\s([;:{}])/g, '$1').trim();
        }

        function verifyCompile(input, expected) {
            var res = js2css(input);
            expect(consolidate(res)).to.equal(consolidate(expected));
        }

        it('basic', function () {
            verifyCompile({
                body: {
                    color: 'red'
                }
            }, 'body { color: red;}');
        });
        it('function', function () {
            function foo() {
                return 'red';
            }
            verifyCompile({
                body: {
                    color: foo
                }
            }, 'body { color: red;}');
        });
        it('array', function () {
            verifyCompile({
                body: {
                    color: ['red', 'blue', 'black']
                }
            }, 'body { color: red; color: blue; color: black;}');
        });
        it('nesting', function () {
            verifyCompile({
                    body: {
                        color: 'blue',
                        div: {
                            color: 'red'
                        }
                    }
                },
                'body { color: blue; }' +
                'body div {color: red; }');
        });

        it('empty selectors', function () {
            verifyCompile({
                    body: {
                        div: {}
                    }
                },
                '');
        });

        it('nesting connected selectors', function () {
            verifyCompile({
                    div: {
                        '&.myclass': {
                            color: 'red'
                        }
                    }
                },
                'div.myclass {color: red; }');
        });

        it('mixins', function () {
            var coolmixin = function (val) {
                return {
                    padding: val + 'px'
                };
            };
            var styles = {
                body: {
                    coolmixin: 12
                }
            };
            var mixins = {
                coolmixin: coolmixin
            };
            verifyCompile({
                styles: styles,
                mixins: mixins
            }, 'body { padding: 12px; }');
        });

        it('global mixins', function () {
            var coolmixin = function (val) {
                return {
                    padding: val + 'px'
                };
            };
            js2css.mixins.coolmixin = coolmixin;
            verifyCompile({
                body: {
                    coolmixin: 12
                }
            }, 'body { padding: 12px; }');
        });

        it('array of styles', function () {
            verifyCompile([{
                body: {
                    color: 'red'
                }
            }, {
                div: {
                    color: 'blue'
                }
            }], 'body { color: red;} div { color: blue; }');
        });

        it('camelcase', function () {
            verifyCompile({
                body: {
                    fontSize: '12px'
                }
            }, 'body { font-size: 12px;}');
        });

    });

    describe('to json', function () {
        function verifyToJson(input, expected) {
            var res = js2css.toJSON(input);
            expect(res).to.deep.equal(expected);
        }

        it('basic', function () {
            verifyToJson('body { color: red;}', {
                body: {
                    color: 'red'
                }
            });
        });
    });

});
