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
                            <v-label>{{item.name}}</v-label>
                        </v-flex>
                        <v-flex xs3 class="headerFlex">
                            <v-img max-width="110px" :src="item.path"></v-img>
                        </v-flex>
                        <v-flex xs3 class="headerFlex">
                            <v-flex class="score">
                                <v-img width="70px" :src="require('../assets/n'+item.nutrition_grade_fr.toLowerCase()+'.png')"></v-img>
                                <v-flex class="labels">
                                    <v-label text-center>Nutriscore</v-label>
                                </v-flex>
                            </v-flex>
                            <v-flex class="score">
                                <v-img width="70px" :src="require('../assets/n'+item.nutrition_grade_fr.toLowerCase()+'.png')"></v-img>
                                <v-flex class="labels">
                                    <v-label text-center>Score</v-label>
                                </v-flex>
                            </v-flex>
                        </v-flex>
                        <v-flex xs3/>
                    </v-flex>

                    <v-flex xs3 class="prices row">
                        <v-card class="shopIcons" v-for="(price, index) in item.prices" :key="index">
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
                                <v-text-field class="priceInput" label="Prix en €" color="#00cc00"></v-text-field>
                                <v-btn class="priceButton white--text" color="#00cc00">Ajouter</v-btn>
                            </v-layout>
                        </v-layout>
                    </v-flex>

                    <v-flex xs2 class="ingredients row">
                        <v-chip text-color="white" color="#00cc00" disabled v-for="(ingredient, index) in item.ingredients" :key="index">{{ingredient.text}}</v-chip>
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
            item: {
                path:
                    "https://images-na.ssl-images-amazon.com/images/I/910uahYmmPL._SY355AA355_PIbundle-40,TopRight,0,0_AA355_SH20_.jpg",
                prices: [
                    { shop: "carrefour", price: 5 },
                    { shop: "leclerc", price: 10 },
                    { shop: "leclerc", price: 10 },
                    { shop: "leclerc", price: 10 },
                    { shop: "leclerc", price: 10 },
                    { shop: "leclerc", price: 10 },
                    { shop: "leclerc", price: 10 }
                ],
                ingredients: [
                    { text: "Lait" },
                    { text: "Beurre" },
                    { text: "Oeuf" },
                    { text: "Sucre" }
                ],
                name: "chips lays",
                nutrition_grade_fr: "a"
            },
            stores: ["Leclerc", "Carrefour", "Auchan", "Lidl", "Monoprix"],
        };
    },
    methods: {
        closeDialog() {
            this.dialog = false;
        },
        dialogClicked() {
            this.dialog = true;
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
    display: flex;
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
