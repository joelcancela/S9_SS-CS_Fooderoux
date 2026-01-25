<template>
    <v-layout column class="mainContainer">
        <v-layout column class="firstContainer">
            <v-flex xs3 class="titleContainer">
                <v-img class="filterImg" width="20%" :src="require('../assets/filter.png')"/>
                <v-label>Trier les résultats</v-label>
            </v-flex>

            <v-flex xs9>
                <v-radio-group class="criterion" v-model="radios" column>
                    <Criterion name="Aucun tri" :imgPath="require('../assets/no.png')"/>
                    <Criterion name="Par nom" :imgPath="require('../assets/name.png')"/>
                    <Criterion name="Par prix" :imgPath="require('../assets/price.png')"/>
                    <Criterion name="Par nutriscore" :imgPath="require('../assets/nutriscore.png')"/>
                </v-radio-group>
            </v-flex>
        </v-layout>

        <v-layout column class="secondContainer">
            <v-flex xs3 class="titleContainer">
                <v-img class="filterImg" width="20%" :src="require('../assets/filter.png')"/>
                <v-label>Filtrer les résultats</v-label>
            </v-flex>

            <v-flex xs9 class="criterionFilter">
                <v-select class="selector" label="Nutriscore" v-on:click:clear="clearSelect()" :items="scores"  v-model="nutriscore"
                          clearable solo></v-select>
                <v-text-field class="selector" label="Quantité" color="#00cc00" v-model="quantity"
                              clearable solo></v-text-field>
                <v-text-field class="selector" label="Ingrédient" color="#00cc00" v-model="ingredient"
                              clearable solo></v-text-field>
                <v-text-field class="selector" label="Additif" color="#00cc00" v-model="additive"
                              clearable solo></v-text-field>
            </v-flex>
        </v-layout>
    </v-layout>
</template>

<script>
import Criterion from "./Criterion";

export default {
    name: "Criterions",
    components: {
        Criterion,
    },
    data: function () {
        return {
            radios: "",
            quantity: "",
            additive: "",
            nutriscore: "",
            ingredient: "",
            scores: ["A", "B", "C", "D", "E"],
        }
    },
    methods: {
        clearSelect(){
            this.sendUpdatedFilters();
        },
        sendUpdatedFilters() {
            this.$emit("update_filters", {
                sortBy: this.radios,
                quantity: this.quantity,
                additive: this.additive,
                nutriscore: this.nutriscore,
                ingredient: this.ingredient
            });
        }
    },
    watch: {
        radios: function() {this.sendUpdatedFilters()},
        quantity: function() {this.sendUpdatedFilters()},
        additive: function() {this.sendUpdatedFilters()},
        nutriscore: function() {this.sendUpdatedFilters()},
        ingredient: function() {this.sendUpdatedFilters()}
    }
};
</script>

<style scoped>
    .mainContainer {
        height: 80vh;
    }
    .firstContainer {
        height: 40vh;
    }
    .secondContainer {
        height: 50vh;
    }
    .filterImg {
        margin-top: 5%;
    }
    .titleContainer {
        display: flex;
        align-items: center;
        flex-direction: column
    }
    .criterion {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        margin-top: 20px!important;
    }
    .criterionFilter {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin-top: 10px!important;
        margin-right: 20px;
    }
    .selector {
        height: 45px!important;
        margin: 5px 10px 5px 10px;
        width: 100%;
    }
</style>
