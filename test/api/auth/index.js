/**
 * tests for auth
 */

var assert = require('assert');

describe('Auth', function() {
    var Auth = require('../../../api/auth');

    describe('#constructor', function() {
        it('should create a authenticiation cookie if 1 parameter is set', function() {
            var a = new Auth('token');
            assert.strictEqual(typeof a.cookiestore, 'object', 'auth is not an object');
        });

        it('should set the username/password if 2 parameters are set', function() {
            var a = new Auth('username', 'password');
            assert.strictEqual('username', a.username, 'username is not "username"');
            assert.strictEqual('password', a.password, 'password is not "password"');
        });
    });

    describe('#isLoggedIn', function() {
        it('should return true if a user is logged in', function() {
            var a = new Auth('username', 'password');
            var b = new Auth('token');
            assert.strictEqual(false, a.isLoggedIn());
            assert.strictEqual(true, b.isLoggedIn());
        });
    });

    describe('#getCookiePool', function() {
        it('should return a tough-cookie object', function() {
            var a = new Auth('token');
            assert.strictEqual('object', typeof a.getCookiePool());
            assert.strictEqual('function', typeof a.getCookiePool().getCookies);
        });
    });

    describe('#shouldRetryLogin', function() {
        it('should be able to retry login', function() {
            var a = new Auth('token');
            assert.strictEqual(true, a.shouldRetryLogin());
        });

        it('should not retry if too many retries', function() {
            var a = new Auth('token');
            a.retries += Auth.RETRY_LIMIT + 1;
            assert.strictEqual(false, a.shouldRetryLogin());
        })
    })


})
