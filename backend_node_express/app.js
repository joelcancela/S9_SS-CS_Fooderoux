const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const app = express()
// Connection URL
const url = 'mongodb://users:J1ovddMPAbI' + encodeURIComponent('=') + '@ds163054.mlab.com:63054/db-server-side-food';
// Database name
const dbName = 'db-server-side-food';
// Collection name
const collection_name = 'france';
// MongoDB client
var collection, db;

app.listen(3000, function () {
  console.log('Food server listening on port 3000!')
  const client = new MongoClient(url);
  client.connect(function (err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    db = client.db(dbName);
    collection = db.collection(collection_name);
  });
})

/*
/* http://localhost:3000/
*/
app.get('/', function (req, res) {
  res.send("Server online");
})
/*
/ * http://localhost:3000/api/stats
*/
app.get('/api/stats', function (req, res) {
  collection.stats(function (err, stats) {
    res.send({ items: stats.count });
  });
})
/*
/* http://localhost:3000/api/food?page=1&limit=2
*/
app.get('/api/foods', function (req, res) {
  let pagesize = 50;
  let n = 1;
  if (req.query.limit != null) {
    pagesize = parseInt(req.query.limit);
  }
  if (req.query.page != null && req.query.page > 0) {
    n = parseInt(req.query.page);
  }
  let searchObject = {};
  if (req.query.name != null) {
    var reg = new RegExp(".*" + req.query.name + ".*", "i");
    searchObject = { "product_name": reg }
  }
  collection.find(searchObject).skip(pagesize * (n - 1)).limit(pagesize).toArray(function (err, docs) {
    assert.equal(err, null);
    res.send(docs);
  });
})

/*
/* http://localhost:3000/api/food/00000
*/
app.get('/api/foods/:itemId', function (req, res) {
  if (req.params.itemId != null) {
    collection.find({ _id: req.params.itemId }).toArray(function (err, docs) {
      assert.equal(err, null);
      res.send(docs);
    });
  } else {
    res.send({});
  }
})