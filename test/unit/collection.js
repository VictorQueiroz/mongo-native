var Native = require('../../index')(global.db);

describe('collection', function () {
	var User = Native.collection('users', Native.Collection.extend());

	it('should insert a document', function (done) {
		User.insert([
			{ name: 'my name' },
			{ name: 'another name' },
			{ name: 'more name' }
		]).then(function (users) {
			assert.equal(users.length, 3);
			done()
		}, function (err) {
			done(err)
		})
	})

	it('should find a collection', function (done) {
		User.find().then(function (users) {
			assert.ok(users instanceof Array);
			done()
		})
	})

	it('should find a document', function (done) {
		var id;
		User.find().then(function (users) {
			assert.ok(users instanceof Array)
			id = users[0]._id;
			return User.findOne({ _id: id })
		}).then(function (user) {
			assert.ok(!(user instanceof Array));
			assert.equal(String(user._id), String(id))
			done()
		}, function (err) {
			console.log(err)
			done()
		});
	})

	it('should find and remove a document', function (done) {
		User.insertMany([{a:1}, {b:1, d:1}, {c:1}], {w:1}).then(function(result) {
	    // Simple findAndModify command returning the old document and
	    // removing it at the same time
	    return User.findAndRemove({b:1}, [['b', 1]]);
	  }).then(function(doc) {
      assert.equal(1, doc.value.b);
      assert.equal(1, doc.value.d);

      // Verify that the document is gone
      return User.findOne({b:1});
    }).then(function(item) {
      assert.equal(null, item);
      done()
    });
	})

	it('should update a collection', function (done) {
		User.insertOne({
			name: 'My new name',
			addresses: [{
				route: 'Address, 120'
			}]
		}).then(function (user) {
			assert.equal(user.name, 'My new name');
			assert.equal(user.addresses[0].route, 'Address, 120');

			return User.update({
				_id: user._id
			}, {
				$set: {
					name: 'Another name',
				},
				$push: {
					addresses: {
						route: 'Another route, 300'
					}
				}
			}).then(function (result) {
				assert.ok(result.ok);
				assert.equal(result.nModified, 1)
				assert.equal(result.n, 1)

				return User.findOne({
					_id: user._id
				});
			});
		}).then(function (user) {
			assert.equal(user.name, 'Another name');
			assert.equal(user.addresses[0].route, 'Address, 120');
			assert.equal(user.addresses[1].route, 'Another route, 300');
			done()
		}, function (err) {
			done(err);
		});
	})
})