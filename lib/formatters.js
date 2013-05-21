var sprintf = require('sprintf').sprintf;
var assert = require('assert-plus');

function block(options) {
    var type = options.type || 'class';
    var content = options.content || '\n';
    var name = options.name;
    var indentStr = options.indentStr || '    ';
    var fmt;

    var content = "";
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

module.exports = {
    block: block
};
