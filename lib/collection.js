var Q = require('q');
var _ = require('lodash');
var util = require('util');
var events = require('events');
var helpers = require('./helpers');
var CollectionInterface = require('./collection-interface');

var Collection = CollectionInterface.extend({
	update: function (selector, document, options) {
		var deferred = Q.defer();

		this.collection.update(selector, document, options, function (err, result) {
			if(err) {
				return deferred.reject(err);
			}

			deferred.resolve(result.result);
		});

		return deferred.promise;
	},
	drop: function () {
		var deferred = Q.defer();

		this.collection.drop(function (err, reply) {
			if(err) {
				return deferred.reject(err);
			}

			deferred.resolve(reply);
		});

		return deferred.promise;
	},
	dropAllIndexes: function () {
		var deferred = Q.defer();
		this.collection.dropAllIndexes(function (err, reply) {
			if(err) {
				return deferred.reject(err);
			}

			deferred.resolve(reply);
		});
		return deferred.promise;
	},
	dropIndex: function (indexName, options) {
		var deferred = Q.defer();
		this.collection.dropIndex(indexName, options, function (err, result) {
			if(err) {
				return deferred.reject(err);
			}

			deferred.resolve(result);
		});
		return deferred.promise;
	},
	dropIndexes: function () {
		var deferred = Q.defer();
		this.collection.dropIndexes(function (err, result) {
			if(err) {
				return deferred.reject(err);
			}

			deferred.resolve(result);
		});
		return deferred.promise;
	},
	ensureIndex: function (fieldOrSpec, options) {
		var deferred = Q.defer();
		this.collection.ensureIndex(fieldOrSpec, options, function (err, indexName) {
			if(err) {
				return deferred.reject(err);
			}

			deferred.resolve(indexName);
		});
		return deferred.promise;
	},
	findAndModify: function (query, sort, doc, options) {
		var deferred = Q.defer();
		this.collection.findAndModify(query, sort, doc, options, function (err, doc) {
			if(err) {
				return deferred.reject(err);
			}
			deferred.resolve();
		});
		return deferred.promise;
	},
	indexInformation: function (options) {
		var deferred = Q.defer();
		this.collection.indexInformation(options, function (err, indexInformation) {
			if(err) {
				return deferred.reject(err);
			}

			deferred.resolve(indexInformation);
		});
		return deferred.promise;
	},
	find: function (query) {
		var deferred = Q.defer();

		this.collection.find(query).toArray(function (err, items) {
			if(err) {
				return deferred.reject(err);
			}
			deferred.resolve(items);
		});

		return deferred.promise;
	},
	findOne: function (query, options) {
		var deferred = Q.defer();
		var ops;

		if(_.isUndefined(options)) {
			options = {};
		}

		this.collection.findOne(query, options, function (err, result) {
			if(err) {
				return deferred.reject(err);
			}

			deferred.resolve(result);
		});

		return deferred.promise;
	},
	findAndRemove: function (query, sort, options) {
		var deferred = Q.defer();

		this.collection.findAndRemove(query, sort, options, function (err, doc) {
			if(err) {
				return deferred.reject(err);
			}

			deferred.resolve(doc);
		});

		return deferred.promise;
	},
	insertMany: function (docs, options) {
		var deferred = Q.defer();
		this.collection.insertMany(docs, options, function (err, results) {
			if(err) {
				return deferred.reject(err);
			}
			deferred.resolve(results);
		});
		return deferred.promise;
	},
	isCapped: function () {
		
	}
});

_.forEach(['insert', 'insertOne'], function (key) {
	Collection.prototype[key] = function (doc, options) {
		var deferred = Q.defer();
		var ops;

		this.collection[key](doc, options, function (err, result) {
			if(err) {
				return deferred.reject(err);
			}

			if(result.insertedCount === 1) {
				ops = result.ops[0];
			} else {
				ops = result.ops;
			}

			deferred.resolve(ops);
		});

		return deferred.promise;
	};
});

module.exports = Collection;