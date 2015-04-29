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
        })
    });

    describe('#get', function() {
        it('should get a site list', function(done) {
            var b = new BaseApi();
            var auth = new Auth(username, password);
            b.get('site_lists', {auth: auth}, done);
        });
    });

});
