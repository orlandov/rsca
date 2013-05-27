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
        } else if (value.type === 'literal') {
            return sprintf('%s', value.val);
        }
    }
}

function formatArray(arr, indentStr) {
    var vals = [];

    if (arr.length > 1) {
        for (var i in arr) {
            vals.push(indentStr + formatValue(arr[i]));
        }
        return sprintf('{\n%s\n}', vals.join(',\n'));
    } else if (arr.length === 1) {
        return sprintf('{%s}', formatValue(arr[0]));
    }
    else {
        return sprintf('{}');
    }

}

function classlist(options) {
    return block(options);
}

function block(options) {
    var type = options.type || 'class';
    var children = options.children || '\n';
    var name = options.name;
    var indentStr = options.indentStr || '    ';
    var values = options.values || {};

    var children = options.children;

    var fmt = [];
    var fmtvals = [];

    var renderType = type === 'classlist' ? 'class' : type;

    fmt.push('%s %s\n{\n');
    fmtvals.push(renderType, name);

    if (type === 'classlist' && children) {
        values.items = children.length;
    }

    if (values && Object.keys(values).length) {
        var keys = Object.keys(values);
        var values = values;
        var valuesCollector = [];

        for (var i in keys) {
            var key = keys[i];
            if (Array.isArray(values[key])) {
                var arrval = formatArray(values[key], indentStr);
                arrval = arrval.split('\n').join('\n'+indentStr);

                valuesCollector.push(
                    sprintf('%s[]=%s;', key, arrval));
            } else {
                valuesCollector.push(
                    sprintf('%s=%s;', key, formatValue(values[key], indentStr)));
            }
        }

        fmt.push('%s\n');

        values = valuesCollector.map(function (l) {
            return indentStr + l;
        }).join('\n');

        fmtvals.push(values);
    }

    if (children) {
        if (type === 'classlist') {
            var idx = 0;
            this.values

            for (var i in children) {
                var childObj = children[i];
                childObj.name = 'Item' + idx;
                idx++;

                var child = block(childObj).split('\n').map(function (l) {
                    return indentStr + l;
                }).join('\n');

                fmt.push('%s\n');
                fmtvals.push(child);
            }
        }
        else {
            for (var i in children) {
                var child = block(children[i]).split('\n').map(function (l) {
                    return indentStr + l;
                }).join('\n');

                fmt.push('%s\n');
                fmtvals.push(child);
            }
        }
    }

    fmt.push('};');

    var expanded = sprintf.apply(null, [fmt.join('')].concat(fmtvals));
    return expanded;
}

module.exports = {
    block: block,
    classlist: classlist,
    formatValue: formatValue,
    formatArray: formatArray
};
