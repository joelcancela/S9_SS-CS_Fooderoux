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
  let criterias = [];
  if (req.query.name != null) {
    let reg = new RegExp(".*" + req.query.name + ".*", "i");
    criterias.push({ $or: [{ product_name: reg }, { product_name_fr: reg }] });
  }
  if (req.query.quantity != null) {
    let reg = new RegExp(".*" + req.query.quantity + ".*", "i");
    criterias.push({ $or: [{ serving_size: reg }, { quantity: reg }] });
  } if (req.query.store != null) {
    let reg = new RegExp(".*" + req.query.store + ".*", "i");
    criterias.push({ stores: reg });
  }
  let reg = new RegExp("[^\s]*", "i");
  if (req.query.nutrition_score != null) {
    criterias.push({ $or: [{ nutrition_grade_fr: reg, nutrition_grades: reg }] });
  } if (req.query.ingredients != null) {
    criterias.push({ $or: [{ ingredients_text_fr: reg, ingredients_text: reg, ingredients_tags: reg, ingredients: reg }] });
  } if (req.query.additives != null) {
    criterias.push({ $or: [{ additives: reg, additives_original_tags: reg }] });
  } if (req.query.nutriments != null) {
    criterias.push({ nutriments: reg });
  } if (req.query.allergens != null) {
    criterias.push({ $or: [{ allergens_tags: reg, allergens: reg, allergens_from_ingredients: reg, traces: reg }] });
  } if (req.query.vitamins != null) {
    criterias.push({ vitamins_tags: reg });
  }
  let searchObject = {};
  if (criterias.length > 0) {
    if (criterias.length == 1) {
      searchObject = criterias[0];
    } else {
      searchObject["$and"] = criterias;
    }
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