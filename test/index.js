/**
 * Tests to make sure all api calls are available
 */

var assert = require('assert');

describe('MediaMath', function() {
    var MediaMath = require('../index');

    describe('#ReportsBeta', function() {
        it('should exist', function() {
            assert.strictEqual(true, !!MediaMath.ReportsBeta, 'ReportsBeta exists');
        });
    });
});
