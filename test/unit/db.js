var Native = require('../../index')(global.db);

describe('db', function () {
	it('should add a user to the database', function (done) {
		Native.db.addUser('user', 'name').then(function () {
	  	return Native.db.removeUser('user');
	  }).then(function(result) {
	  	assert.ok(result)
	  	done()
	  }, function (err) {
	  	done(err)
	  });
	})

	it('should creates a collection on a server pre-allocating space, need to create f.ex capped collections', function (done) {
		Native.db.createCollection("a_simple_collection", {
			capped:true,
			size:10000,
			max:1000,
			w:1
		}).then(function(collection) {
	    // Insert a document in the capped collection
	    return collection.insertOne({a:1}, {w:1});
	  }).then(function(result) {
    	assert.ok(result.a)
    	done()
    }, function (err) {
    	done(err)
    });
	})

	it('should drop a collection from the database, removing it permanently', function (done) {
		Native.db.command({ping:1}).then(function(result) {
	    // Create a capped collection with a maximum of 1000 documents
	    return Native.db.createCollection("a_simple_create_drop_collection", {capped:true, size:10000, max:1000, w:1});
	  }).then(function(collection) {
      // Insert a document in the capped collection
      return collection.insertOne({a:1}, {w:1});
    }).then(function(result) {
      // Drop the collection from this world
      return Native.db.dropCollection("a_simple_create_drop_collection");
    }).then(function(result) {
      // Verify that the collection is gone
      return Native.db.listCollections({name:"a_simple_create_drop_collection"});
    }).then(function(names) {
      assert.equal(0, names.length);
      done()
    }, function (err) {
    	done(err);
    });
	})

	it('should get the list of all collection information for the specified db', function (done) {
		// Get an empty db
	  var db1 = Native.db.db('listCollectionTestDb');
	  // Create a collection
	  var collection = db1.collection('shouldCorrectlyRetrievelistCollections');
	  // Ensure the collection was created
	  collection.insertOne({a:1}).then(function(r) {
	    // Return the information of a single collection name
	    return db1.listCollections({name: "shouldCorrectlyRetrievelistCollections"});
	  }).then(function(items) {
      assert.equal(1, items.length);

      // Return the information of a all collections, using the callback format
      return db1.listCollections();
    }).then(function(items) {
      assert.equal(2, items.length);

      done()
    }, function (err) {
    	done(err)
    });
	})
})