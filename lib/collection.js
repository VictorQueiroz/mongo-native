var Q = require('q');
var _ = require('lodash');
var util = require('util');
var events = require('events');
var helpers = require('./helpers');

var Collection = helpers.createClass({
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