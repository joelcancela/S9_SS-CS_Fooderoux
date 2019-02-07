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

// http client
const request = require('request');

app.listen(3000, function () {
  console.log('Food server listening on port 3000!')
  const client = new MongoClient(url);
  client.connect(function (err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    db = client.db(dbName);
    collection = db.collection(collection_name);
  });
});

/*
/* http://localhost:3000/
*/
app.get('/', function (req, res) {
  res.send("Server online");
});
/*
/ * http://localhost:3000/api/stats
*/
app.get('/api/stats', function (req, res) {
  collection.stats(function (err, stats) {
    res.send({ items: stats.count });
  });
});
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
});

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
});

/**
 * Region reverse geocoding by long/lat
 * Valid longitude values are between -180 and 180, both inclusive.
 * Valid latitude values are between -90 and 90 (both inclusive).
 *
 * Example: http://localhost:3000/api/regions/resolve?lon=-73.856077&lat=40.848447
 */
app.get('/api/regions/resolve', function (req, res) {

  let lon;
  let lat;
  if (req.query.lon != null) {
    lon = parseFloat(req.query.lon);
    if (lon < -180.0 || lon > 180.0) {
      res.status(400).send("Valid longitude values are between -180 and 180, both inclusive.");
      return;
    }
  }
  if (req.query.lat != null) {
    lat = parseFloat(req.query.lat);
    if (lat < -90.0 || lat > 90.0) {
      res.status(400).send("Valid latitude values are between -90 and 90 (both inclusive).");
      return;
    }
  }

  request.get(
      {
        url: "https://nominatim.openstreetmap.org/reverse",
        headers: {
          'User-Agent': 'NPM/Request S9_WEBSRV',
          'Referer': 'about:blank'
        },
        qs: {
          "format": "json",
          "lon": String(lon),
          "lat": String(lat),
          "zoom": "10",
          "addressdetails": "1"
        },
        json: true
      },
      (e, r, body) => {
    if (e) {
      console.log(e);
      res.status(400).send(e);
      return;
    }
    res.send(body.address);
  });
});
