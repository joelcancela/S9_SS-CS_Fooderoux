# S9_SS/CS_Fooderoux

Project combining the Server Side and the Client Side web courses. Full-stack web app about listing food and their characteristics (inspired by Open Food Facts).

## Built with

* Front-end
  * Vue.js
  * Vuetify
* Back-end
  * Node
  * Express
  * MongoDB

## Demo URLs (Deployed on Heroku)

* [Front-end](https://server-side-food-client.herokuapp.com/#/)
* [Back-end](https://server-side-food-backend.herokuapp.com/)

## Installation

### Front-end

```bash
cd projet_client_side_vuejs
npm install
npm run serve
# Client app running at localhost:8080
```

### Backend

```bash
cd backend_node_express
npm install
npm start
# Server listens at port 3000 or the one specified by the environnement variable: "PORT" (like Heroku does)
```

### Documentation

#### Generation

```bash
npm install apidoc -g # Install apidoc
./generate_doc.sh # Launches command to generate documentation
```

#### Consult

doc/index.html

### Create your own database

* Get a MongoDB Database (you can get one at mlab.com)
* Install [Mongo shell](https://docs.mongodb.com/manual/mongo/)
* Go to folder ``database_setup``
* Type the following commands:
    * ``mongorestore  -h <hostname> -d <database_name> -u <user> -p <password> --collection france --drop --gzip france.bson.gz``
    * ``mongorestore -h <hostname> -d <database_name> -u <user> -p <password> recipes.bson``
* Edit backend_node_express\mongodb\mongo.js
    * Change the following variables values: "url", "dbName"

## Authors

* BONNY Pierre
* CANCELA VAZ Joël
* CASAGRANDE Guillaume
* ROUSSEAU Nikita

### Distribution of tasks

#### Front-end

* Display of the aliments, recipes, stores and their locations on the map - Pierre
* Display of the aliments, their characteristics, filters (and sorting), price and comments on recipes - Guillaume

#### Back-end

* Implementation of a middleware to match stores with their cities and GPS location via OpenStreetMap - Nikita
* Implementation of everything about stores and pricing. - Nikita

* Connection to MongoDb - Joël
* Creation of the food API and model - Joël
* Creation of the recipe API - Joël
* Splitted the application into modules - Joël
