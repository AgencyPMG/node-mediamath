/**
 * Tests for BaseApi
 */

var assert = require('assert');
var Auth = require('../../api/auth');
var BaseApi = require('../../api/baseapi');

var apitoken = process.env.MEDIAMATH_API_TOKEN || '';
var username = process.env.MEDIAMATH_API_USERNAME || '';
var password = process.env.MEDIAMATH_API_PASSWORD || '';

describe('BaseApi', function() {

    BaseApi.defaultOptions.apiToken = apitoken;

    describe('#constructor', function() {
        var b = new BaseApi();
        it('should contain a base url', function() {
            assert.strictEqual('string', typeof b.options.baseUrl, 'baseUrl is a string');
            assert.strictEqual('string', typeof b.options.apiToken, 'apiToken is a string');
        });
    });

    if (!username || !password) {
        console.log('Could not run BaseApi#login test, no username/password');
        return;
    }

    describe('#login', function() {

        it('should not authenticate the user', function(done) {
            var b = new BaseApi();
            var auth = new Auth('badusername', 'badpassword');
            b.login(auth, function(error) {
                done(error ? null : 'Should have not authenticated user');
            });
        });

        it('should authenicate a user', function(done) {
            var b = new BaseApi();
            var auth = new Auth(username, password);
            b.login(auth, function(error, auth) {
                if (error) {
                    return done(error);
                }
                done(auth.isLoggedIn() ? null : 'Should be logged in, incorrect cookies');
            });
        });

        it('should not allow to login without a username/password', function(done) {
            var b = new BaseApi();
            var auth = new Auth();
            b.login(auth, function(error) {
                if (!error) {
                    return done('should have thrown not logged in error');
                }
                done();
            })
        })

    });

    describe('#get', function() {
        var b = new BaseApi();
        var auth = new Auth(username, password);

        it('should get a site list', function(done) {
            b.get('site_lists', {auth: auth}, done);
        });

        it('should return a 404 error', function(done) {
            b.get('404', {auth: auth}, function(error) {
                if (!error) {
                    return done('call did not return 404');
                }
                done();
            });
        })

    });

    describe('#post', function() {
        it('should execute a failed call', function(done) {
            var b = new BaseApi();
            b.post('bad', null, function(error, data) {
                console.log(error, data);
                if (!error) {
                    return done('should have failed');
                }
                return done();
            })
        })
    })

    describe('#getUri', function() {
        it('should return a full url from a partial url', function() {
            var b = new BaseApi();
            assert.strictEqual(b.options.baseUrl + '/api/'+b.options.version+'/method?', b.getUri('method'));
        });

        it('should return a full url', function() {
            var b = new BaseApi();
            var url = b.options.baseUrl + '/method';
            assert.strictEqual(url + '?', b.getUri(url));
        })
    });

    describe('#getApiScope', function() {
        it('should return string "api"', function() {
            var b = new BaseApi();
            assert.strictEqual('api', b.getApiScope());
        })
    });

    describe('#log', function() {
        it('should execute the log statement', function() {
            var b = new BaseApi();
            b.options.debug = true;
            b.log('test');
        });
    });

});
