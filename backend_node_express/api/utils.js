/**************************** Utils API (/) ****************************/
const request = require('request'); // HTTP client
const foodDb = require('../mongodb/mongo').getFoodDb; // Connection to food collection

function home(req, res) {
    res.send("Server online");
}

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

                let store_hash =
                    String(store.storeId) +
                    String(store.name) +
                    String(store.location.coordinates.lat) +
                    String(store.location.coordinates.lng);
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

/* LOCATION GEOCODING */

async function getGPSCoordinatesFromLocation(req, res) {

    let location;
    let coordinates;
    if (req.query.name == null) {
        res.status(400).send("Missing location name.");
        return;
    }
    location = req.query.name;

    try {
        coordinates = await doGPSCoordinatesFromLocation(location);
    }
    catch(e) {
        console.log(e);
        // error
        res.status(400).send(e);
    }

    if (coordinates != null && coordinates.lat && coordinates.lng) {
        res.send(coordinates);
    } else {
        res.status(404).send();
    }
}

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

/* ENHANCED GEOCODING BY GPS */

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

async function getCityFromGPSCoordinates(req, res) {

    let lon;
    let lat;
    let info;
    if (req.query.lon != null) {
        lon = parseFloat(req.query.lon);
        if (lon < -180.0 || lon > 180.0) {
            res.status(400).send("Valid longitude values are between -180 and 180, both inclusive.");
            return;
        }
    }
    if (req.query.lat != null) {
        lat = parseFloat(req.query.lat);
        if (lat < -90.0 || lat > 90.0) {
            res.status(400).send("Valid latitude values are between -90 and 90 (both inclusive).");
            return;
        }
    }

    try {
        info = await doCityFromGPSCoordinates(lon, lat);
    }
    catch(e) {
        console.log(e);
        // error
        res.status(400).send(e);
    }

    if (info != null) {
        res.send(info);
    } else {
        res.status(404).send();
    }
}

exports.home = home;
exports.getCityFromGPSCoordinates = getCityFromGPSCoordinates;
exports.getStoresInRegion = getStoresInRegion;
exports.getGPSCoordinatesFromLocation = getGPSCoordinatesFromLocation;

exports.doGPSCoordinatesFromLocation = doGPSCoordinatesFromLocation; // Required while posting new price
exports.doCityFromGPSCoordinates = doCityFromGPSCoordinates; // Required while posting new price
