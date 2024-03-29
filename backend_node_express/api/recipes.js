/**************************** Recipe API (/recipes) ****************************/
const recipeDb = require('../mongodb/mongo').getRecipeDb; // Connection to recipe collection
const foodDb = require('../mongodb/mongo').getFoodDb; // Connection to food collection
const assert = require('assert'); // Assertions
const ObjectId = require('mongodb').ObjectId; //Used to make Mongo recognize ids (sometimes it doesn't :( )

/**
 * @category   Fooderoux
 * @apiGroup   Recipe
 * @author     Joël Cancela Vaz <joel.cancelavaz@gmail.com>
 * @version    Release: @1.0.0@
 *
 * @api {get} /api/recipes/stats Get recipes count in database
 * @apiName getRecipeCount
 * @apiVersion 1.0.0
 * @apiSuccess {JSON} result A JSON containing the number of recipes in database
 * @apiSuccessExample {json} On success
 * { items: 7 }
 */
function getRecipeCount(req, res) {
    recipeDb().stats(function (err, stats) {
        res.send({ items: stats.count });
    });
}

/**
 * @category   Fooderoux
 * @apiGroup   Recipe
 * @author     Joël Cancela Vaz <joel.cancelavaz@gmail.com>
 * @version    Release: @1.0.0@
 *
 * @api {get} /api/recipes Get all recipes from database
 * @apiName getAllRecipes
 * @apiVersion 1.0.0
 * @apiParam {Number} [limit] Query param - Results limit per page (50 by default)
 * @apiParam {Number} [page] Query param - Page number (1 by default)
 * @apiParam {String} [sortBy] Query param - (values: name, date)
 * @apiParam {String} [contains] Query param - Find the recipes containing the specified ingredients name
 * @apiParam {String} [name] Query param - Find the recipes with name matching the specified name
 * @apiSuccess {JSON} result A JSON containing the number of recipes in database
 * @apiSuccessExample {json} On success
 * [
  {
    "_id": "5c6037882c8865136cad3976",
    "name": "Pâtes Carbonara",
    "ingredients": [
      "10114992",
      "0240891027483"
    ],
    "date": 1549809544496,
    "comments": [
      {
        "username": "Le cuisiner",
        "text": "Si tu sais pas faire ça, t'es pas italien"
      }
    ]
  },...
]
 */
function getAllRecipes(req, res) {
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
    let searchObject = {};
    let criterias = [];
    if (req.query.contains != null) {
        let regex = [new RegExp(".*" + req.query.contains + ".*", "i")];
        criterias.push({ "ingredients": { $in: regex } });
    }
    if (req.query.name != null) {
        let regex = new RegExp(".*" + req.query.name + ".*", "i");
        criterias.push({ "name": regex });
    }
    if (criterias.length > 0) {
        if (criterias.length == 1) {
            searchObject = criterias[0];
        } else {
            searchObject["$and"] = criterias;
        }
    }
    recipeDb().find(searchObject).sort(sortObject).skip(pagesize * (n - 1)).limit(pagesize).toArray(function (err, docs) {
        assert.equal(err, null);
        res.send(docs);
    });
}

/**
 * @category   Fooderoux
 * @apiGroup   Recipe
 * @author     Joël Cancela Vaz <joel.cancelavaz@gmail.com>
 * @version    Release: @1.0.0@
 *
 * @api {get} /api/recipes/:recipeId Get a specific recipe by its id
 * @apiName getRecipeById
 * @apiVersion 1.0.0
 * @apiParam {String} recipeId Path param - the id of the recipe
 * @apiSuccess {JSON} result A JSON array containing the recipe matching the id (or not).
 * @apiSuccessExample {json} On success
 * [
  {
    "_id": "5c6037882c8865136cad3976",
    "name": "Pâtes Carbonara",
    "ingredients": [
      "10114992",
      "0240891027483"
    ],
    "date": 1549809544496,
    "comments": [
      {
        "username": "Le cuisiner",
        "text": "Si tu sais pas faire ça, t'es pas italien"
      }
    ]
  }
]
 */
function getRecipeById(req, res) {
    let id = req.params.recipeId;
    recipeDb().find(ObjectId(id)).toArray(function (err, docs) {
        if (err != null) {
            console.log(err);
            res.status(400).send(err);
        } else {
            res.send(docs);
        }
    });
}

/**
 * @category   Fooderoux
 * @apiGroup   Recipe
 * @author     Joël Cancela Vaz <joel.cancelavaz@gmail.com>
 * @version    Release: @1.0.0@
 *
 * @api {get} /api/recipes/:recipeId/price Get the average price of a recipe
 * @apiName getRecipePrice
 * @apiVersion 1.0.0
 * @apiParam {String} recipeId Path param - the id of the recipe
 * @apiSuccess {JSON} result A JSON containing the sum of the average price of every ingredient of the recipe
 * @apiSuccessExample {json} On success
 * {
  "price": 0
}
 */
