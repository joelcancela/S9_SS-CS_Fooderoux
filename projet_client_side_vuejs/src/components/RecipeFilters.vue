<template>
    <v-layout column class="filtersContainer">
        <v-flex xs3 class="titleContainer">
            <v-img class="filterImg" width="20%" :src="require('../assets/filter.png')"/>
            <v-label>Filtrer les résultats</v-label>
        </v-flex>

        <v-flex xs9 class="criterionFilter">
            <v-text-field class="selector" placeHolder="Par ingrédient" color="#00cc00" v-model="ingredient" solo></v-text-field>
            <v-text-field type="number" class="selector" placeholder="Par nombre d'ingrédients" v-model="ingredientsNumberMax" solo></v-text-field>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        name: "RecipeFilters",
        data: function () {
            return {
                ingredient: "",
                ingredientsNumberMax: ""
            }
        },
        methods: {
            sendUpdatedFilters() {
                this.$emit("update_filters", {
                    ingredientsNumberMax: this.ingredientsNumberMax,
                    ingredient: this.ingredient
                });
            }
        },
        watch: {
            ingredientsNumberMax: function () {
                this.sendUpdatedFilters()
            },
            ingredient: function () {
                this.sendUpdatedFilters()
            }
        }
    };
</script>

<style scoped>
    .filtersContainer {
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

    .criterionFilter {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin-top: 10px !important;
        margin-right: 20px;
    }

    .selector {
        height: 45px !important;
        flex: none !important;
        margin: 5px 10px 5px 10px;
        width: 100%;
    }
</style>
