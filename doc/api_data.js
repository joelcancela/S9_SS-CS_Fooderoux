define({ "api": [
  {
    "group": "Food",
    "type": "get",
    "url": "/api/stats",
    "title": "Get food items count in database",
    "name": "getFoodCount",
    "version": "1.0.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>A JSON containing the number of food item in database</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "On success",
          "content": "{ items: 28522 }",
          "type": "json"
        }
      ]
    },
    "filename": "backend_node_express/api/foods.js",
    "groupTitle": "Food"
  },
  {
    "group": "Food",
    "type": "get",
    "url": "/api/foods",
    "title": "Get specific food items according to criterias",
    "name": "getFoods",
    "version": "1.0.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>A JSON array the food items with the requested criterias</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "On success",
          "content": "[{\n    \"_id\": \"00\",\n    \"name\": \"Lignaform\",\n    \"serving_size\": \"5 barres de 40gr\",\n    \"nutrition_grade\": \"c\",\n    \"ingredients\": [\n    ],\n    \"nutriments\": {...\n    },\n    \"allergens\": [],\n    \"vitamins\": [],\n    \"pricing\": [],\n    \"imgUrl\": \"https://static.openfoodfacts.org/images/products/00/front_fr.14.full.jpg\",\n    \"score\": \"c\",\n    \"avgPrice\": 0\n    }]",
          "type": "json"
        }
      ]
    },
    "filename": "backend_node_express/api/foods.js",
    "groupTitle": "Food"
  },
  {
    "group": "Food",
    "type": "get",
    "url": "/api/foods/:itemId",
    "title": "Get a specific food item with its id",
    "name": "home",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "itemId",
            "description": "<p>Mandatory ID of a given food item.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>A JSON array containing the matching element (or not)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "On success",
          "content": "[{\n    \"_id\": \"0002200001221\",\n    \"name\": \"Big choco\",\n    \"serving_size\": \"250 g\",\n    \"nutrition_grade\": \"\",\n    \"ingredients\": [],\n    \"additives\": [],\n    \"nutriments\": {},\n    \"allergens\": [],\n    \"vitamins\": [],\n    \"pricing\": [],\n    \"imgUrl\": \"https://static.openfoodfacts.org/images/products/000/220/000/1221/front_fr.3.full.jpg\",\n    \"score\": \"b\",\n    \"avgPrice\": 0\n   }]",
          "type": "json"
        }
      ]
    },
    "filename": "backend_node_express/api/foods.js",
    "groupTitle": "Food"
  },
  {
    "group": "Food",
    "type": "post",
    "url": "/api/foods/:itemId/pricing",
    "title": "Add pricing to an item",
    "name": "postPriceForFood",
    "version": "1.0.0",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"price\": 20,\n  \"store\": {\n    \"name\": \"Carrefour Antibes\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>Pricing information</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "On success",
          "content": "{\n    \"item\": {\n        \"_id\": \"00000\",\n        \"pricing\": [\n            {\n                \"_uuid\": \"ce0199b1-13b0-45f3-a9c1-454072e432a8\",\n                \"price\": 20,\n                \"currency\": \"euro\",\n                \"date\": 1550503498361,\n                \"store\": {\n                    \"_uuid\": \"99ef207806547c6c203339be3b096787595f8e5d\",\n                    \"name\": \"Carrefour Antibes\",\n                    \"location\": {\n                        \"type\": \"Point\",\n                        \"coordinates\": {\n                            \"lat\": \"43.60356775\",\n                            \"lng\": \"7.08884616418128\"\n                        }\n                    },\n                    \"country_code\": \"fr\"\n                }\n            }\n        ]\n    }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "backend_node_express/api/foods.js",
    "groupTitle": "Food"
  },
  {
    "group": "Recipe",
    "type": "get",
    "url": "/api/recipes",
    "title": "Get all recipes from database",
    "name": "getAllRecipes",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "firstname",
            "description": "<p>Optional Firstname of the User.//TODO:</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "result",
            "description": "<p>A JSON containing the number of recipes in database</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "On success",
          "content": "{ items: 7 }//TODO:",
          "type": "json"
        }
      ]
    },
    "filename": "backend_node_express/api/recipes.js",
    "groupTitle": "Recipe"
  },
  {
    "group": "Recipe",
    "type": "get",
    "url": "/api/recipes/:recipeId",
    "title": "Get a specific recipe by its id",
    "name": "getRecipeById",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "recipeId",
            "description": "<p>the id of the recipe</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>Server onlineTODO:</p>"
          }
        ]
      }
    },
    "filename": "backend_node_express/api/recipes.js",
    "groupTitle": "Recipe"
  },
  {
    "group": "Recipe",
    "type": "get",
    "url": "/api/recipes/stats",
    "title": "Get recipes count in database",
    "name": "getRecipeCount",
    "version": "1.0.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "result",
            "description": "<p>A JSON containing the number of recipes in database</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "On success",
          "content": "{ items: 7 }",
          "type": "json"
        }
      ]
    },
    "filename": "backend_node_express/api/recipes.js",
    "groupTitle": "Recipe"
  },
  {
    "group": "Recipe",
    "type": "get",
    "url": "/api/recipes/:recipeId/price",
    "title": "Get the average price of a recipe",
    "name": "getRecipePrice",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "recipeId",
            "description": "<p>the id of the recipe</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>Server onlineTODO:</p>"
          }
        ]
      }
    },
    "filename": "backend_node_express/api/recipes.js",
    "groupTitle": "Recipe"
  },
  {
    "group": "Recipe",
    "type": "post",
    "url": "/api/recipes/parse",
    "title": "Parse a given recipe",
    "name": "parseRecipe",
    "version": "1.0.0",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example://TODO:",
          "content": "{\n  \"id\": 4711\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>Server online</p>"
          }
        ]
      }
    },
    "filename": "backend_node_express/api/recipes.js",
    "groupTitle": "Recipe"
  },
  {
    "group": "Recipe",
    "type": "post",
    "url": "/api/recipes/:recipeId/comment",
    "title": "Comment on a given recipe",
    "name": "postCommentOnRecipe",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lastname",
            "description": "<p>Mandatory Lastname.TODO:</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>Server online</p>"
          }
        ]
      }
    },
    "filename": "backend_node_express/api/recipes.js",
    "groupTitle": "Recipe"
  },
  {
    "group": "Recipe",
    "type": "post",
    "url": "/api/recipes",
    "title": "Create a recipe",
    "name": "postRecipe",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lastname",
            "description": "<p>Mandatory Lastname.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>TODO:</p>"
          }
        ]
      }
    },
    "filename": "backend_node_express/api/recipes.js",
    "groupTitle": "Recipe"
  },
  {
    "group": "Util",
    "type": "get",
    "url": "/api/stores/search",
    "title": "Get stores in a selected region",
    "name": "getStoresInRegion",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "region",
            "description": "<p>ISO country code (i.e. us)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>a JSON containing a stores key with an array</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "On success",
          "content": "{\n    \"stores\": [\n        {\n            \"_uuid\": \"99ef207806547c6c203339be3b096787595f8e5d\",\n            \"name\": \"Carrefour Antibes\",\n            \"location\": {\n                \"type\": \"Point\",\n                \"coordinates\": {\n                    \"lat\": \"43.60356775\",\n                    \"lng\": \"7.08884616418128\"\n                }\n            },\n            \"country_code\": \"fr\"\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "backend_node_express/api/utils.js",
    "groupTitle": "Util"
  },
  {
    "group": "Util",
    "type": "get",
    "url": "/",
    "title": "Server heartbeat",
    "name": "home",
    "version": "1.0.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result",
            "description": "<p>A nice message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "On success",
          "content": "Server online",
          "type": "String"
        }
      ]
    },
    "filename": "backend_node_express/api/utils.js",
    "groupTitle": "Util"
  }
] });
