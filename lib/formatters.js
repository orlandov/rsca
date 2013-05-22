var sprintf = require('sprintf').sprintf;
var assert = require('assert-plus');

function formatValue(value, indentStr) {
    if (Object.prototype.toString.call(value) === '[object String]') {
        return sprintf('"%s"', value.replace(/"/g, '""'));
    } else if (Array.isArray(value)) {
        return formatArray(value, indentStr);
    } else if (typeof (value) == 'number') {
        return value;
    } else if (typeof (value) == 'object') {
        if (value.type === 'expr') {
            if (value.val.match(/^\w+$/)) {
                return sprintf('@%s', value.val);
            } else {
                return sprintf('@%s', formatValue(value.val, indentStr));
            }
        }
    }
}

function formatArray(arr, indentStr) {
    var vals = [];

    for (var i in arr) {
        vals.push(indentStr + formatValue(arr[i]));
    }

    return sprintf('{\n%s\n}', vals.join(',\n'));
}

function block(options) {
    var type = options.type || 'class';
    var content = options.content || '\n';
    var name = options.name;
    var indentStr = options.indentStr || '    ';

    var content;
    var contentLines;

    var fmt = [];
    var fmtvals = [];
    
    fmt.push('%s %s\n{\n');
    fmtvals.push(type, name);

    if (options.values && Object.keys(options.values).length) {
        var keys = Object.keys(options.values);
        var values = options.values;
        var valuesCollector = [];

        for (var i in keys) {
            var key = keys[i];
            if (Array.isArray(values[key])) {
                var arrayValues = values[key].map(function (l) {
                    return sprintf('%s"%s"', indentStr, l);
                }).join(',\n');

                valuesCollector.push(sprintf('%s[] = {', key));
                [].push.apply(valuesCollector, arrayValues.split('\n'));
                valuesCollector.push('};');
            } else if (typeof (values[key]) == 'number') {
                valuesCollector.push(
                    sprintf('%s = %s;', key, formatValue(values[key], indentStr)));
            } else if (Object.prototype.toString.call(values[key])
                         === '[object String]')
            {
                valuesCollector.push(
                    sprintf('%s = %s;', key, formatValue(values[key], indentStr)));
            } else if (typeof (values[key]) == 'object') {
                if (values[key].type === 'expr') {
                    valuesCollector.push(
                        sprintf('%s = %s;', key, formatValue(values[key], indentStr)));
                }
            }
        }

        fmt.push('%s\n');

        values = valuesCollector.map(function (l) {
            return indentStr + l;
        }).join('\n');

        fmtvals.push(values);
    }

    if (options.content) {
        content = options.content.split('\n').map(function (l) {
            return indentStr + l;
        }).join('\n');

        fmt.push('%s\n');
        fmtvals.push(content);
    }

    fmt.push('};');

    var expanded = sprintf.apply(null, [fmt.join('')].concat(fmtvals));
    return expanded;
}

function Ref(val) {
    this.val = val;
}

function RefQuote(val) {
    this.val = val;
}

module.exports = {
    block: block,
    formatValue: formatValue,
    formatArray: formatArray
};
