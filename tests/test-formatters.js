var assert = require('assert');
var formatters = require('../lib/formatters');

describe('formatters.formatValue', function (done) {
    var value, actual, expected;

    it('formats a string', function (done) {
        value = 'hello world';
        expected = '"hello world"';
        actual = formatters.formatValue(value);

        assert.equal(actual, expected);

        value = 'hello "cruel" world';
        expected = '"hello ""cruel"" world"';
        actual = formatters.formatValue(value);

        assert.equal(actual, expected);

        done();
    });

    it('formats a number', function (done) {
        value = 123;
        expected = '123';
        actual = formatters.formatValue(value);

        assert.equal(actual, expected);

        value = 123.4;
        expected = '123.4';
        actual = formatters.formatValue(value);

        assert.equal(actual, expected);
        done();
    });

    it('formats an expression', function (done) {
        value = { type: 'expr', val: '_weather' };
        expected = '@_weather';
        actual = formatters.formatValue(value);

        assert.equal(actual, expected);

        value = {
            type: 'expr',
            val: 'format ["BIS_patrolLength = %1", _PatrolLength]'
        };
        expected = '@"format [""BIS_patrolLength = %1"", _PatrolLength]"';
        actual = formatters.formatValue(value);

        assert.equal(actual, expected);
        done();
    });

    it('formats an array', function (done) {
        var value, actual, expected;

        value = [123, 456];
        expected = [
            "{",
            "    123,",
            "    456",
            "}"
        ].join('\n');
        actual = formatters.formatArray(value, "    ");

        assert.equal(actual, expected);
        done();
    });

    it('formats an array value', function (done) {
        var value, actual, expected;

        value = [123, 456];
        expected = [
            "{",
            "    123,",
            "    456",
            "}"
        ].join('\n');
        actual = formatters.formatValue(value, "    ");

        assert.equal(actual, expected);

        value = 123.4;
        expected = 123.4;
        actual = formatters.formatValue(value, "    ");

        assert.equal(actual, expected);
        done();
    });
});


describe('formatters.block', function (done) {

    it('formats a config block',
    function (done) {
        var actual = formatters.block({
            name: 'Mission'
        });
        var expected = [
            'class Mission',
            '{',
            '};'
        ].join('\n');

        assert.equal(actual, expected);
        done();
    });

    it('formats a nested block with indent',
    function (done) {
        var block1 = formatters.block({
            name: 'Intel',
            content: 'something'
        });

        var block0 = formatters.block({
            name: 'Mission',
            content: block1
        });

        var expected = [
            'class Mission',
            '{',
            '    class Intel',
            '    {',
            '        something',
            '    };',
            '};'
        ].join('\n');

        assert.equal(block0, expected);
        done();
    });

    it('formats a config block with indent',
    function (done) {
        var actual = formatters.block({
            name: 'Mission',
            content: 'something'
        });

        var expected = [
            'class Mission',
            '{',
            '    something',
            '};'
        ].join('\n');

        assert.equal(actual, expected);
        done();
    });

    it('formats a config block that has array key/value pairs',
    function (done) {
        var actual = formatters.block({
            name: 'Mission',
            content: 'something',
            values: {
                addOns: ['addon0', 'addon1'],
                addOnsAuto: ['addon2', 'addon3']
            }
        });

        var expected = [
            'class Mission',
            '{',
            '    addOns[] = {',
            '        "addon0",',
            '        "addon1"',
            '    };',
            '    addOnsAuto[] = {',
            '        "addon2",',
            '        "addon3"',
            '    };',
            '    something',
            '};'
        ].join('\n');

        assert.equal(actual, expected);
        done();
    });

    it('formats a config block that has number key/value pairs',
    function (done) {
        var actual = formatters.block({
            name: 'Mission',
            content: 'something',
            values: {
                addOns: ['addon0', 'addon1'],
                addOnsAuto: ['addon2', 'addon3'],
                randomseed: 123.4
            }
        });

        var expected = [
            'class Mission',
            '{',
            '    addOns[] = {',
            '        "addon0",',
            '        "addon1"',
            '    };',
            '    addOnsAuto[] = {',
            '        "addon2",',
            '        "addon3"',
            '    };',
            '    randomseed = 123.4;',
            '    something',
            '};'
        ].join('\n');

        assert.equal(actual, expected);
        done();
    });

    it('formats a config block that has string key/value pairs',
    function (done) {
        var actual = formatters.block({
            name: 'Mission',
            content: 'something',
            values: {
                expActiv: 'H1 land "GET IN"'
            }
        });

        var expected = [
            'class Mission',
            '{',
            '    expActiv = "H1 land ""GET IN""";',
            '    something',
            '};'
        ].join('\n');

        assert.equal(actual, expected);
        done();
    });

    it('formats a config block that has "referency" key/value pairs',
    function (done) {
        var actual = formatters.block({
            name: 'Mission',
            content: 'something',
            values: {
                startWeather: {
                    type: 'expr',
                    val: '_weather'
                }
            }
        });

        var expected = [
            'class Mission',
            '{',
            '    startWeather = @_weather;',
            '    something',
            '};'
        ].join('\n');

        assert.equal(actual, expected);
        done();
    });

    it('formats a config block that has "quoted reference" key/value pairs',
    function (done) {
        var actual = formatters.block({
            name: 'Mission',
            content: 'something',
            values: {
                init: {
                    type: 'expr',
                    val: 'format ["BIS_patrolLength = %1", _PatrolLength]'
                }
            }
        });

        var expected = [
            'class Mission',
            '{',
            '    init = @"format [""BIS_patrolLength = %1"", _PatrolLength]";',
            '    something',
            '};'
        ].join('\n');

        assert.equal(actual, expected);
        done();
    });
});

