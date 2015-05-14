var _ = require('lodash');
var Q = require('q');
var Db = require('./db');
var util = require('util');
var events = require('events');
var Collection = require('./collection');

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

function Native (arg) {
	if(this === global) {
		return new Native(arg);
	}
	if(_.isFunction (this.initialize)) {
		this.initialize.apply(this, arguments);
	}
}

util.inherits(Native, events);

_.extend(Native.prototype, {
	initialize: function (arg) {
		this.db = new Db();
		this.db.native = this;

		this.once('connection', this.onConnection);

		if(arg instanceof mongodb.Db) {
			this.emit('connection', arg);
		}
	},
	onConnection: function (db) {
		if(!(this.db.getDb() instanceof mongodb.Db)) {
			this.db.setDb(db);
		}
	},
	collection: function (collectionName) {
		var CollectionClass = Collection.extend({
			collection: this.db._collection(collectionName)
		});

		var collection = new CollectionClass();

		return collection;
	},
	connect: function (uri) {
		var self = this;
		var deferred = Q.defer();

		MongoClient.connect(uri, function (err, db) {
			if(err) {
				self.emit('error', err);

				return deferred.reject(err);
			}

			self.emit('connection', db);
			deferred.resolve(self.db);
		});

		return deferred.promise;
	}
});

Native.Db = Db;
Native.Collection = Collection;

module.exports = Native;