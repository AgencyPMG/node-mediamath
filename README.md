[![Build Status](https://travis-ci.org/AgencyPMG/node-mediamath.svg)](https://travis-ci.org/AgencyPMG/node-mediamath)

# node-mediamath
Node SDK for Media Math's Reporting Api.

## Install

```
npm install node-mediamath
```

## How to use
NOTE: Even though this library will work with browserify or any client-side Javascript,
it is not recommended due to the Media Math's login system which depends on cookies
and lack of csrf protection opens up the API to XSS attacks.

NOTE: This is an unfinished Api, currently only the
reporting beta endpoint is supported. Contributions welcome!

## Advanced Setup
You can switch the defaults of the app by using the ```Base.Defaults```

```js
var mediamath = require('node-mediamath');
mediamath.Base.defaultOptions.baseUrl = 'https://t1sandbox.mediamath.com/api/';
```

All the Options:

```json
{
    "baseUrl": "https://api.mediamath.com/api/v1",
    "apiToken": "1234451231234",
    "debug": false
}
```

## Example Usage

```js
var MediaMath = require('node-mediamath');

//auth by username/password
var auth = new MediaMath.Auth('example@example.com', 'pw_goes_here');

//auth by cookie token
var auth = new MediaMath.Auth('124981290i1294081029');

var reports = new MediaMath.ReportsBeta({
    debug: true
});

reports.getListOfReports({auth: auth}, function(error, data) {
    console.log(error, data);
})

reports.getMetadataForReport(
    'https://api.mediamath.com/reporting/v1/std/geo',
    {auth: auth},
    function(error, data) {
        console.log(error, data);
});
```

## Testing
To test, some environment variables must be set
```
MEDIAMATH_API_TOKEN=123412341234
MEDIAMATH_API_USERNAME=example@example.com
MEDIAMATH_API_PASSWORD=password
```
then run ```npm test```
