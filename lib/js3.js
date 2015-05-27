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
var isArray = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};

var css = function (styles) {
    if (styles.plugins && styles.styles) {
        return preprocess(styles.styles, styles.plugins);
    } else {
        return preprocess(styles);
    }
};

function preprocess(json, plugins) {
    var rules = [];
    var processContents = function (scope, contents) {
        return reduce(contents, function (result, val, rule) {
            var plugin = lookupPlugin(rule, plugins);
            if (plugin) {
                return result + processContents(scope, plugin(val));
            }
            if (isArray(contents)) {
                return result + processContents(scope, val);
            }
            if (typeof val === 'function') {
                val = val();
            }
            if (typeof val === 'object' || isArray(val)) {
                addRule(clonePush(scope, rule), val);
            }
            if (typeof val === 'string') {
                return result + css.space + dashCase(rule) + ': ' + val + ';\n';
            }
            return result;
        }, '');
    };

    var addRule = function (scope, contents) {
        rules.unshift(scope.join(' ').replace(' :', ':') + '{\n' +
            processContents(scope, contents) + '}\n');
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

function lookupPlugin(rule, plugins) {
    if (plugins && plugins[rule]) {
        return plugins[rule];
    } else if (css.plugins && css.plugins[rule]) {
        return css.plugins[rule];
    } else {
        return null;
    }
}

css.space = '\t';
css.plugins = {};

module.exports = css;
