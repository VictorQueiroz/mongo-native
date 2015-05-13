var _ = require('lodash');
var Q = require('q');
var mongodb = require('mongodb');
var Collection = require('./lib/collection');

function Native (db) {
	if(this === global) {
		return new Native(db);
	}

	if(!(db instanceof mongodb.Db)) {
		throw new Error('db param must be a mongodb.Db instance');
	}

	this.Collection = Collection.extend({
		db: db
	});

	// Define collection
	this.collection = function (collectionName, CollectionClass) {
		if(_.isObject(CollectionClass) && !(CollectionClass instanceof Collection)) {
			CollectionClass = Collection.extend(Collection);
		}

		CollectionClass = CollectionClass.extend({
			collection: db.collection(collectionName)
		});

		return new CollectionClass();
	};

	this.db = db;
}

module.exports = Native;