function getRecipePrice(req, res) {
    let id = req.params.recipeId;
    getRecipeWithIdPromise(id).then(function (item) {
        if (item.ingredients != undefined && (item.ingredients instanceof Array) && item.ingredients.length > 0) {
            let promises = [];
            item.ingredients.forEach(function (element) {
                promises.push(getIngredientAvgPriceForIngredient(element));
            });
            Promise.all(promises).then(function (values) {
                if (values.length > 0) {
                    res.send({ 'price': Number.parseFloat(values.map(item => item.reduce((total, value) => total + value, 0) / item.length).filter(x => x).reduce((total, value) => total + value, 0).toFixed(2)) })
                } else {
                    res.send({ 'price': 0.0 });
                }
            });
        } else {
            res.send({ 'price': 0.0 });
        }
    }, err => {
        res.status(400).send(err);
    });
}

function getRecipeWithIdPromise(id) {
    return new Promise(function (resolve, reject) {
        recipeDb().find(ObjectId(id)).toArray(function (err, docs) {
            if (err != null) {
                reject(err);
            }
            if (docs[0] != undefined) {
                resolve(docs[0]);
            } else {
                reject("No such recipe");
            }
        });
    });
}

function getIngredientAvgPriceForIngredient(element) {
    return new Promise(function (resolve, reject) {
        let reg = new RegExp(".*" + element + ".*", "i");
        let searchObject = { $or: [{ product_name: reg }, { product_name_en: reg }, { product_name_fr: reg }] };
        foodDb().find(searchObject).toArray(function (err, docs) {
            if (err != null) {
                reject(err);
            }
            let avg = [];
            docs.forEach(function (element) {
                if (element.pricing != undefined && element.pricing.length > 0) {
                        avg.push(element.pricing[element.pricing.length-1].price);
                }
            });
            resolve(avg);
        });
    });
}

/**
 * @category   Fooderoux
 * @apiGroup   Recipe
 * @author     Joël Cancela Vaz <joel.cancelavaz@gmail.com>
 * @version    Release: @1.0.0@
 *
 * @api {post} /api/recipes/parse Parse a given recipe
 * @apiName parseRecipe
 * @apiVersion 1.0.0
 * @apiParamExample {json} Request-Example:
 * {
    "0":"macaroni",
    "1":"cheese",
    "filter":"e211" // Filter is optional
}
 * @apiSuccess {JSON} result A JSON containing for each ingredient, every possible matching food item
 * @apiSuccessExample {json} On success
 * {
    "0": [
        <items that are macaroni and don't have e211>],
    "1":[]
}
 */
function parseRecipe(req, res) {
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
            foodDb().find(
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
}

/**
 * @category   Fooderoux
 * @apiGroup   Recipe
 * @author     Joël Cancela Vaz <joel.cancelavaz@gmail.com>
 * @version    Release: @1.0.0@
 *
 * @api {post} /api/recipes Create a recipe
 * @apiName postRecipe
 * @apiVersion 1.0.0
 * @apiParamExample {json} Request-Example:
 * {
    "name":"Ma recette",
    "ingredients":["Chou","Fleur"]
}

 * @apiSuccess {JSON} result A JSON being the newest created recipe
 * @apiSuccessExample {json} On success
 * {
    "name":"Ma recette",
    "ingredients":["Chou","Fleur"]
}
 */
function postRecipe(req, res) {
    let data = req.body;
    try {
        let result = recipeDb().insertOne({ name: data.name, ingredients: data.ingredients, date: Date.now(), comments: [] })
        res.status(200).send(result);
    } catch (e) {
        res.status(400).send(e);
    }
}

/**
 * @category   Fooderoux
 * @apiGroup   Recipe
 * @author     Joël Cancela Vaz <joel.cancelavaz@gmail.com>
 * @version    Release: @1.0.0@
 *
 * @api {post} /api/recipes/:recipeId/comment Comment on a given recipe
 * @apiName postCommentOnRecipe
 * @apiVersion 1.0.0
 * @apiParam {String} recipeId Path param - the id of the recipe
 * @apiParamExample {json} Request-Example:
 * {
    "comment":{
        "username":"Le cuisiner",
        "text": "Si tu sais pas faire ça, t'es pas italien",
        "date": 10801808
    }
}
 * @apiSuccess {JSON} result An empty JSON with status 200
 * @apiSuccessExample {json} On success
 * {}
 */
function postCommentOnRecipe(req, res) {
    let data = req.body.comment;
    let id = req.params.recipeId;
    recipeDb().find(ObjectId(id)).toArray(function (err, docs) {
        if (err != null) {
            console.log(err);
            res.status(400).send(err);
        } else {
            recipeDb().updateOne(
                { _id: ObjectId(id) },
                {
                    $push: { "comments": data }
                }
            )
            res.status(200).send({});
        }
    });
}

exports.getRecipeCount = getRecipeCount;
exports.getAllRecipes = getAllRecipes;
exports.getRecipeById = getRecipeById;
exports.getRecipePrice = getRecipePrice;
exports.parseRecipe = parseRecipe;
exports.postRecipe = postRecipe;
exports.postCommentOnRecipe = postCommentOnRecipe;
