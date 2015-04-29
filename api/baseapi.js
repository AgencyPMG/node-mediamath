/**
 * Follows a base Api
 */
var _ = require('underscore');
var request = require('request');
var querystring = require('querystring');
var util = require('util');

var BaseApi = function(options) {
    this.options = _.extend({}, BaseApi.defaultOptions, options);
}

/**
 * uses a get request to send to a method
 * @param method {string} a method, without a starting slash. e.g. 'login'
 * @param parameters {obj} any parameters needed in the query string
 * @param callback {function} with error and data
 */
BaseApi.prototype.get = function(method, parameters, callback) {
    parameters = parameters || {};

    if (parameters.auth && !parameters.auth.isLoggedIn() && parameters.auth.shouldRetryLogin()) {
        this.login(parameters.auth, _.bind(function(error, auth) {
            if (error) {
                return callback(error);
            }
            parameters.auth = auth;
            this.get(method, parameters, callback);
        }, this));
    } else {
        var uri = util.format(
            '%s/%s?%s',
            this.options.baseUrl,
            method,
            querystring.stringify(_.omit(parameters, 'auth'))
        )
        request({
            uri: uri ,
            jar: parameters.auth ? parameters.auth.getCookiePool() : false
        }, _.bind(this.finishRequest(callback), this));
        this.log(uri);

    }
}

/**
 * sends a post request to mediamath
 * @param method {string} a method, without a starting slash. e.g. 'login'
 * @param parameters {obj} any parameters needed in the query string
 * @param callback {function} with error and data
 */
BaseApi.prototype.post = function(method, parameters, callback) {
    parameters = parameters || {};

    if (parameters.auth && !parameters.auth.isLoggedIn() && parameters.auth.shouldRetryLogin()) {
        this.login(parameters.auth, _.bind(function(error, auth) {
            if (error) {
                return callback(error);
            }
            parameters.auth = auth;
            this.post(method, parameters, callback);
        }, this));
    } else {
        var uri = util.format(
            '%s/%s',
            this.options.baseUrl,
            method
        )
        request({
            method: 'POST',
            uri: uri ,
            form: _.omit(parameters, 'auth'),
            jar: parameters.auth ? parameters.auth.getCookiePool() : false
        }, _.bind(this.finishRequest(callback), this));
        this.log(uri);
    }
}

/**
 * Parses the finished request
 * @access protected
 * @param callback {function} callback with error and body
 */
BaseApi.prototype.finishRequest = function(callback) {
    return function(error, response, body) {
        callback(error, body);
    }
}

/**
 * logs a user in if the auth token does not exist
 * the get/post methods will automatically call this method if auth is provided
 * @access public
 * @param auth {Authentication} An Authentication method
 * @param callback {function}
 */
BaseApi.prototype.login = function(auth, callback) {
    if (!auth.username || !auth.password) {
        return callback('No username/password defined');
    }
    auth.retries++;
    var uri = util.format('%s/login',this.options.baseUrl);

    request({
        method: 'POST',
        uri: uri ,
        form: {
            user: auth.username,
            password: auth.password,
        },
        jar: auth.getCookiePool()
    }, function(error, response, data) {
        if (error || !data) {
            return callback(error || 'Could not login, unexpected error');
        }

        if (-1 !== data.indexOf('Login Incorrect')) {
            return callback('Incorrect Login');
        }
        callback(null, auth);
    });
    this.log(uri);

}

/**
 * Logs out messages
 * @param message {mixed} a message to display
 * @access protected
 */
BaseApi.prototype.log = function(message) {
    if (this.options.debug) {
        console.log('MEDIAMATH_API: ', message);
    }
}

BaseApi.defaultOptions = {
    baseUrl: 'https://api.mediamath.com/api/v1',
    apiToken: '',
    auth: null,
    debug: false
}

module.exports = BaseApi;
