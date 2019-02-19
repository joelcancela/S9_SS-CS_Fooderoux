/**************************** Utils API (/) ****************************/
const request = require('request'); // HTTP client
const foodDb = require('../mongodb/mongo').getFoodDb; // Connection to food collection
const assert = require('assert'); // Assertions

/**
 * @category   Fooderoux
 * @apiGroup   Util
 * @author     Joël Cancela Vaz <joel.cancelavaz@gmail.com>
 * @version    Release: @1.0.0@
 *
 * @api {get} / Server heartbeat
 * @apiName home
 * @apiVersion 1.0.0
 * @apiSuccess {String} result A nice message
 * @apiSuccessExample {String} On success
 * Server online
 */
function home(req, res) {
    res.send("Server online");
}

/**
 * @category   Fooderoux
 * @apiGroup   Util
 * @author     Nikita ROUSSEAU <nikita.rousseau@etu.unice.fr>
 * @version    Release: @1.0.0@
 *
 * @api {get} /api/stores/search Get stores in a selected region
 * @apiName getStoresInRegion
 * @apiVersion 1.0.0
 * @apiParam {String} region Query param - ISO country code (i.e. fr)
 * @apiSuccess {JSON} result a JSON containing a stores key with an array
 * @apiSuccessExample {json} On success
 * {
 *     "stores": [
 *         {
 *             "_uuid": "99ef207806547c6c203339be3b096787595f8e5d",
 *             "name": "Carrefour Antibes",
 *             "location": {
 *                 "type": "Point",
 *                 "coordinates": {
 *                     "lat": "43.60356775",
 *                     "lng": "7.08884616418128"
 *                 }
 *             },
 *             "country_code": "fr"
 *         }
 *     ]
 * }
 */
function getStoresInRegion(req, res) {
    let country_code;
    let known_stores = [];
    let stores = [];

    if (req.query.region == null || String(req.query.region).length !== 2) {
        res.status(400).send("Invalid country_code, must be coded on two letters.");
        return;
    }

    country_code = String(req.query.region);

    // All items with at leat one store in the selected country
    foodDb().find({ 'pricing.store.country_code': country_code }).toArray(function (err, result_collection) {
        assert.equal(err, null);

        if (result_collection[0] === undefined) {
            res.status(404).send();
            return;
        }

        // Pack stores
        result_collection.forEach(function (item) {
            item.pricing.forEach(function (price) {
                let store = price["store"];
                // Filter regions here
                if (store.country_code !== country_code) {
                    return; // Continue
                }

                let store_hash = String(store._uuid);
                if (!known_stores.includes(store_hash)) {
                    stores.push(store);
                    known_stores.push(store_hash)
                }
            });
        });

        // 200 OK
        res.send(
            {
                "stores": stores
            }
        );
    });
}

/**
 * Given a String Location, resolve to GPS coordinates
 * @param location
 * @returns object
 */
function doGPSCoordinatesFromLocation(location) {
    if (location == null) {
        return null;
    }
    return new Promise (resolve => {
        request.get(
            {
                url: "https://nominatim.openstreetmap.org/search.php",
                headers: {
                    'User-Agent': 'NPM/Request S9_WEBSRV',
                    'Referer': 'about:blank'
                },
                qs: {
                    "format": "json",
                    "q": String(location)
                },
                json: true
            },
            (e, r, body) => {
                if (e) {
                    throw new Error(String(e));
                }
                if (body.length > 0) {
                    resolve({
                        "lat": body[0].lat,
                        "lng": body[0].lon
                    });
                } else {
                    return resolve({});
                }
            }
        );
    })
}

/**
 * Region reverse geocoding by long/lat
 * Valid longitude values are between -180 and 180, both inclusive.
 * Valid latitude values are between -90 and 90 (both inclusive).
 *
 * @author: Nikita ROUSSEAU
 *
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
function doCityFromGPSCoordinates(lon, lat) {
    if (lon == null) {
        return null;
    }
    if (lat == null) {
        return null;
    }
    return new Promise (resolve => {
        request.get(
            {
                url: "https://nominatim.openstreetmap.org/reverse",
                headers: {
                    'User-Agent': 'NPM/Request S9_WEBSRV',
                    'Referer': 'about:blank'
                },
                qs: {
                    "format": "json",
                    "lon": String(lon),
                    "lat": String(lat),
                    "zoom": "10",
                    "addressdetails": "1"
                },
                json: true
            },
            (e, r, body) => {
                if (e) {
                    throw new Error(String(e));
                }
                if (body.address) {
                    resolve(body.address);
                }
                return resolve({});
            }
        );
    })
}

exports.home = home;
exports.getStoresInRegion = getStoresInRegion;
exports.doGPSCoordinatesFromLocation = doGPSCoordinatesFromLocation;
exports.doCityFromGPSCoordinates = doCityFromGPSCoordinates;