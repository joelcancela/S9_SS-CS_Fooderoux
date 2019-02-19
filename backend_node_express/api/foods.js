/**************************** Food API (/foods) ****************************/
const util = require('./utils');
const foodDb = require('../mongodb/mongo').getFoodDb; // Connection to food collection
const uuidv4 = require('uuid/v4'); // UUID generator
const hash = require('object-hash');
const assert = require('assert'); // Assertions
const Food = require('../model/food');

/**
 * @category   Fooderoux
 * @apiGroup   Food
 * @author     Joël Cancela Vaz <joel.cancelavaz@gmail.com>
 * @version    Release: @1.0.0@
 *
 * @api {get} /api/stats Get food items count in database
 * @apiName getFoodCount
 * @apiVersion 1.0.0
 * @apiSuccess {JSON} result A JSON containing the number of food item in database
 * @apiSuccessExample {json} On success
 * { items: 28522 }
 */
function getFoodCount(req, res) {
    foodDb().stats(function (err, stats) {
        res.send({ items: stats.count });
    });
}

/**
 * @category   Fooderoux
 * @apiGroup   Food
 * @author     Joël Cancela Vaz <joel.cancelavaz@gmail.com>
 * @version    Release: @1.0.0@
 *
 * @api {get} /api/foods Get specific food items according to criterias
 * @apiName getFoods
 * @apiVersion 1.0.0
 * @apiParam {Number} [limit] Query param - Results limit per page (50 by default)
 * @apiParam {Number} [page] Query param - Page number (1 by default)
 * @apiParam {String} [name] Query param - Find the food items matching the specified name pattern
 * @apiParam {String} [quantity] Query param - Find the food items with the specified serving size/quantity
 * @apiParam {String} [store] Query param - Find the food items available in a specified store
 * @apiParam {String} [nutrition_score] Query param - Find the food items with a nutrition score equal or above the specified nutrition score
 * @apiParam {String} [ingredients] Query param -  Find the food items containing the specified ingredient
 * @apiParam {String} [additives] Query param - Find the food items not containing the specified additive
 * @apiParam {String} [nutriments] Query param - Find the food items containing the specified nutriment
 * @apiParam {String} [allergens] Query param - Find the food items not containing the specified allergen
 * @apiParam {String} [vitamins] Query param - Find the food items containing the specified vitamin
 * @apiParam {String} [sortBy] Query param - (values: name, nutriscore or price)
 * @apiParam {Boolean} [debug] Query param - To display the true results from database (without our model abstraction)
 * @apiSuccess {JSON} result A JSON array containing the food items with the requested criterias
 * @apiSuccessExample {json} On success
 * [{
    "_id": "00",
    "name": "Lignaform",
    "serving_size": "5 barres de 40gr",
    "nutrition_grade": "c",
    "ingredients": [
    ],
    "nutriments": {...
    },
    "allergens": [],
    "vitamins": [],
    "pricing": [],
    "imgUrl": "https://static.openfoodfacts.org/images/products/00/front_fr.14.full.jpg",
    "score": "c",
    "avgPrice": 0
  }]
 */
