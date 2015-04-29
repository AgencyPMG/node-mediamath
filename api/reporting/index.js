/**
 * Reporting Api
 */

var util = require('util');
var BaseApi = require('../baseapi');

var ReportingApi = function(options) {
    BaseApi.call(this, options);
}

util.inherits(ReportingApi, BaseApi);

/**
 * gets a list of reports
 * @access public
 * @param options {object} additional objects, including auth object
 * @param callback {function}
 */
ReportingApi.prototype.getListOfReports = function(options, callback) {
    this.get('std/meta', options, callback);
}

/**
 * gets report meta data
 * @param reportDataUrl {string} the data url of the report e.g.
          "http://api.mediamath.com/reporting/v1/std/other_example"
 * @param options {object} additional options, including auth
 * @param callback {function}
 */
ReportingApi.prototype.getMetadataForReport = function(reportDataUrl, options, callback) {
    this.get(reportDataUrl + '/meta', options, callback);
}

/**
 * @inheritDoc
 */
ReportingApi.prototype.getApiScope= function() {
    return 'reporting';
}


module.exports = ReportingApi;
