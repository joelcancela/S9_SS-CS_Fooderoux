class Food {
    constructor(food_nosql) {
        this._id = food_nosql._id;
        this.name = food_nosql.product_name_fr || food_nosql.product_name_en || food_nosql.product_name || "#IngrédientMystère";
        this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
        this.serving_size = food_nosql.quantity || food_nosql.serving_size || "";
        this.nutrition_grade = food_nosql.nutrition_grade_fr || food_nosql.nutrition_grades || "";
        this.ingredients = food_nosql.ingredients || food_nosql.ingredients_tags || food_nosql.ingredients_text || food_nosql.ingredients_text_fr || "";
        this.additives = food_nosql.additives || food_nosql.additives_original_tags || [];
        this.nutriments = food_nosql.nutriments || {};
        this.allergens = food_nosql.allergens || food_nosql.allergens_tags || food_nosql.allergens_from_ingredients || food_nosql.traces || [];
        this.vitamins = food_nosql.vitamins_tags || [];
        this.pricing = food_nosql.pricing || [];
        this.setImgUrl(food_nosql);
        this.setScore(food_nosql);
        this.setPricing(food_nosql);
    }

    setImgUrl(item) {
        if (item.images != undefined && item.images.front_fr != undefined) {
            let url = "https://static.openfoodfacts.org/images/products/";
            if (item._id.length == 9) {
                let str = item._id;
                url += str.substring(0, 3) + "/" + str.substring(3, 6) + "/" + str.substring(6) + "/front_fr.";
            } else if (item._id.length == 13 || item._id.length >= 10) {
                let str = item._id;
                url += str.substring(0, 3) + "/" + str.substring(3, 6) + "/" + str.substring(6, 9) + "/" + str.substring(9) + "/front_fr.";
            } else {
                url += item._id + "/front_fr.";
            }
            if (item.images.front_fr.rev != undefined) {
                url += item.images.front_fr.rev + ".";
            }
            if (item.images.front_fr.sizes != undefined) {
                url += "full.jpg";
            }
            this.imgUrl = url;
        } else {
            this.imgUrl = "https://paulinediet.fr/wp-content/uploads/2018/02/fruits.png";
        }
    }

    setScore(item) {
        let nutrition_grade = item["nutrition_grade_fr"] || "c";
        let nb_unknown_ingredients = item["unknown_ingredients_n"] || 0;
        let nb_ingredients_palm_oil_not_sure = item["ingredients_from_or_that_may_be_from_palm_oil_n"] || 0;
        let nb_ing_palm_oil_sure = item["ingredients_from_palm_oil_n"] || 0;
        let allergens_n = item["allergens_tags"] != undefined ? item["allergens_tags"].length : 0;
        switch (nutrition_grade) {
            case "a":
                nutrition_grade = 20;
                break;
            case "b":
                nutrition_grade = 15;
                break;
            case "c":
                nutrition_grade = 10;
                break;
            case "d":
                nutrition_grade = 5;
                break;
            case "e":
                nutrition_grade = 0;
                break;
            default:
                nutrition_grade = 10;
                break;
        }
        let score = (nutrition_grade +
            (15 - nb_unknown_ingredients) +
            (15 - nb_ingredients_palm_oil_not_sure) +
            (15 - nb_ing_palm_oil_sure) +
            (10 - allergens_n)) / 5;
        let score_letter = "d";
        if (score >= 0 && score < 5) {
            score_letter = "e";
        } else if (score >= 5 && score < 10) {
            score_letter = "d";
        } else if (score >= 10 && score < 13) {
            score_letter = "c";
        } else if (score >= 13 && score < 17) {
            score_letter = "b";
        } else if (score >= 17) {
            score_letter = "a";
        }
        this.score = score_letter;
    }

    setPricing(item) {
        let price = 0.0;
        if (item.pricing === undefined) {
            this.avgPrice = price;
            return;
        }
        item.pricing.forEach(function (item) {
            price += parseFloat(item.price);
        });
        price = price / item.pricing.length;

        this.avgPrice = price;
        this.currentPrice = this.avgPrice;
        if (item.currentPrice != undefined && item.currentPrice.price != undefined) {
            this.currentPrice = item.currentPrice.price;
        }
    }
}

module.exports = Food;