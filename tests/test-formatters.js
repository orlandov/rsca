var assert = require('assert');
var fs = require('fs');
var formatters = require('../lib/formatters');
var path = require('path');

// TODO replace 'expr' objects with 'literals'

function compareOutput(actual, expectedFn) {
    expectedFn = path.join(__dirname, 'expected', expectedFn);
    var data = fs.readFileSync(expectedFn);
    assert.equal(actual, data.toString().trim());
}

describe('formatters.formatValue', function () {
    var value, actual, expected;

    it('formats a string', function (done) {
        value = 'hello world';
        expected = '"hello world"';
        actual = formatters.formatValue(value);

        assert.equal(actual, expected);

        value = 'goodbye "cruel" world';
        expected = '"goodbye ""cruel"" world"';
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
        var obj0 = {
            name: 'BlockC',
            children: []
        };

        var obj1 = {
            name: 'BlockB',
            children: [obj0]
        };


        var actual = formatters.block({
            name: 'BlockA',
            children: [obj1]
        });

        var expected = [
            'class BlockA',
            '{',
            '    class BlockB',
            '    {',
            '        class BlockC',
            '        {',
            '        };',
            '    };',
            '};'
        ].join('\n');

        assert.equal(actual, expected);
        done();
    });

    it('formats a config block with indent',
    function (done) {
        var actual = formatters.block({
            name: 'Mission',
        });

        var expected = [
            'class Mission',
            '{',
            '};'
        ].join('\n');

        assert.equal(actual, expected);
        done();
    });

    it('formats a config block that has array key/value pairs',
    function (done) {
        var actual = formatters.block({
            name: 'Mission',
            values: {
                addOns: ['addon0', 'addon1'],
                addOnsAuto: ['addon2', 'addon3']
            }
        });

        var expected = [
            'class Mission',
            '{',
            '    addOns[]={',
            '        "addon0",',
            '        "addon1"',
            '    };',
            '    addOnsAuto[]={',
            '        "addon2",',
            '        "addon3"',
            '    };',
            '};'
        ].join('\n');


//         console.log('actual');
//         console.log(actual);
//         console.log('expected');
//         console.log(expected);
//         console.log('--');

        assert.equal(actual, expected);
        done();
    });

    it('formats a config block that has number key/value pairs',
    function (done) {
        var actual = formatters.block({
            name: 'Mission',
            values: {
                addOns: ['addon0', 'addon1'],
                addOnsAuto: ['addon2', 'addon3'],
                randomseed: 123.4
            }
        });

        var expected = [
            'class Mission',
            '{',
            '    addOns[]={',
            '        "addon0",',
            '        "addon1"',
            '    };',
            '    addOnsAuto[]={',
            '        "addon2",',
            '        "addon3"',
            '    };',
            '    randomseed=123.4;',
            '};'
        ].join('\n');

        assert.equal(actual, expected);
        done();
    });

    it('formats a config block that has string key/value pairs',
    function (done) {
        var actual = formatters.block({
            name: 'Mission',
            values: {
                expActiv: 'H1 land "GET IN"'
            }
        });

        var expected = [
            'class Mission',
            '{',
            '    expActiv="H1 land ""GET IN""";',
            '};'
        ].join('\n');

        assert.equal(actual, expected);
        done();
    });

    it('can format expressions',
    function (done) {
        var actual = formatters.block({
            name: 'Mission',
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
            '    startWeather=@_weather;',
            '};'
        ].join('\n');

        assert.equal(actual, expected);
        done();
    });

    it('can format expressions that need to be quoted',
    function (done) {
        var actual = formatters.block({
            name: 'Mission',
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
            '    init=@"format [""BIS_patrolLength = %1"", _PatrolLength]";',
            '};'
        ].join('\n');

        assert.equal(actual, expected);
        done();
    });

    it('can format arrays of expression',
    function (done) {
        var actual = formatters.block({
            name: 'Mission',
            values: {
                position: [
                    {
                        type: 'expr',
                        val: '_Insertion_X'
                    },
                    {
                        type: 'expr',
                        val: '_Insertion_Y'
                    },
                    {
                        type: 'expr',
                        val: '_Insertion_Z'
                    }
                ]
            }
        });

        var expected = [
            'class Mission',
            '{',
            '    position[]={',
            '        @_Insertion_X,',
            '        @_Insertion_Y,',
            '        @_Insertion_Z',
            '    };',
            '};'
        ].join('\n');

        assert.equal(actual, expected);
        done();
    });

    it('can format an array with length 0 or 1 items',
    function (done) {
        var actual = formatters.block({
            name: 'Mission',
            values: {
                synchronizations: [0],
                empty: []
            }
        });

        var expected = [
            'class Mission',
            '{',
            '    synchronizations[]={0};',
            '    empty[]={};',
            '};'
        ].join('\n');

//         console.log('actual');
//         console.log(actual);

        assert.equal(actual, expected);
        done();
    });

    it('can format literal expressions',
    function (done) {
        var actual = formatters.block({
            name: 'Mission',
            values: {
                position: [
                    {
                        type: 'literal',
                        val: '@_Insertion_X + 5'
                    },
                    {
                        type: 'literal',
                        val: '@_Insertion_Y - 5'
                    },
                    {
                        type: 'literal',
                        val: '@_Insertion_Z * 100'
                    }
                ]
            }
        });

        var expected = [
            'class Mission',
            '{',
            '    position[]={',
            '        @_Insertion_X + 5,',
            '        @_Insertion_Y - 5,',
            '        @_Insertion_Z * 100',
            '    };',
            '};'
        ].join('\n');

        assert.equal(actual, expected);
        done();
    });

    it('can format a shallow class list',
    function (done) {
        var actual = formatters.classlist({
            name: 'Groups',
            type: 'classlist',
            children: [
                {
                    values: {
                        name: "alice",
                        side: "WEST"
                    }
                },
                {
                    values: {
                        name: "bob",
                        side: "WEST"
                    }
                },
                {
                    values: {
                        name: "eve",
                        side: "WEST"
                    }
                }
            ]
        });

        var expected = [
            'class Groups',
            '{',
            '    items=3;',
            '    class Item0',
            '    {',
            '        name="alice";',
            '        side="WEST";',
            '    };',
            '    class Item1',
            '    {',
            '        name="bob";',
            '        side="WEST";',
            '    };',
            '    class Item2',
            '    {',
            '        name="eve";',
            '        side="WEST";',
            '    };',
            '};'
        ].join('\n');

//         console.log('actual');
//         console.log(actual);

        assert.equal(actual, expected);

        done();
    });

    it('can format a nested class lists',
    function (done) {
        var actual = formatters.classlist({
            name: 'Groups',
            type: 'classlist',
            children: [
                {
                    values: {
                        name: "alice",
                        side: "WEST"
                    }
                },
                {
                    values: {
                        name: "bob",
                        side: "WEST"
                    }
                },
                {
                    values: {
                        name: "eve",
                        side: "WEST"
                    }
                }
            ]
        });

        compareOutput(actual, 'nested-class-list.txt');
        done();
    });
});
