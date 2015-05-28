var _ = require('lodash');
var Q = require('q');

var helpers = require('./helpers');
var Db = require('./db');
var Collection = require('./collection');
var Admin = require('./admin');

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var MongoNative = helpers.createClass({}, {
	Db: Db,
	Collection: Collection,
	Admin: Admin,
	connect: function (url, options) {
		return Q.Promise(function (resolve, reject) {
			MongoClient.connect(url, options, function (err, db) {
				if(err) {
					return reject(err);
				}
				resolve(new Db(db));
			});
		});
	}
});

module.exports = MongoNative;