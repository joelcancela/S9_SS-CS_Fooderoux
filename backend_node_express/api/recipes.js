/**************************** Recipe API (/recipes) ****************************/
const recipeDb = require('../mongodb/mongo').getRecipeDb; // Connection to recipe collection
const foodDb = require('../mongodb/mongo').getFoodDb; // Connection to food collection
const assert = require('assert'); // Assertions
const ObjectId = require('mongodb').ObjectId; //Used to make Mongo recognize ids (sometimes he doesn't :( )


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
    recipeDb().find({}).sort(sortObject).skip(pagesize * (n - 1)).limit(pagesize).toArray(function (err, docs) {
        assert.equal(err, null);
        res.send(docs);
    });
}

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

function postRecipe(req, res) {
    let data = req.body;
    try {
        let result = recipeDb().insertOne({ name: data.name, ingredients: data.ingredients, date: Date.now(), comments: [] })
        res.status(200).send(result);
    } catch (e) {
        res.status(400).send(e);
    }
}

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

exports.getAllRecipes = getAllRecipes;
exports.getRecipeById = getRecipeById;
exports.parseRecipe = parseRecipe;
exports.postRecipe = postRecipe;
exports.postCommentOnRecipe = postCommentOnRecipe;