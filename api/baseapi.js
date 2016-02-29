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
    this.tryLogin(parameters, _.bind(function(error, auth) {
        if (error) {
            return callback(error);
        }
        parameters.auth = auth;
        var uri = this.getUri(method, parameters);
        request({
            uri: uri,
            jar: parameters.auth ? parameters.auth.getCookiePool() : false
        }, _.bind(this.finishRequest(callback), this));
        this.log(uri);
    }, this));
}

/**
 * sends a post request to mediamath
 * @param method {string} a method, without a starting slash. e.g. 'login'
 * @param parameters {obj} any parameters needed in the query string
 * @param callback {function} with error and data
 */
BaseApi.prototype.post = function(method, parameters, callback) {
    parameters = parameters || {};

    this.tryLogin(parameters, _.bind(function(error, auth) {
        if (error) {
            return callback(error);
        }
        parameters.auth = auth;
        var uri = this.getUri(method);
        request({
            method: 'POST',
            uri: uri ,
            form: _.omit(parameters, 'auth'),
            jar: parameters.auth ? parameters.auth.getCookiePool() : false
        }, _.bind(this.finishRequest(callback), this));
        this.log(uri);
    }, this));
}

/**
 * Either logs in or bypasses login if no parameters.auth is available
 * @param parameters {object} params, might include auth parameter
 * @param callback {function} return error and an auth object
 */
BaseApi.prototype.tryLogin = function(parameters, callback) {

    if (parameters.auth
        && !parameters.auth.isLoggedIn()
        && parameters.auth.shouldRetryLogin())
    {
        this.login(parameters.auth, function(error, auth) {
            if (error) {
                return callback(error);
            }
            callback(null, auth);
        });
    } else {
        callback(null, parameters.auth);
    }
}

/**
 * Gets a Uri based on the method and base url
 * @access protected
 * @param method {string} either a full url or an extension of the base url
 * @param getparameters {object} objects that go as get request variables
 * @return {string} a full url to use in the request
 */
BaseApi.prototype.getUri = function(method, getparameters) {
    getparameters = getparameters || {};
    var qs = querystring.stringify(_.omit(getparameters, 'auth'));

    if (-1 !== method.indexOf(this.options.baseUrl)) {
        return util.format('%s?%s', method, qs);
    }

    return util.format(
        '%s/%s/%s/%s?%s',
        this.options.baseUrl,
        this.getApiScope(),
        this.options.version,
        method, qs);
}

/**
 * Parses the finished request
 * @access protected
 * @param callback {function} callback with error and body
 */
BaseApi.prototype.finishRequest = function(callback) {
    return function(error, response, body) {
        if (error) {
            return callback(error);
        }

        if(response.statusCode >= 400) {
            this.log('MediaMathError: ' + response.statusCode + ' ' + body);
            return callback('MediaMathError: ' + response.statusCode);
        }

        if (/application\/json\; charset\=UTF-8/.test(response.headers['content-type'])) {
            try {
                body = JSON.parse(body);
            } catch(e) {
                return callback(e, body);
            }
            return callback(null, body);
        }

        if (-1 !== body.indexOf('Authentication Required')) {
            return callback('MediaMathError: Not Logged In');
        }

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
    var uri = util.format(
        '%s/api/%s/login',
        this.options.baseUrl,
        this.options.version
    );

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
 * The scope of the api, this method should be overwritten by child classes
 * @return {string} defaults to 'api'
 */
BaseApi.prototype.getApiScope= function() {
    return 'api';
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
    baseUrl: 'https://api.mediamath.com',
    apiToken: '',
    auth: null,
    version: 'v1',
    debug: false
}

module.exports = BaseApi;
