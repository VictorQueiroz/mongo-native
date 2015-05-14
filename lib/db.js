var _ = require('lodash');
var Q = require('q');
var mongodb = require('mongodb');
var helpers = require('./helpers');

var Db = helpers.createClass({
	initialize: function (db) {
		if(db instanceof mongodb.Db) {
			this.setDb(db);
		} else {
			this._db = undefined;
		}
	},
	onConnection: function () {},

	setDb: function (db) {
		if(!(db instanceof mongodb.Db)) {
			throw new Error('db argument must be a mongodb.Db instance');
		}

		this._db = db;
	},

	getDb: function () {
		return this._db;
	},

	_collection: function (collectionName) {
		return this._db.collection(collectionName);
	},

	collection: function (collectionName) {
		return this.native.collection(collectionName);
	}
});

_.extend(Db.prototype, {
	addUser: function (username, password, options) {
		var deferred = Q.defer();
		this._db.addUser(username, password, options, function (err, result) {
			if(err) {
				return deferred.reject(err);
			}
			deferred.resolve(result);
		});
		return deferred.promise;
	},

	removeUser: function (username, options) {
		var deferred = Q.defer();
		this._db.removeUser(username, options, function (err, result) {
			if(err) {
				return deferred.reject(err);
			}
			deferred.resolve(result);
		});
		return deferred.promise;
	},

	createCollection: function (name, options) {
		var self = this;
		var deferred = Q.defer();
		this._db.createCollection(name, options, function (err, collection) {
			if(err) {
				return deferred.reject(err);
			}

			deferred.resolve(self.native.collection(collection));
		});
		return deferred.promise;
	},

	createIndex: function (name, fieldOrSpec, options) {
		var deferred = Q.defer();
		this._db.createIndex(name, fieldOrSpec, options, function (err, indexName) {
			if(err) {
				return deferred.reject(err);
			}
			deferred.resolve(indexName);
		});
		return deferred.promise;
	},

	dropCollection: function (name) {
		var deferred = Q.defer();
		this._db.dropCollection(name, function (err, result) {
			if(err) {
				return deferred.reject(err);
			}
			deferred.resolve(result);
		});
		return deferred.promise;
	},

	command: function (command, options) {
		var deferred = Q.defer();
		
		if(_.isUndefined(options)) {
			options = {};
		}

		this._db.command(command, function (err, result) {
			if(err) {
				return deferred.reject(err);
			}

			deferred.resolve(result);
		});
		return deferred.promise;
	},

	listCollections: function (filter, options) {
		var deferred = Q.defer();
		this._db.listCollections(filter, options).toArray(function (err, items) {
			if(err) {
				return deferred.reject(err);
			}
			deferred.resolve(items);
		});
		return deferred.promise;
	},

	db: function (dbName) {
		var db = new Db(this._db.db(dbName));
		db.native = this.native;
		return db;
	}
});

module.exports = Db;