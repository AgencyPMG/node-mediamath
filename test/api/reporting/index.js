/**
 * Tests for ReportingApi
 */

var assert = require('assert');
var ReportingApi = require('../../../api/reporting');
var Auth = require('../../../api/auth');

var username = process.env.MEDIAMATH_API_USERNAME || '';
var password = process.env.MEDIAMATH_API_PASSWORD || '';
var token = process.env.MEDIAMATH_API_TOKEN || '';

if (!username || !password || !token) {
    return;
}

describe('ReportingApi', function() {
    var auth;
    var reports;
    before(function(done) {
        auth = new Auth(username, password);
        reports = new ReportingApi({apiToken: token});
        reports.login(auth, function(error, auth) {
            if (error) {
                return done(error);
            }
            auth = auth;
            done();
        });
    });


    describe('#getListOfReports', function() {
        it('should return a response with reports', function(done) {
            reports.getListOfReports({auth: auth}, function(error, data) {
                if (error) {
                    return done(error);
                }
                if (!data.reports || !data.reports) {
                    return done('Reports did not exist');
                }
                return done();
            });
        });
    });

    describe('#getMetadataForReport', function() {
        it('should return meta data for report', function(done) {
            reports.getMetadataForReport(
                'https://api.mediamath.com/reporting/v1/std/geo',
                {auth: auth},
                function(error, data) {
                    if (error) {
                        return done(error);
                    }
                    if (!data.Name || !data.structure) {
                        return done('Report has no name or structure');
                    }
                    return done();
                }
            )
        })
    })

    describe('#getApiScope', function() {
        it('should return string "api"', function() {
            assert.strictEqual('reporting', reports.getApiScope());
        });
    });


});
