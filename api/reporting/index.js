/**
 * Reporting Api
 */

var util = require('util');
var BaseApi = require('../baseapi');

var ReportingApi = function(options) {
    BaseApi.call(this, options);
}

util.inherits(ReportingApi, BaseApi);

module.exports = ReportingApi;