function getFoods(req, res, next) {
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
        criterias.push({ $or: [{ product_name: reg }, { product_name_en: reg }, { product_name_fr: reg }] });
    }
    if (req.query.quantity != null) {
        let reg = new RegExp(".*" + req.query.quantity + ".*", "i");
        criterias.push({ $or: [{ serving_size: reg }, { quantity: reg }] });
    } if (req.query.store != null) {
        let reg = new RegExp(".*" + req.query.store + ".*", "i");
        criterias.push({ 'pricing.store.name': reg });
    }
    let reg = new RegExp("[^\s]*", "i");
    let regArray = { $exists: true, $ne: [] };
    if (req.query.nutrition_score != null) {
        if (req.query.nutrition_score == "") {
            criterias.push({ $or: [{ nutrition_grade_fr: reg, nutrition_grades: reg }] });
        } else {
            let grade = req.query.nutrition_score.toLowerCase().charAt(0);
            let grade_array = ['x', 'e', 'd', 'c', 'b', 'a'];
            if (grade_array.includes(grade) && grade_array.indexOf(grade) != -1) {
                grade_array.splice(0, grade_array.indexOf(grade));
            }
            criterias.push({ $or: [{ nutrition_grade_fr: { $in: grade_array }, nutrition_grades: { $in: grade_array } }] });
        }
    } if (req.query.ingredients != null) {
        criterias.push({ $or: [{ ingredients_text_fr: reg, ingredients_text: reg, ingredients_tags: regArray, ingredients: regArray }] });
    } if (req.query.additives != null) {
        let criteria_additives = (req.query.additives == "" ? {$in: [null, []]} : { '$regex': '^((?!' + req.query.additives + ').)*$', '$options': 'i' });
        criterias.push({ additives: criteria_additives });
    } if (req.query.nutriments != null) {
        criterias.push({ nutriments: reg });
    } if (req.query.allergens != null) {
        criterias.push({ $or: [{ allergens_tags: reg, allergens: reg, allergens_from_ingredients: reg, traces: reg }] });
    } if (req.query.vitamins != null) {
        criterias.push({ vitamins_tags: regArray });
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
                foodDb().aggregate([
                    {
                        $addFields: {
                            "product_name_fr": {
                                $ifNull: ['$product_name_fr', '$product_name_en']
                            }
                        },
                    },
                    {
                        $addFields: {
                            "product_name_fr": {
                                $ifNull: ['$product_name_fr', '$product_name']
                            }
                        },
                    },
                    {
                        $addFields: {
                            "product_name_fr": {
                                $ifNull: ['$product_name_fr', false]
                            }
                        },
                    },
                    {
                        $addFields: {
                            "product_name_fr": {
                                $switch: {
                                    branches: [
                                        { case: { "$eq": ["$product_name_fr", ""] }, then: "Z_IngrédientMystère" },
                                        { case: { "$eq": ["$product_name_fr", false] }, then: "Z_IngrédientMystère" },
                                    ],
                                    default: "$product_name_fr"
                                }
                            }
                        },
                    },
                    {
                        $addFields: {
                            "insensitive": { "$toLower": "$product_name_fr" }
                        },
                    },
                    { $sort: { insensitive: 1 } },
                    { $skip: (pagesize * (n - 1)) },
                    { $limit: pagesize },
                ], { allowDiskUse: true }).toArray(function (err, docs) {
                    assert.equal(err, null);
                    if (req.query.debug != null) {
                        res.send(docs);
                    } else {
                        let response = [];
                        docs.forEach(function (element) {
                            response.push(new Food(element));
                        });
                        res.send(response);
                    }
                });
                return;
            case "nutriscore":
                foodDb().aggregate([
                    { $addFields: { nutrition_grade_fr: { $ifNull: ["$nutrition_grade_fr", 'x'] } } },
                    { $sort: { nutrition_grade_fr: 1 } },
                    { $skip: (pagesize * (n - 1)) },
                    { $limit: pagesize },
                ]).toArray(function (err, docs) {
                    assert.equal(err, null);
                    if (req.query.debug != null) {
                        res.send(docs);
                    } else {
                        let response = [];
                        docs.forEach(function (element) {
                            response.push(new Food(element));
                        });
                        res.send(response);
                    }
                });
                return;
            case "price":
                foodDb().aggregate([
                    { $addFields: { "currentPrice": { $arrayElemAt: ["$pricing", -1] } } },
                    { $sort: { "currentPrice.price": 1 } },
                    { $skip: (pagesize * (n - 1)) },
                    { $limit: pagesize }
                ]).toArray(function (err, docs) {
                    assert.equal(err, null);
                    if (req.query.debug != null) {
                        res.send(docs);
                    } else {
                        let response = [];
                        docs.forEach(function (element) {
                            response.push(new Food(element));
                        });
                        res.send(response);
                    }
                });
                return;
            default:
                break;
        }
    }
    foodDb().find(searchObject).sort(sortObject).skip(pagesize * (n - 1)).limit(pagesize).toArray(function (err, docs) {
        assert.equal(err, null);
        if (req.query.debug != null) {
            res.send(docs);
        } else {
            let response = [];
            docs.forEach(function (element) {
                response.push(new Food(element));
            });
            res.send(response);
        }
    });
}

/**
 * @category   Fooderoux
 * @apiGroup   Food
 * @author     Joël Cancela Vaz <joel.cancelavaz@gmail.com>
 * @version    Release: @1.0.0@
 *
 * @api {get} /api/foods/:itemId Get a specific food item with its id
 * @apiName home
 * @apiVersion 1.0.0
 * @apiParam {String} itemId Path param - ID of a given food item.
 * @apiSuccess {JSON} result A JSON array containing the matching element (or not)
 * @apiSuccessExample {json} On success
 * [{
    "_id": "0002200001221",
    "name": "Big choco",
    "serving_size": "250 g",
    "nutrition_grade": "",
    "ingredients": [],
    "additives": [],
    "nutriments": {},
    "allergens": [],
    "vitamins": [],
    "pricing": [],
    "imgUrl": "https://static.openfoodfacts.org/images/products/000/220/000/1221/front_fr.3.full.jpg",
    "score": "b",
    "avgPrice": 0
   }]
 */
