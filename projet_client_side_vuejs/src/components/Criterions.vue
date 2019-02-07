<template>
    <v-layout column>
        <v-flex xs1 class="titleContainer">
            <v-img class="filterImg" width="20%" :src="require('../assets/filter.png')"/>
            <v-label>Trier les résultats</v-label>
        </v-flex>

        <v-flex xs5>
            <v-radio-group class="criterion" v-model="radios" column>
                <Criterion name="Aucun tri" :imgPath="require('../assets/no.png')"/>
                <Criterion name="Par nom" :imgPath="require('../assets/name.png')"/>
                <Criterion name="Par prix" :imgPath="require('../assets/price.png')"/>
                <Criterion name="Par nutriscore" :imgPath="require('../assets/nutriscore.png')"/>
                <Criterion name="Par score" :imgPath="require('../assets/nutriscore.png')"/>
            </v-radio-group>
        </v-flex>

        <v-flex xs1 class="titleContainer">
            <v-img class="filterImg" width="20%" :src="require('../assets/filter.png')"/>
            <v-label>Filtrer les résultats</v-label>
        </v-flex>

        <v-flex xs5 class="criterionFilter">
            <v-text-field class="selector" label="Quantité"></v-text-field>
            <v-select class="selector" :items="stores" label="Magasin" solo></v-select>
            <v-select class="selector" :items="nutriscores" label="Nutriscore" solo></v-select>
            <v-select class="selector" :items="scores" label="Score" solo></v-select>
        </v-flex>
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
            radios: 'Aucun tri',
            amount: ["-- Quantité --", "100g", "150g", "250g", "500g", "1kg"],
            stores: ["-- Magasin --", "Leclerc", "Carrefour", "Auchan", "Lidl", "Monoprix"],
            nutriscores: ["-- Nutriscore --", "A", "B", "C", "D", "E"],
            scores: ["-- Score --", "A", "B", "C", "D", "E"],
        }
    }
};
</script>

<style scoped>
    .filterImg {
      margin-top: 5%;
      margin-bottom: 5%;
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
        margin-top: 10px!important;
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
