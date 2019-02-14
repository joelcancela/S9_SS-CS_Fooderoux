const assert = require("assert");
const client = require("mongodb").MongoClient;
// Connection URL
const url = 'mongodb://users:J1ovddMPAbI' + encodeURIComponent('=') + '@ds163054.mlab.com:63054/db-server-side-food';
// Database name
const dbName = 'db-server-side-food';
// Collection name
const collection_food_name = 'france';
const collection_recipes_name = 'recipes';


let _db, collection_food, collection_recipes;

module.exports = {
    initDb,
    getFoodDb,
    getRecipeDb
};

function getRecipeDb(){
    assert.ok(_db, "Db has not been initialized. Please called init first.");
    return collection_recipes;
}

function getFoodDb(){
    assert.ok(_db, "Db has not been initialized. Please called init first.");
    return collection_food;
}


function initDb(callback) {
    if (_db) {
        console.warn("Trying to init DB again!");
        return callback(null, _db);
    }

client.connect(url, { useNewUrlParser: true }, connected);

function connected(err, db) {
        if (err) {
            return callback(err);
        }
        console.log("DB initialized - connected to: " + url.split("@")[1]);
        _db = db.db(dbName);
        collection_food = _db.collection(collection_food_name);
        collection_recipes = _db.collection(collection_recipes_name);
        return callback(null, _db);
    }
}