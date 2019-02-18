/**************************** Food API (/foods) ****************************/
const foodDb = require('../mongodb/mongo').getFoodDb; // Connection to food collection
const uuidv4 = require('uuid/v4'); // UUID generator
const hash = require('object-hash');
const assert = require('assert'); // Assertions
const Food = require('../model/food');

function getFoodCount(req, res) {
    foodDb().stats(function (err, stats) {
        res.send({ items: stats.count });
    });
}

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

function postPriceForFood(req, res) {
    let itemId = - 1;
    let price = -1;
    let store = {
        "storeId": -1,
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
    // store
    if (req.body["store"] == null || req.body["store"]["name"] == null) {
        res.status(400).send("Missing store object/name.");
        return;
    }

    /* Store object definition */
    // Name
    store.name = req.body["store"]["name"];
    // GPS Location

    // Region

    // Id
    store['storeId'] = hash(store); // Generate unique Id for the given store
    /* End: Store Object*/

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
            "_uuid": uuidv4(),
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