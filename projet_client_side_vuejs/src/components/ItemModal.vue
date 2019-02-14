<template>
    <v-dialog max-width="900px" max-height="700px" v-model="dialog">
        <v-card flat>
            <v-card-title>
                <v-icon @click="closeDialog" color="red" class="closeIcon">close</v-icon>
            </v-card-title>
            <v-card-text>
                <v-layout column class="mainCol" align-center justify-center>
                    <v-flex xs4 class="productInfos row">
                        <v-flex xs3/>
                        <v-flex xs3 class="headerFlex">
                            <label class="productName">{{item.product_name_fr}}</label>
                        </v-flex>
                        <v-flex xs3 class="headerFlex">
                            <v-img max-width="110px" :src="item.image"></v-img>
                        </v-flex>
                        <v-flex xs3 class="headerFlex">
                            <v-flex class="score">
                                <v-img width="70px" :src="getNutritionImage()"></v-img>
                                <v-flex class="scoreText">
                                    <v-label text-center>Nutriscore</v-label>
                                </v-flex>
                            </v-flex>
                            <v-flex class="score">
                                <v-img width="70px" :src="getOurScoreImage()"></v-img>
                                <v-flex class="scoreText">
                                    <v-label text-center>Score</v-label>
                                </v-flex>
                            </v-flex>
                        </v-flex>
                        <v-flex xs3/>
                    </v-flex>

                    <v-flex xs3 class="prices row">
                        <v-card class="shopIcons" v-for="(price, index) in prices" :key="index">
                            <v-flex xs8>
                                <v-img width="60px" style="margin: 5px" :src="require('../assets/'+price.shop+'.png')"/>
                            </v-flex>
                            <v-flex xs4>
                                <v-label>
                                    {{price.price}}€
                                </v-label>
                            </v-flex>
                        </v-card>
                    </v-flex>

                    <v-alert v-model="alert" dismissible type="warning" style="width: 100%" transition="scale-transition">
                        Le formulaire n'est pas complet.
                    </v-alert>
                    <v-alert v-model="alertSuccess" dismissible type="success" style="width: 100%" transition="scale-transition">
                        Merci. Nous avons bien reçu l'information.
                    </v-alert>

                    <v-flex xs3 class="prices">
                        <v-layout class="column">
                            <v-layout style="padding-top: 20px; padding-bottom: 10px">
                                <v-label>Vous connaissez le prix de l'ingrédient dans un magasin ? Ajoutez le !</v-label>
                            </v-layout>
                            <v-layout class="row">
                                <v-select class="priceInput" :items="stores" label="Magasin" v-model="storeSelected" solo></v-select>
                                <v-select class="priceInput" :items="towns" label="Ville" v-model="townSelected" solo></v-select>
                                <v-text-field class="priceInput" label="Prix en €" color="#00cc00" v-model="price" type="number"></v-text-field>
                                <v-btn class="priceButton white--text" color="#00cc00" @click="addPrice">Ajouter</v-btn>
                            </v-layout>
                        </v-layout>
                    </v-flex>

                    <v-flex xs2 class="ingredients row text-xs-center">
                        <v-chip text-color="white" color="#00cc00" disabled v-for="(ingredient, index) in getIngredients()" :key="index">
                            {{ingredient}}
                        </v-chip>
                    </v-flex>
                </v-layout>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import _ from 'lodash';
import * as Client from "../network/client"

export default {
    name: "ItemModal",
    data: function() {
        return {
            dialog: false,
            alert: false,
            alertSuccess: false,
            item: {},
            stores: ["Leclerc", "Carrefour", "Auchan", "Lidl", "Monoprix"],
            storeSelected: "",
            towns: ["Antibes", "Nice", "Biot", "Montauroux"],
            townSelected: "",
            prices: [
                { shop: "carrefour", price: 5 },
                { shop: "leclerc", price: 10 },
                { shop: "leclerc", price: 10 },
                { shop: "leclerc", price: 10 },
                { shop: "leclerc", price: 10 },
                { shop: "leclerc", price: 10 },
                { shop: "leclerc", price: 10 }
            ],
            price: ""
        };
    },
    methods: {
        closeDialog() {
            this.dialog = false;
        },
        dialogClicked(item) {
            this.item = item;
            this.dialog = true;
        },
        getNutritionImage() {
            if (this.item.hasOwnProperty("nutrition_grade_fr")) {
                let nutritionScore = this.item.nutrition_grade_fr.toLowerCase();
                return require('../assets/n' + nutritionScore + '.png');
            } else {
                return require('../assets/unknown.png');
            }
        },
        getOurScoreImage() {
            if (this.item.hasOwnProperty("our_score")) {
                let score = this.item.our_score.toLowerCase();
                return require('../assets/n' + score + '.png');
            } else {
                return require('../assets/unknown.png');
            }
        },
        getIngredients() {
            let ingr = [];
            for (let i in this.item.ingredients) {
                if (i === "0") continue;
                ingr.push(this.capitalizeFirstLetter(this.item.ingredients[i].text));
            }

            return ingr;
        },
        capitalizeFirstLetter(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
        addPrice() {
            if (this.storeSelected === "" || this.townSelected === "" || this.price === "") {
                this.alert = true;
                this.debouncedRemoveAlert();
            } else {
                Client.postPrice(this.item.id, parseInt(this.price), this.storeSelected + " " + this.townSelected)
                    .then(() => {
                        this.alert = true;
                        this.debouncedRemoveSuccessAlert()
                    });
            }
        },
        removeAlert() {
            this.alert = false;
        },
        removeSuccessAlert() {
            this.alertSuccess = false;
        }
    },
    props: {
        items: Object
    },
    created: function () {
        this.debouncedRemoveAlert = _.debounce(this.removeAlert, 3000);
        this.debouncedRemoveSuccessAlert = _.debounce(this.removeSuccessAlert, 3000);
    }
};
</script>

<style scoped>
.mainCol {
    height: 75vh;
}
.headerFlex {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100%;
}
.productName {
    font-family: Roboto, Arial, Helvetica, sans-serif;
    font-size: x-large;
    color: dimgrey;
}
.scoreText {
    margin-top: 5px
}
.productInfos {
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: grey solid;
    background-color: #bfbfbf;
}
.row {
    width: 100%;
    flex-direction: row;
}
.column {
    flex-direction: column;
}
.shopIcons {
    margin-left: 5px;
    margin-right: 5px;
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
}
.prices {
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: grey solid;
    width: 100%;
}
.priceInput {
    margin: 10px 20px 10px 0;
}
.priceButton {
    margin: 15px 0 10px 0;
}
.ingredients {
    justify-content: center;
    align-items: center;
}
.closeIcon {
    position: absolute;
    right: 0;
}
.score {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>
