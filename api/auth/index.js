/**
 * Auth Api
 */

var request = require('request');
var util = require('util');
var BaseApi = require('../baseapi');

var Authentication = function(username, password) {
    this.cookiestore = request.jar();
    this.retries = 0;

    if (1 === arguments.length) {
        var cookie = request.cookie(
            util.format('adama_session=%s', encodeURIComponent(username))
        );
        this.cookiestore.setCookie(cookie, BaseApi.defaultOptions.baseUrl);
    } else {
        this.username = username || '';
        this.password = password || '';
    }

}

Authentication.RETRY_LIMIT = 1;

/**
 * Checks to see if a user is logged in
 * @access public
 * @return {boolean}
 */
Authentication.prototype.isLoggedIn = function() {
    if (!this.cookiestore) {
        return false;
    }

    return !!this.cookiestore.getCookies(
        BaseApi.defaultOptions.baseUrl
    ).length;
}

/**
 * Gets the cookie bool
 * @access public
 * @return {tough-cookie}
 */
Authentication.prototype.getCookiePool = function() {
    return this.cookiestore;
}

/**
 * Decides if it should retry the login after af failed attempt
 * @access public
 * @return {boolean} true if it is ok to try the login process
 */
Authentication.prototype.shouldRetryLogin = function() {
    return this.retries <= Authentication.RETRY_LIMIT;
}


module.exports = Authentication;
