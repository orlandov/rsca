var fs = require('fs');

var formatters = require('formatters');

function Mission() {
}

Mission.prototype.toSqm = function (callback) {
    callback(null, formatters.block({ name: "Mission" }));
}

module.exports = Mission;
