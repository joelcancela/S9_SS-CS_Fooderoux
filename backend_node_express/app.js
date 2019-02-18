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
 * Given a <country_code> (ISO), fetch all known stores
 *
 * @author: Nikita ROUSSEAU
 *
 * Request: [GET] http://localhost:3000/api/stores/search?region=fr
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
app.post('/api/foods/:itemId/pricing', foods.postPriceForFood);

/**************************** Recipe ****************************/
app.get('/api/recipes/stats', recipes.getRecipeCount);
app.get('/api/recipes', recipes.getAllRecipes);
app.get('/api/recipes/:recipeId', recipes.getRecipeById);
app.get('/api/recipes/:recipeId/price', recipes.getRecipePrice);
app.post('/api/recipes/parse', recipes.parseRecipe);
app.post('/api/recipes', recipes.postRecipe);
app.post('/api/recipes/:recipeId/comment', recipes.postCommentOnRecipe);