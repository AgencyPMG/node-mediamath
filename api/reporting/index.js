/**
 * Reporting Api
 */

var util = require('util');
var _ = require('underscore');
var request = require('request');
var fs = require('fs');

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
 * Gets the report data and stores it in memory
 * @param reportDataUrl {string} the data url of the report
 * @param options {object} additional options, including all the report options
 * @param callback {function}
 */
ReportingApi.prototype.getReportData = function(reportDataUrl, options, callback) {
    this.get(reportDataUrl, options, callback);
}

/**
 * Gets the report data and streams it into a file
 * @param filePath {string} the file path to store the file
 * @param reportDataUrl {string} the data url of the report
 * @param options {object} additional options, including all the report options
 * @param callback {function}
 */
ReportingApi.prototype.streamReportToFile = function(filePath, reportDataUrl, options, callback) {
    parameters = options || {};
    this.tryLogin(parameters, _.bind(function(error, auth) {
        if (error) {
            return callback(error);
        }
        parameters.auth = auth;
        var uri = this.getUri(reportDataUrl, parameters);
        request({
            uri: uri,
            jar: parameters.auth ? parameters.auth.getCookiePool() : false
        })
        .on('end', function() {
            callback(null, filePath);
        })
        .on('error', callback)
        .pipe(fs.createWriteStream(filePath));
        this.log(uri);
    }, this));

}

/**
 * @inheritDoc
 */
ReportingApi.prototype.getApiScope= function() {
    return 'reporting';
}


module.exports = ReportingApi;
