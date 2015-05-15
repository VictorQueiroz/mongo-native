# mongo-native

Native MongoDB API with promises just to make you happy.

```js
var Native = require('mongo-native');

Native.connect('mongodb://localhost/native-db').then(function (db) {
	var users = db.collection('users');

	users.insertMany([{name: 'kris kowal'}, {name: 'tj'}, {name: 'douglas crockford'}]).then(function (docs) {
		assert.equal('kris kowal', docs[0].name);
	});
});
```