var _ = require('lodash');
var Q = require('q');
var Db = require('./db');
var util = require('util');
var events = require('events');
var Collection = require('./collection');

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

function Native () {}

Native.Db = Db;
Native.Collection = Collection;
Native.connect = function (uri) {
	var deferred = Q.defer();
	MongoClient.connect(uri, function (err, db) {
		if(err) {
			return deferred.reject(err);
		}
		deferred.resolve(new Db(db));
	});
	return deferred.promise;
};

module.exports = Native;