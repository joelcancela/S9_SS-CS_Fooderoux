const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const assert = require('assert');
const bodyParser = require('body-parser');

// http client
const request = require('request');
// UUID generator
const uuidv4 = require('uuid/v4');

const app = express()
// Connection URL
const url = 'mongodb://users:J1ovddMPAbI' + encodeURIComponent('=') + '@ds163054.mlab.com:63054/db-server-side-food';
// Database name
const dbName = 'db-server-side-food';
// Collection name
const collection_name = 'france';
const collection_recipes_name = 'recipes';
// MongoDB client
var collection, collection_recipes, db;
var port = process.env.PORT || 3000;

app.use(bodyParser.json());
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.listen(port, function () {
  console.log('Food server listening on port ' + port + '!')
  const client = new MongoClient(url);
  client.connect(function (err) {
    if (err != null) {
      console.warn("Failed to connect to MongoDB.");
    } else {
      db = client.db(dbName);
      collection = db.collection(collection_name);
      collection_recipes = db.collection(collection_recipes_name);
      console.log("Connected successfully to server");
    }
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
/* http://localhost:3000/api/foods?page=1&limit=2
*/
app.get('/api/foods', function (req, res, next) {
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
  let sortObject = { _id: 1 };
  if (req.query.sortBy != null && req.query.sortBy != "") {
    switch (req.query.sortBy) {
      case "name":
        sortObject = { product_name_fr: 1 };
        break;
      case "nutriscore":
        sortObject = { nutrition_grade_fr: 1 };
        break;
      case "price":
        collection.aggregate([
          { $addFields: { "currentPrice": { $arrayElemAt: ["$pricing", -1] } } },
          { $sort: { "currentPrice.price": -1 } },
          { $limit: pagesize },
          { $skip: pagesize * (n - 1) }
        ]).toArray(function (err, docs) {
          res.send(docs);
        });
        return;
      default:
        break;
    }
  }
  collection.find(searchObject).sort(sortObject).skip(pagesize * (n - 1)).limit(pagesize).toArray(function (err, docs) {
    assert.equal(err, null);
    res.send(docs);
  });
});

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
});

/**
 * Stores search engine with <country_code> filter (ISO)
 *
 * @author: Nikita ROUSSEAU
 *
 * Request: [GET] http://localhost:3000/api/stores/search?region=us
 * Response:
 * {
 *
 * }
 */
app.get('/api/stores/search', function (req, res) {
  let country_code;

  if (req.query.region == null || String(req.query.region).length !== 2) {
    res.status(400).send("Invalid country_code, must be coded on two letters.");
    return;
  }

  country_code = String(req.query.region);

  // TODO: implement search stores by region
});

/**
 * Given an :itemId, fetch a collection of <Pricing> objects
 *
 * @author: Nikita ROUSSEAU
 *
 * Request: [GET] http://localhost:3000/api/foods/0000000027205/pricing
 * Response:
 * {
 *    "item": {
 *      "_id": "0000000027205",
 *      "pricing": [(...)]
 *    }
 * }
 */
app.get('/api/foods/:itemId/pricing', function (req, res) {
  let itemId;

  if (req.params.itemId == null) {
    res.status(400).send("Invalid :itemId, :itemId must be an Integer.");
    return;
  }

  itemId = req.params.itemId;

  collection.find({ _id: itemId }).toArray(function (err, result_collection) {
    assert.equal(err, null);

    if (result_collection[0] === undefined) {
      res.status(404).send();
      return;
    }

    let item = result_collection[0];

    // Not found
    if (result_collection[0] === undefined) {
      res.status(404).send();
      return;
    }
    // No pricing yet
    if (item.pricing === undefined) {
      res.send(
        {
          "item": {
            "_id": itemId,
            "pricing": []
          }
        }
      );
      return;
    }
    // 200 OK
    res.send(
      {
        "item": {
          "_id": itemId,
          "pricing": item.pricing
        }
      }
    );
  });
});

/**
 * Add a new Pricing information attached to :itemId
 * A Pricing object has a "price", "date" and "store" attribute
 * An item has a collection Pricing
 *
 * @author: Nikita ROUSSEAU
 *
 * Request: [POST] http://localhost:3000/api/foods/0000000027205/pricing
 * Body as Application/JSON:
 * {
 *  "price": 11,
 *  "store": {
 *    "storeId": 42,
 *    "name": "TotoShop42",
 *    "location": {
 *      "type": "Point",
 *      "coordinates": [-73.856077, 40.848447]
 *    },
 *    "country_code": "us"
 *  }
 * }
 *
 * Response:
 * {
 *    "item": {
 *      "_id": "0000000027205",
 *      "pricing": [(...)]
 *    }
 * }
 */
app.post('/api/foods/:itemId/pricing', function (req, res) {
  let itemId = - 1;
  let price = -1;
  let store = {
    "storeId": -1,
    "name": "",
    "location": {
      "type": "Point",
      "coordinates": [-73.856077, 40.848447]
    },
    "country_code": "us"
  };
  let pricing_collection = [];

  // itemId
  if (req.params.itemId == null) {
    res.status(400).send("Missing item identifier.");
    return;
  }
  itemId = req.params.itemId;
  // price
  if (req.body.price == null) {
    res.status(400).send("Missing price.");
    return;
  }
  price = req.body.price;
  // store
  if (req.body["store"] == null) {
    res.status(400).send("Missing store object.");
    return;
  }
  store = req.body["store"];

  collection.find({ _id: itemId }).toArray(function (err, result_collection) {
    assert.equal(err, null);

    // Not found
    if (result_collection[0] === undefined) {
      res.status(404).send();
      return;
    }

    // Resolve pricing collection
    if (result_collection[0].pricing !== undefined && Array.isArray(result_collection[0].pricing)) {
      pricing_collection = result_collection[0].pricing;
    }

    // Update collection
    pricing_collection.push({
      "_uuid": uuidv4(),
      "price": price,
      "currency": "euro",
      "date": Date.now(),
      "store": store
    });
    collection.updateOne(
      { _id: itemId },
      {
        $set: { 'pricing': pricing_collection }
      }
    );

    // 201 Created
    res.status(201).send(
      {
        "item": {
          "_id": itemId,
          "pricing": pricing_collection
        }
      }
    );
  });
});

/**
 * Region reverse geocoding by long/lat
 * Valid longitude values are between -180 and 180, both inclusive.
 * Valid latitude values are between -90 and 90 (both inclusive).
 *
 * @author: Nikita ROUSSEAU
 *
 * Request: [GET] http://localhost:3000/api/regions/resolve?lon=-73.856077&lat=40.848447
 * Response:
 * {
 *   "island": "Hunter Island",
 *   "county": "Bronx County",
 *   "city": "NYC",
 *   "state": "New York",
 *   "postcode": "10805",
 *   "country": "USA",
 *   "country_code": "us"
 * }
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

app.post('/api/recipes/parse', function (req, res) {
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

app.get('/api/recipes', function (req, res) {
  let pagesize = 50;
  let n = 1;
  if (req.query.limit != null) {
    pagesize = parseInt(req.query.limit);
  }
  if (req.query.page != null && req.query.page > 0) {
    n = parseInt(req.query.page);
  }
  let sortObject = { _id: 1 };
  if (req.query.sortBy != null && req.query.sortBy != "") {
    switch (req.query.sortBy) {
      case "name":
        sortObject = { name: 1 };
        break;
      case 'date':
        sortObject = { date: 1 };
        break;
      default:
        break;
    }
  }
  collection_recipes.find({}).sort(sortObject).skip(pagesize * (n - 1)).limit(pagesize).toArray(function (err, docs) {
    assert.equal(err, null);
    res.send(docs);
  });
})

app.post('/api/recipes', function (req, res) {
  let data = req.body;
  try {
    let result = collection_recipes.insertOne({ name: data.name, ingredients: data.ingredients, date: Date.now(), comments: [] })
    res.status(200).send(result);
  } catch (e) {
    res.status(400).send(e);
  }
})

app.get('/api/recipes/:recipeId', function (req, res) {
  let id = req.params.recipeId;
  collection_recipes.find(ObjectId(id)).toArray(function (err, docs) {
    if (err != null) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.send(docs);
    }
  });
})

app.post('/api/recipes/:recipeId/comment', function (req, res) {
  let data = req.body.comment;
  let id = req.params.recipeId;
  collection_recipes.find(ObjectId(id)).toArray(function (err, docs) {
    if (err != null) {
      console.log(err);
      res.status(400).send(err);
    } else {
      collection_recipes.updateOne(
        { _id: ObjectId(id) },
        {
          $push: { "comments": data }
        }
      )
      res.status(200).send({});
    }
  });
})