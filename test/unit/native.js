var Native = require('../../index');

describe('native', function () {
	it('should return a native.Db instance when connected', function (done) {
		Native.connect('mongodb://localhost/mydbtest').then(function (db) {
			assert.ok(db instanceof Native.Db);
			done();
		}, function (err) {
			done(err)
		})
	})
})