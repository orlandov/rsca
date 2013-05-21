var assert = require('assert');
var Mission = require('../../lib/models/mission');

describe('Mission', function (done) {
    describe('toSqm', function (done) {
        it('can be serialized to a SQM-formatted string', function (done) {
            var m = new Mission();

            var expected = [
                "class Mission",
                "{",
                "};"
            ].join("\n");

            m.toSqm(function (err, data) {
                assert.equal(data, expected);
                done()
            });

        });
    });
});
