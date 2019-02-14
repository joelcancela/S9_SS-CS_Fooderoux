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
                    String(store.location.coordinates[0]) +
                    String(store.location.coordinates[1]);
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

function getCityFromGPSCoordinates(req, res) {

    let lon;
    let lat;
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
                console.log(e);
                res.status(400).send(e);
                return;
            }
            res.send(body.address);
        });
}

exports.home = home;
exports.getCityFromGPSCoordinates = getCityFromGPSCoordinates;
exports.getStoresInRegion = getStoresInRegion;