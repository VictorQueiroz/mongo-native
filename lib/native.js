var _ = require('lodash');
var Q = require('q');

var Db = require('./db');
var Collection = require('./collection');
var Admin = require('./admin');

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

function Native () {}

Native.Db = Db;
Native.Collection = Collection;
Native.Admin = Admin;
Native.connect = function (url, options) {
	var deferred = Q.defer();
	MongoClient.connect(url, options, function (err, db) {
		if(err) {
			return deferred.reject(err);
		}
		deferred.resolve(new Db(db));
	});
	return deferred.promise;
};

module.exports = Native;