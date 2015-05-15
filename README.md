# mongo-native

Native MongoDB API with promises just to make you happy.

### Installation (npm)
```
npm install --save mongo-native
```

### Examples
```js
var Native = require('mongo-native');

Native.connect('mongodb://localhost/native-db').then(function (db) {
	var users = db.collection('users');

	users.insertMany([{name: 'kris kowal'}, {name: 'tj'}, {name: 'douglas crockford'}]).then(function (docs) {
		assert.equal('kris kowal', docs[0].name);
	});
});
```

```js
db.collection('users', function (err, users) {
	if(err) {
		throw err;
	}

	users.insertOne({name: 'addy osmani'}).then(function (user) {
		assert.equal('addy osmani', user.name);
	});
});
```

```js
var Db = require('mongo-native').Db;
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

MongoClient.connect('mongodb://localhost/mydb', function (err, db) {
	if(err) {
		throw err;
	}

	global.db = new Db(db);
});

app.listen(3000, function () {
	console.log('Everything is cool now');
});
```

```js
var Native = require('mongo-native');
Native.connect('mongodb://localhost/mydb').then(function (db) {
	var users = db.collection('users');
	return users.find();
}).then(function (users) {
	assert.equal(300000, users.length);
});
```