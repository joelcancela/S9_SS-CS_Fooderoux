const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const bodyParser = require('body-parser');
const app = express()
// Connection URL
const url = 'mongodb://users:J1ovddMPAbI' + encodeURIComponent('=') + '@ds163054.mlab.com:63054/db-server-side-food';
// Database name
const dbName = 'db-server-side-food';
// Collection name
const collection_name = 'france';
// MongoDB client
var collection, db;

app.use(bodyParser.json());
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.listen(3000, function () {
  console.log('Food server listening on port 3000!')
  const client = new MongoClient(url);
  client.connect(function (err) {
    if (err != null) {
      console.warn("Failed to connect to MongoDB.");
    } else {
      console.log("Connected successfully to server");
      db = client.db(dbName);
      collection = db.collection(collection_name);
    }
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
  let regArray = { $exists: true, $ne: [] };
  if (req.query.nutrition_score != null) {
    criterias.push({ $or: [{ nutrition_grade_fr: reg, nutrition_grades: reg }] });
  } if (req.query.ingredients != null) {
    criterias.push({ $or: [{ ingredients_text_fr: reg, ingredients_text: reg, ingredients_tags: regArray, ingredients: regArray }] });
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
/* http://localhost:3000/api/foods/00000
*/
app.get('/api/foods/:itemId', function (req, res) {
  if (req.params.itemId != null) {
    collection.find({ _id: req.params.itemId }).toArray(function (err, docs) {
      assert.equal(err, null);
      res.send(docs);
    });
  } else {
    res.send([]);
  }
})

/*
/* http://localhost:3000/api/foods/:itemId/score
*/
app.get('/api/foods/:itemId/score', function (req, res) {
  if (req.params.itemId != null) {
    collection.find({ _id: req.params.itemId }).toArray(function (err, docs) {
      assert.equal(err, null);
      if (docs[0] != undefined) {
        let scoreObj = docs[0];
        let nutrition_grade = scoreObj["nutrition_grade_fr"] || "c";
        let nb_unknown_ingredients = scoreObj["unknown_ingredients_n"] || 0;
        let nb_ingredients_palm_oil_not_sure = scoreObj["ingredients_from_or_that_may_be_from_palm_oil_n"] || 0;
        let nb_ing_palm_oil_sure = scoreObj["ingredients_from_palm_oil_n"] || 0;
        let allergens_n = scoreObj["allergens_tags"] != undefined ? scoreObj["allergens_tags"].length : 0;
        switch (nutrition_grade) {
          case "a":
            nutrition_grade = 20;
            break;
          case "b":
            nutrition_grade = 15;
            break;
          case "c":
            nutrition_grade = 10;
            break;
          case "d":
            nutrition_grade = 5;
            break;
          case "e":
            nutrition_grade = 0;
            break;
          default:
            nutrition_grade = 10;
            break;
        }
        let score = (nutrition_grade +
          (15 - nb_unknown_ingredients) +
          (15 - nb_ingredients_palm_oil_not_sure) +
          (15 - nb_ing_palm_oil_sure) +
          (10 - allergens_n)) / 5;
        let score_letter = "d";
        if (score >= 0 && score < 5) {
          score_letter = "e";
        } else if (score >= 5 && score < 10) {
          score_letter = "d";
        } else if (score >= 10 && score < 13) {
          score_letter = "c";
        } else if (score >= 13 && score < 17) {
          score_letter = "b";
        } else if (score >= 17) {
          score_letter = "a";
        }
        res.send({ "score": score_letter });
      } else {
        res.status(404).send('Item id is incorrect !');
      }
    });
  } else {
    res.send({ score: "c" });
  }
})

/*
/* http://localhost:3000/api/foods/:itemid/imageLink
*/
app.get('/api/foods/:itemId/imageLink', function (req, res) {
  if (req.params.itemId != null) {
    collection.find({ _id: req.params.itemId }).toArray(function (err, docs) {
      assert.equal(err, null);
      if (docs[0] != undefined) {
        let item = docs[0];
        let url = "https://static.openfoodfacts.org/images/products/";
        if (item.images.front_fr != undefined) {
          if (item._id.length == 9) {
            let str = item._id;
            url += str.substring(0, 3) + "/" + str.substring(3, 6) + "/" + str.substring(6) + "/front_fr.";
          } else if (item._id.length == 13) {
            let str = item._id;
            url += str.substring(0, 3) + "/" + str.substring(3, 6) + "/" + str.substring(6, 9) + "/" + str.substring(9) + "/front_fr.";
          } else {
            url += item._id + "/front_fr.";
          }
          if (item.images.front_fr.rev != undefined) {
            url += item.images.front_fr.rev + ".";
          }
          if (item.images.front_fr.sizes != undefined) {
            url += "full.jpg";
          }
          res.send({ link: url });
        } else {
          res.status(404).send('Could not find image link');
        }

      } else {
        res.status(404).send('Item id is incorrect');
      }
    });
  } else {
    res.status(400).send([]);
  }
})

app.post('/api/recipe/parse', function (req, res) {
  let result = {}; // JSON answer
  let data = req.body;
  let keys = Object.keys(data);
  let filterObj = {};
  if (keys.includes("filter")) {
    let regFilterObj = { $not: { $elemMatch: { $regex: ".*" + data["filter"] + ".*", $options: 'i' } } }
    filterObj = { additives_tags: regFilterObj, additives_original_tags: regFilterObj }
  }
  keys.forEach(function (key) {
    if (key != "filter") {
      let reg = new RegExp(".*" + data[key] + ".*", "i");
      collection.find(
        {
          $and: [
            { $or: [{ product_name: reg }, { product_name_fr: reg }] },
            { $or: [filterObj] }]
        }
      ).toArray(function (err, docs) {
        if (err != null) {
          console.log(err);
        }
        result[key] = docs;
        if (keys.indexOf(key) == keys.length - 1 || (keys.includes("filter") && keys.indexOf(key) == keys.length - 2)) {
          res.send(result);
        }
      });
    }
  })
})