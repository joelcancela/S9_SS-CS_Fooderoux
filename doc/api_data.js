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
            "description": "<p>Server online</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "On success",
          "content": "{\n \"price\": 11,\n \"store\": {\n   \"storeId\": 42,\n   \"name\": \"TotoShop42\",\n   \"location\": {\n     \"type\": \"Point\",\n     \"coordinates\": {\n       \"lat\": -73.856077,\n       \"lng\": 40.848447\n     }\n   },\n   \"country_code\": \"us\"\n }\n}\n\nResponse:\n{\n   \"item\": {\n     \"_id\": \"0000000027205\",\n     \"pricing\": [(...)]\n   }\n}",
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
    "url": "/",
    "title": "",
    "name": "home",
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
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "firstname",
            "description": "<p>Optional Firstname of the User.</p>"
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
    "type": "get",
    "url": "/",
    "title": "",
    "name": "home",
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
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "firstname",
            "description": "<p>Optional Firstname of the User.</p>"
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
    "type": "get",
    "url": "/",
    "title": "",
    "name": "home",
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
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "firstname",
            "description": "<p>Optional Firstname of the User.</p>"
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
    "type": "get",
    "url": "/",
    "title": "",
    "name": "home",
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
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "firstname",
            "description": "<p>Optional Firstname of the User.</p>"
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
    "type": "get",
    "url": "/",
    "title": "",
    "name": "home",
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
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "firstname",
            "description": "<p>Optional Firstname of the User.</p>"
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
    "type": "get",
    "url": "/",
    "title": "",
    "name": "home",
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
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "firstname",
            "description": "<p>Optional Firstname of the User.</p>"
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
    "type": "get",
    "url": "/",
    "title": "",
    "name": "home",
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
            "description": "<p>Server online</p>"
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
    "url": "/api/regions/resolve",
    "title": "Find city with GPS coordinates",
    "name": "getCityFromGPSCoordinates",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lat",
            "description": "<p>float latitude value between -90 and 90 (inclusive)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "long",
            "description": "<p>float latitude value between -180 and 180 (inclusive)</p>"
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
            "description": "<p>A JSON describing the city</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "On success",
          "content": "{\n  \"island\": \"Hunter Island\",\n  \"county\": \"Bronx County\",\n  \"city\": \"NYC\",\n  \"state\": \"New York\",\n  \"postcode\": \"10805\",\n  \"country\": \"USA\",\n  \"country_code\": \"us\"\n}",
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
    "url": "/stores/search",
    "title": "Get stores in region",
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
          "content": "{\n    \"stores\": [{}, {}, ...]\n}",
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
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "On success",
          "content": "Server online",
          "type": "json"
        }
      ]
    },
    "filename": "backend_node_express/api/utils.js",
    "groupTitle": "Util"
  }
] });
