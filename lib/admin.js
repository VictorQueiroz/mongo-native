var _ = require('lodash');
var Q = require('q');
var helpers = require('./helpers');

var Admin = helpers.createClass({
	initialize: function (admin) {
		this._admin = admin;
	}
});

_.extend(Admin.prototype, {
	addUser: function (username, password, options) {
		var _admin = this._admin;
		var resultCallback = this.resultCallback;

		if(_.isUndefined(options)) {
			options = {};
		}

		return Q.Promise(function (resolve, reject) {
			_admin.addUser(username, password, options, resultCallback(resolve, reject));
		});
	},
	removeUser: function (username, options) {
		var _admin = this._admin;
		var resultCallback = this.resultCallback;

		if(_.isUndefined(options)) {
			options = {};
		}

		return Q.Promise(function (resolve, reject) {
			_admin.removeUser(username, options, resultCallback(resolve, reject));
		});
	},
	authenticate: function (username, password) {
		var _admin = this._admin;
		var resultCallback = this.resultCallback;

		return Q.Promise(function (resolve, reject) {
			_admin.authenticate(username, password, resultCallback(resolve, reject));
		});
	},
	replSetGetStatus: function () {
		var self = this;
		var resultCallback = this.resultCallback;

		return Q.Promise(function (resolve, reject) {
			self._admin.replSetGetStatus(resultCallback(resolve, reject));
		});
	},
	validateCollection: function (collectionName, options) {
		var _admin = this._admin;
		var resultCallback = this.resultCallback;

		if(_.isUndefined(options)) {
			options = {};
		}

		return Q.Promise(function (resolve, reject) {
			_admin.validateCollection(collectionName, options, resultCallback(resolve, reject));
		});
	},
	serverInfo: function () {
		var _admin = this._admin;
		var resultCallback = this.resultCallback;

		return Q.Promise(function (resolve, reject) {
			_admin.serverInfo(resultCallback(resolve, reject));
		});
	},
	serverStatus: function () {
		var _admin = this._admin;
		var resultCallback = this.resultCallback;

		return Q.Promise(function (resolve, reject) {
			_admin.serverStatus(resultCallback(resolve, reject));
		});
	},
});

module.exports = Admin;