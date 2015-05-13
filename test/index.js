var _ = require('lodash');
var path = require('path');
var glob = require('glob');
var Mocha = require('mocha');

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var testFiles = glob.sync(path.join(__dirname, '**/*.js'));

var mocha = new Mocha({
	reporter: 'spec',
	ui: 'bdd',
	watch: true
});

_.forEach(testFiles, function (filePath) {
	mocha.addFile(filePath);
});

MongoClient.connect('mongodb://localhost/testdb', function (err, db) {
	if(err) {
		return console.log(err);
	}

	global.db = db;
	global.assert = require('assert');
	global.ObjectId = require('bson').ObjectId;

	mocha.run(function (failures) {
		process.on('exit', function () {
			process.exit(failures);
		});
	});
});