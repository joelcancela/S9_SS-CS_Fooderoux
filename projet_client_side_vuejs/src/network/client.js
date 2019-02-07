const URL = "http://localhost:3000";

export function getFoods(params) {
    let url = URL + "/api/foods?";
    for (let key in params) {
        url += addToURL(key, params[key]);
    }

    return get(
        url,
        (res) => {console.log(res)}
        );
}

export function getFoodFromItemID(itemID) {
    return get(
        URL + "/api/foods/" + itemID,
        (res) => {console.log(res)}
    );
}

export function getScoreFromItemID(itemID) {
    return get(
        URL + "/api/foods/" + itemID + "/score",
        (res) => {console.log(res)}
    );
}

export function getImageFromItemID(itemID) {
    return get(
        URL + "/api/foods/" + itemID + "/imageLink",
        (res) => {console.log(res)}
    );
}

function get(url, callback) {
    return fetch(url, {
            method: 'get',
            headers: { "Content-Type": "application/json; charset=utf-8" },
        })
        .then(response => response.json())
        .then(resJson => callback(resJson))
        .catch(err => console.error(err));
}

function post(url, body) {
    return fetch(url, {
            method: 'post',
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: body
        })
        .catch(err => console.error(err));
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