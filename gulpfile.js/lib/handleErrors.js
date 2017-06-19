'use strict';

var notify = require("gulp-notify");

module.exports = function(errorObject, callback) {
    notify.onError(errorObject.toString().split(': ').join(':\n')).apply(this, arguments);
    process.exit(1);
};
