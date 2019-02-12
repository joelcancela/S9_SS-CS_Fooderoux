const URL = "https://server-side-food-backend.herokuapp.com";

export function getFoods(params) {
    let url = URL + "/api/foods?";
    for (let key in params) {
        url += addToURL(key, params[key]);
    }

    return get(url);
}

export function getFoodFromItemID(itemID) {
    return get(URL + "/api/foods/" + itemID);
}

export function getScoreFromItemID(itemID) {
    return get(URL + "/api/foods/" + itemID + "/score");
}

export function getImageFromItemID(itemID) {
    return get(URL + "/api/foods/" + itemID + "/imageLink");
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