const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// Connection URL
const url = 'mongodb://users:J1ovddMPAbI' + encodeURIComponent('=') + '@ds163054.mlab.com:63054/db-server-side-food';
// Database Name
const dbName = 'db-server-side-food';

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
  const client = new MongoClient(url);
  // Use connect method to connect to the server
  client.connect(function (err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    findDocuments(db, function () {
      client.close();
    });
  });
})

const findDocuments = function (db, callback) {
  // Get the documents collection
  const collection = db.collection('vietnam'); // current collection (small one)
  // Find some documents
  collection.find({}).toArray(function (err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}