var assert = require('assert');
var formatters = require('../lib/formatters');

describe('config block', function (done) {
    it('formats a config block', function (done) {
        var actual = formatters.block({
            name: 'Mission'
        });
        var expected = [
            "class Mission",
            "{",
            "};"
        ].join("\n");

        assert.equal(actual, expected);
        done();
    });

    it('formats a nested block with indent', function (done) {
        var block1 = formatters.block({
            name: 'Intel',
            content: 'something'
        });

        var block0 = formatters.block({
            name: 'Mission',
            content: block1
        });

        var expected = [
            "class Mission",
            "{",
            "    class Intel",
            "    {",
            "        something",
            "    };",
            "};"
        ].join("\n");

        assert.equal(block0, expected);
        done();
    });

    it('formats a config block with indent', function (done) {
        var actual = formatters.block({
            name: 'Mission',
            content: 'something'
        });

        var expected = [
            "class Mission",
            "{",
            "    something",
            "};"
        ].join("\n");

        assert.equal(actual, expected);
        done();
    });

    it('formats a config block that has key/value pairs', function (done) {
        var actual = formatters.block({
            name: 'Mission',
            content: 'something',
            values: {
                addOns: ["addon0", "addon1"],
                addOnsAuto: ["addon2", "addon3"]
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
        ].join("\n");

        assert.equal(actual, expected);
        done();
    });
});

