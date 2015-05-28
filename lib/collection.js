var Q = require('q');
var _ = require('lodash');
var util = require('util');
var events = require('events');
var helpers = require('./helpers');
var mongodb = require('mongodb');
var CollectionInterface = require('./collection-interface');

var Collection = CollectionInterface.extend({
	initialize: function (collection) {
		if(collection instanceof mongodb.Collection) {
			this._collection = collection;
		} else {
			throw new Error('collection must be a mongodb.Collection instance');
		}

		_.forEach(['collectionName'], function (key) {
			Object.defineProperty(this, key, {
				get: function () {
					return this._collection[key];
				}
			});
		}, this);
	},

	aggregate: function (pipeline, options) {
		var self = this;
		var _collection = this._collection;

		if(_.isUndefined(options)) {
			options = {};
		}

		if(_.isObject(options.cursor)) {
			return _collection.aggregate(pipeline, options);
		}

		return Q.Promise(function (resolve, reject) {
			var args = [pipeline, options];
			var resultCallback = self.resultCallback(resolve, reject);

			_collection.aggregate(pipeline, options, resultCallback);
		});
	},

	update: function (selector, document, options) {
		var deferred = Q.defer();

		this._collection.update(selector, document, options, function (err, result) {
			if(err) {
				return deferred.reject(err);
			}

			deferred.resolve(result.result);
		});

		return deferred.promise;
	},

	drop: function () {
		var deferred = Q.defer();

		this._collection.drop(this.resultCallback(deferred.resolve, deferred.reject));

		return deferred.promise;
	},

	dropAllIndexes: function () {
		var deferred = Q.defer();
		this._collection.dropAllIndexes(this.resultCallback(deferred.resolve, deferred.reject));
		return deferred.promise;
	},

	dropIndex: function (indexName, options) {
		var deferred = Q.defer();
		this._collection.dropIndex(indexName, options, this.resultCallback(deferred.resolve, deferred.reject));
		return deferred.promise;
	},

	dropIndexes: function () {
		var deferred = Q.defer();
		this._collection.dropIndexes(this.resultCallback(deferred.resolve, deferred.reject));
		return deferred.promise;
	},

	ensureIndex: function (fieldOrSpec, options) {
		var deferred = Q.defer();
		this._collection.ensureIndex(fieldOrSpec, options, this.resultCallback(deferred.resolve, deferred.reject));
		return deferred.promise;
	},

	findAndModify: function (query, sort, doc, options) {
		var deferred = Q.defer();
		this._collection.findAndModify(query, sort, doc, options, this.resultCallback(deferred.resolve, deferred.reject));
		return deferred.promise;
	},

	indexInformation: function (options) {
		var deferred = Q.defer();
		this._collection.indexInformation(options, this.resultCallback(deferred.resolve, deferred.reject));
		return deferred.promise;
	},

	find: function (query) {
		var deferred = Q.defer();

		this._collection.find(query).toArray(this.resultCallback(deferred.resolve, deferred.reject));

		return deferred.promise;
	},

	findOne: function (query, options) {
		var deferred = Q.defer();
		var ops;

		if(_.isUndefined(options)) {
			options = {};
		}

		this._collection.findOne(query, options, this.resultCallback(deferred.resolve, deferred.reject));

		return deferred.promise;
	},

	findAndRemove: function (query, sort, options) {
		var deferred = Q.defer();

		this._collection.findAndRemove(query, sort, options, this.resultCallback(deferred.resolve, deferred.reject));

		return deferred.promise;
	},

	insertMany: function (docs, options) {
		var deferred = Q.defer();
		this._collection.insertMany(docs, options, function (err, results) {
			if(err) {
				return deferred.reject(err);
			}
			deferred.resolve(results.ops);
		});
		return deferred.promise;
	},

	isCapped: function () {
		var deferred = Q.defer();
		this._collection.isCapped(this.resultCallback(deferred.resolve, deferred.reject));
		return deferred.promise;
	},
	deleteMany: function (filter, options) {
		var deferred = Q.defer();
		this._collection.deleteMany(filter, options, this.resultCallback(deferred.resolve, deferred.reject));
		return deferred.promise;
	},
	deleteOne: function (filter, options) {
		var deferred = Q.defer();
		this._collection.deleteOne(filter, options, this.resultCallback(deferred.resolve, deferred.reject));
		return deferred.promise;
	}
});

_.forEach(['insert', 'insertOne'], function (key) {
	Collection.prototype[key] = function (doc, options) {
		var deferred = Q.defer();
		var ops;

		this._collection[key](doc, options, function (err, result) {
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