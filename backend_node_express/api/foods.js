/**************************** Food API (/foods) ****************************/
const foodDb = require('../mongodb/mongo').getFoodDb; // Connection to food collection
const uuidv4 = require('uuid/v4'); // UUID generator
const assert = require('assert'); // Assertions

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
        criterias.push({ $or: [{ product_name: reg }, { product_name_fr: reg }] });
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
                foodDb().aggregate([
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
    foodDb().find(searchObject).sort(sortObject).skip(pagesize * (n - 1)).limit(pagesize).toArray(function (err, docs) {
        assert.equal(err, null);
        res.send(docs);
    });
}

function getFoodById(req, res) {
    if (req.params.itemId != null) {
        foodDb().find({ _id: req.params.itemId }).toArray(function (err, docs) {
            assert.equal(err, null);
            res.send(docs);
        });
    } else {
        res.send([]);
    }
}

function getPriceEvolutionForFood(req, res) {
    let itemId;

    if (req.params.itemId == null) {
        res.status(400).send("Invalid :itemId, :itemId must be an Integer.");
        return;
    }

    itemId = req.params.itemId;

    foodDb().find({ _id: itemId }).toArray(function (err, result_collection) {
        assert.equal(err, null);

        if (result_collection[0] === undefined) {
            res.status(404).send();
            return;
        }

        let item = result_collection[0];

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
}

function getAvgPriceForFood(req, res) {
    let itemId;
    let item;
    let price = 0.0;

    if (req.params.itemId == null) {
        res.status(400).send("Invalid :itemId, :itemId must be an Integer.");
        return;
    }

    itemId = req.params.itemId;

    foodDb().find({ _id: itemId }).toArray(function (err, result_collection) {
        assert.equal(err, null);

        // Not found
        if (result_collection[0] === undefined) {
            res.status(404).send();
            return;
        }

        item = result_collection[0];

        // No pricing yet
        if (item.pricing === undefined) {
            res.send(
                {
                    "item": {
                        "_id": itemId,
                        "price": price
                    }
                }
            );
            return;
        }

        item.pricing.forEach(function (item) {
            price += parseInt(item.price);
        });
        price = price / item.pricing.length;

        // 200 OK
        res.send(
            {
                "item": {
                    "_id": itemId,
                    "price": price
                }
            }
        );
    });
}

function postPriceForFood(req, res) {
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

function getScoreForFood(req, res) {
    if (req.params.itemId != null) {
        foodDb().find({ _id: req.params.itemId }).toArray(function (err, docs) {
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
}

function getImgLinkForFood(req, res) {
    if (req.params.itemId != null) {
        foodDb().find({ _id: req.params.itemId }).toArray(function (err, docs) {
            assert.equal(err, null);
            if (docs[0] != undefined) {
                let item = docs[0];
                let url = "https://static.openfoodfacts.org/images/products/";
                if (item.images != undefined && item.images.front_fr != undefined) {
                    if (item._id.length == 9) {
                        let str = item._id;
                        url += str.substring(0, 3) + "/" + str.substring(3, 6) + "/" + str.substring(6) + "/front_fr.";
                    } else if (item._id.length == 13 || item._id.length >= 10) {
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
                    res.status(404).send({ link: null, error: 'Could not find image link' });
                }

            } else {
                res.status(404).send({ link: null, error: 'Item id is incorrect' });
            }
        });
    } else {
        res.status(400).send({ link: null, error: 'bad request' });
    }
}

exports.getFoodCount = getFoodCount;
exports.getFoods = getFoods;
exports.getFoodById = getFoodById;
exports.getPriceEvolutionForFood = getPriceEvolutionForFood;
exports.getAvgPriceForFood = getAvgPriceForFood;
exports.postPriceForFood = postPriceForFood;
exports.getScoreForFood = getScoreForFood;
exports.getImgLinkForFood = getImgLinkForFood;