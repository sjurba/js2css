'use strict';

var reduce = function (obj, fn, memo) {
    for (var propName in obj) {
        if (obj.hasOwnProperty(propName)) {
            memo = fn(memo, obj[propName], propName);
        }
    }
    return memo;
};

//Converts camel case into dashes. marginTop -> margin-top
var dashCase = function (str) {
    return str.replace(/([A-Z])/g, function (m, w) {
        return '-' + w.toLowerCase();
    });
};
//Clones the array, pushes to it, and returns it
var clonePush = function (arr, val) {
    var temp = arr.slice(0);
    temp.push(val);
    return temp;
};

var css = function (styles) {
    if (Array.isArray(styles)) {
        return styles.map(css).join('');
    } else if (styles.mixins && styles.styles) {
        return preprocess(styles.styles, styles.mixins);
    } else {
        return preprocess(styles);
    }
};

function preprocess(json, mixins) {
    var rules = [];
    var processContents = function (scope, contents) {
        return reduce(contents, function (result, val, rule) {
            var plugin = lookupMixins(rule, mixins);
            if (plugin) {
                return result + processContents(scope, plugin(val));
            }
            if (typeof val === 'function') {
                val = val();
            }
            if (Array.isArray(val)) {
                return result + val.map(getValue.bind(null, rule)).join('');
            } else if (typeof val === 'object') {
                addRule(clonePush(scope, rule), val);
            } else {
                return result + getValue(rule, val);
            }
            return result;
        }, '');
    };

    var getValue = function (rule, val) {
        return css.space + dashCase(rule) + ': ' + val + ';\n';
    };

    var addRule = function (scope, contents) {
        var content = processContents(scope, contents);
        if (content) {
            rules.unshift(joinScope(scope) + ' {\n' +
                content + '}\n');
        }
    };

    var joinScope = function (scope) {
        return scope.reduce(function (acc, rule) {
            var sep = ' ';
            if (rule[0] === '&') {
                sep = '';
                rule = rule.slice(1);
            }
            return (acc ? acc + sep : '') + rule;
        }, '');
    };

    for (var def in json) {
        addRule([def], json[def]);
    }
    return rules.join('');
}

//Converts a string of css into a json object
css.toJSON = function (cssString) {
    var result = {};
    var convertCode = function (code) {
        var r = {};
        code = code.split(';');
        for (var i in code) {
            if (code[i].indexOf(':') !== -1) {
                var parts = code[i].split(':');
                r[parts[0].trim()] = parts[1].trim();
            }
        }
        return r;
    };
    var rules = cssString.split('}');
    for (var i = 0; i < rules.length; i++) {
        var parts = rules[i].split('{');
        if (parts[0].trim() !== '') {
            result[parts[0].trim()] = convertCode(parts[1]);
        }
    }
    return result;
};

function lookupMixins(rule, mixins) {
    if (mixins && mixins[rule]) {
        return mixins[rule];
    } else if (css.mixins && css.mixins[rule]) {
        return css.mixins[rule];
    } else {
        return null;
    }
}

css.space = ' ';
css.mixins = {};

module.exports = css;
