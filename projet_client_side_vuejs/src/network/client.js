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

export function getRecipes(page) {
    return get(URL + "/api/recipes?limit=8&page=" + page);
}

export function createRecipe(name, ingredients) {
    return post(URL + "/api/recipes",{"name": name, "ingredients": ingredients});
}

export function getRecipesByName(ingredient) {
    return get(URL + "/api/recipes?contains="+ingredient);
}

export function postPrice(itemID, price, name) {
    return post(URL + "/api/foods/" + itemID + "/pricing", {price: price, store: {name: name}});
}

export function getRecipesNumber() {
    return get(URL + "/api/recipes/stats");
}

export function getRecipePrice(recipeID) {
    return get(URL + "/api/recipes/" + recipeID + "/price");
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
            body: JSON.stringify(body)
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
