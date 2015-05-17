describe('admin', function () {
	var adminDb;

	beforeEach(function () {
		adminDb = db.admin()
	})

	it('should add a user to the database', function (done) {
		// Add the new user to the admin database
	  adminDb.addUser('admin11', 'admin11').then(function(result) {
	    
	    // Authenticate using the newly added user
	    return adminDb.authenticate('admin11', 'admin11');                
	  }).then(function(result) {
      assert.ok(result);
      
      return adminDb.removeUser('admin11');
    }).then(function(result) {
      assert.ok(result);
      done();
    }, function (err) {
    	done(err);
    });
	})

	it('should retrieve this db\'s server status', function (done) {
		// Grab a collection object
	  var collection = db.collection('test');

	  // Force the creation of the collection by inserting a document
	  // Collections are not created until the first document is inserted
	  collection.insertOne({'a':1}, {w: 1}).then(function(doc) {

	    // Use the admin database for the operation
	    var adminDb = db.admin();

	    // Add the new user to the admin database
	    return adminDb.addUser('admin13', 'admin13');
	  }).then(function(result) {
      // Authenticate using the newly added user
      return adminDb.authenticate('admin13', 'admin13');
    }).then(function(result) {
       
      // Retrive the server Info
      return adminDb.serverStatus();
    }).then(function(info) {
      assert.ok(info != null);
     
      return adminDb.removeUser('admin13');
    }).then(function(result) {
      assert.ok(result);
      done()
    }, function (err) {
    	done(err)
    });
	})

	it('should validate an existing collection', function (done) {
		// Grab a collection object
	  var collection = db.collection('test');
	    
	  // Force the creation of the collection by inserting a document
	  // Collections are not created until the first document is inserted
	  collection.insertOne({'a':1}, {w: 1}).then(function(doc) {
	    
	    // Use the admin database for the operation
	    var adminDb = db.admin();
	      
	    // Add the new user to the admin database
	    return adminDb.addUser('admin8', 'admin8');
	  }).then(function(result) {
	      
      // Authenticate using the newly added user
      return adminDb.authenticate('admin8', 'admin8');                
    }).then(function(replies) {
      
      // Validate the 'test' collection
      return adminDb.validateCollection('test');
    }).then(function(doc) {
      // Pre 1.9.1 servers
      if(doc.result != null) {
        assert.ok(doc.result != null);
        assert.ok(doc.result.match(/firstExtent/) != null);                    
      } else {
        assert.ok(doc.firstExtent != null);
      }

      return adminDb.removeUser('admin8');
    }).then(function(result) {
      assert.ok(result);

      done();
    }, function (err) {
    	done(err)
    });
	})
})