var MongoNative = require('../../index');
var Db = MongoNative.Db;
var Native = new MongoNative();

describe('native', function () {
	it('should return a native.Db instance when connected', function (done) {
		Native.connect('mongodb://localhost/mydbtest').then(function (db) {
			assert.ok(db instanceof MongoNative.Db);
			return db.createCollection('my_first_collection').then(function (collection) {
				console.log(collection)
				// return collection.insertMany([{a: 1}, {b: 2}, {a: 3}]);
			}).then(function (docs) {
				assert.equal(3, docs.length)
				done()
			});
		}, function (err) {
			done(err)
		})
	})
})