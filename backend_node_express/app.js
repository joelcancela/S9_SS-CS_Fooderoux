const express = require('express')
const bodyParser = require('body-parser');
const mongo = require('./mongodb/mongo');
const foods = require('./api/foods');
const recipes = require('./api/recipes');
const utils = require('./api/utils');
const app = express()
const port = process.env.PORT || 3000;

/**
 * Setting Express CORS headers
 */
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/**
 * Express config & Mongo connection
 */
app.listen(port, function () {
  mongo.initDb(function (err) {
    if (err) {
      throw err;
    } else {
      console.log("Connected to db");
    }
  })
  console.log('Food server listening on port ' + port + '!')
});

/**
 * Routes
 */
/**************************** Utils ****************************/
app.get('/', utils.home);
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
app.get('/api/regions/resolve', utils.getCityFromGPSCoordinates);

/**
 * Given a <country_code> (ISO), fetch all known stores
 *
 * @author: Nikita ROUSSEAU
 *
 * Request: [GET] http://localhost:3000/api/stores/search?region=us
 * Response:
 * {
    "stores": [{}, {}, ...]
 * }
 */
app.get('/api/stores/search', utils.getStoresInRegion);

/**************************** Food ****************************/
app.get('/api/stats', foods.getFoodCount);
app.get('/api/foods', foods.getFoods);
app.get('/api/foods/:itemId', foods.getFoodById);

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
app.post('/api/foods/:itemId/pricing', foods.postPriceForFood);

/**************************** Recipe ****************************/
app.get('/api/recipes/stats', recipes.getRecipeCount);
app.get('/api/recipes', recipes.getAllRecipes);
app.get('/api/recipes/:recipeId', recipes.getRecipeById);
app.post('/api/recipes/parse', recipes.parseRecipe);
app.post('/api/recipes', recipes.postRecipe);
app.post('/api/recipes/:recipeId/comment', recipes.postCommentOnRecipe);