function getFoodById(req, res) {
    let response = [];
    if (req.params.itemId != null) {
        foodDb().find({ _id: req.params.itemId }).toArray(function (err, docs) {
            assert.equal(err, null);
            if (req.query.debug != null) {
                res.send(docs);
            } else {
                docs.forEach(function (element) {
                    response.push(new Food(element));
                });
                res.send(response);
            }
        });
    } else {
        res.send(response);
    }
}

/**
 * @category   Fooderoux
 * @apiGroup   Food
 * @author     Nikita ROUSSEAU <nikita.rousseau@etu.unice.fr>
 * @version    Release: @1.0.0@
 *
 * @api {post} /api/foods/:itemId/pricing Add pricing to an item
 * @apiName postPriceForFood
 * @apiVersion 1.0.0
 * @apiParam {String} itemId Path param - ID of a given food item.
 * @apiParamExample {json} Request-Example:
 * {
 *   "price": 20,
 *   "store": {
 *     "name": "Carrefour Antibes"
 *   }
 * }
 * @apiSuccess {JSON} result Pricing information
 * @apiSuccessExample {json} On success
 * {
 *     "item": {
 *         "_id": "00000",
 *         "pricing": [
 *             {
 *                 "_uuid": "ce0199b1-13b0-45f3-a9c1-454072e432a8",
 *                 "price": 20,
 *                 "currency": "euro",
 *                 "date": 1550503498361,
 *                 "store": {
 *                     "_uuid": "99ef207806547c6c203339be3b096787595f8e5d",
 *                     "name": "Carrefour Antibes",
 *                     "location": {
 *                         "type": "Point",
 *                         "coordinates": {
 *                             "lat": "43.60356775",
 *                             "lng": "7.08884616418128"
 *                         }
 *                     },
 *                     "country_code": "fr"
 *                 }
 *             }
 *         ]
 *     }
 * }
 */
async function postPriceForFood(req, res) {
    let itemId = - 1;
    let price = -1;
    let store = {
        "_uuid": -1,
        "name": "",
        "location": {
            "type": "Point",
            "coordinates": {
                "lat": -73.856077,
                "lng": 40.848447
            }
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
    // store name
    if (req.body["store"] == null || req.body["store"]["name"] == null || req.body["store"]["name"].length < 3) {
        res.status(400).send("Missing store object/name.");
        return;
    }

    /* ============================================================================================================== */
    // Store object definition */
    // Name
    store.name = req.body["store"]["name"];
    // GPS Location
    try {
        store.location.coordinates = await util.doGPSCoordinatesFromLocation(store.name);
    }
    catch (e) {
        console.log(e);
        res.status(500).send()
    }
    if (!store.location.coordinates.hasOwnProperty("lng")) {
        res.status(400).send("Unable to geocode the location for the given store name.");
    }
    // Region
    let region;
    try {
        region = await util.doCityFromGPSCoordinates(
            store.location.coordinates.lng,
            store.location.coordinates.lat
        );
    }
    catch (e) {
        console.log(e);
        res.status(500).send()
    }
    if (!region.hasOwnProperty("country_code")) {
        res.status(400).send("Unable to geocode the region for the given store name.");
    }
    store.country_code = region.country_code;
    // Id
    store['_uuid'] = String(hash(store)).trim(); // Generate unique Id for the given store
    /* ============================================================================================================== */

    foodDb().find({ _id: itemId }).toArray(function (err, result_collection) {
        assert.equal(err, null);

        // Not found
        if (result_collection[0] === undefined) {
            res.status(404).send();
            return;
        }

        // Resolve pricing foodDb()
        if (result_collection[0].pricing !== undefined && Array.isArray(result_collection[0].pricing)) {
            pricing_collection = result_collection[0].pricing;
        }

        // Update foodDb()
        pricing_collection.push({
            "_uuid": String(uuidv4()).trim(),
            "price": price,
            "currency": "euro",
            "date": Date.now(),
            "store": store
        });
        foodDb().updateOne(
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
}

exports.getFoodCount = getFoodCount;
exports.getFoods = getFoods;
exports.getFoodById = getFoodById;
exports.postPriceForFood = postPriceForFood;