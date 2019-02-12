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
                            <v-label>{{item.product_name_fr}}</v-label>
                        </v-flex>
                        <v-flex xs3 class="headerFlex">
                            <v-img max-width="110px" :src="item.image"></v-img>
                        </v-flex>
                        <v-flex xs3 class="headerFlex">
                            <v-flex class="score">
                                <v-img width="70px" :src="getNutritionImage()"></v-img>
                                <v-flex class="labels">
                                    <v-label text-center>Nutriscore</v-label>
                                </v-flex>
                            </v-flex>
                            <v-flex class="score">
                                <v-img width="70px" :src="getOurScoreImage()"></v-img>
                                <v-flex class="labels">
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

                    <v-flex xs3 class="prices">
                        <v-layout class="column">
                            <v-layout style="padding-top: 20px; padding-bottom: 10px">
                                <v-label>Vous connaissez le prix de l'ingrédient dans un magasin ? Ajoutez le !</v-label>
                            </v-layout>
                            <v-layout class="row">
                                <v-select class="priceInput" :items="stores" label="Magasin" solo></v-select>
                                <v-select class="priceInput" :items="towns" label="Ville" solo></v-select>
                                <v-text-field class="priceInput" label="Prix en €" color="#00cc00"></v-text-field>
                                <v-btn class="priceButton white--text" color="#00cc00">Ajouter</v-btn>
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
export default {
    name: "ItemModal",
    data: function() {
        return {
            dialog: false,
            item: {},
            stores: ["Leclerc", "Carrefour", "Auchan", "Lidl", "Monoprix"],
            towns: ["Antibes", "Nice", "Biot", "Montauroux"],
            prices: [
                { shop: "carrefour", price: 5 },
                { shop: "leclerc", price: 10 },
                { shop: "leclerc", price: 10 },
                { shop: "leclerc", price: 10 },
                { shop: "leclerc", price: 10 },
                { shop: "leclerc", price: 10 },
                { shop: "leclerc", price: 10 }
            ],
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
        }
    },
    props: {
        items: Object
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
.labels {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>
