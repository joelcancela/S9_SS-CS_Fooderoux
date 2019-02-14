const URL = "https://server-side-food-backend.herokuapp.com";

export function getFoods(params) {
    let url = URL + "/api/foods?";
    for (let key in params) {
        url += addToURL(key, params[key]);
    }

    return get(url);
}

export async function getStoresFromRegion(iso) {
    return await get(URL + "/api/stores/search?region=" + iso);
}

export async function getIsoFromPosition(lat, lng) {
    return get(URL + "/api/regions/resolve?lon=" + lng + "&lat=" + lat);
}

export function getScoreFromItemID(itemID) {
    return get(URL + "/api/foods/" + itemID + "/score");
}

export function getImageFromItemID(itemID) {
    return get(URL + "/api/foods/" + itemID + "/imageLink");
}

export function getPriceFromItemID(itemID) {
    return get(URL + "/api/foods/" + itemID + "/price");
}

export function postPrice(itemID, price, store) {
    return post(URL + "/api/foods/" + itemID + "/price", {price: price, store: store});
}

function get(url) {
    return fetch(url, {
            method: 'get',
            headers: { "Content-Type": "application/json; charset=utf-8" },
        });
}

function post(url, body) {
    return fetch(url, {
            method: 'post',
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: body
        });
}

function addToURL(paramName, param) {
    if (paramName === undefined || param === undefined) {
        return;
    }
    if (param === "") {
        return paramName + "&";
    }
    return paramName + "=" + param + "&";
}
