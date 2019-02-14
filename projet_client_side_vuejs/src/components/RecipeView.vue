<template>
    <v-content class="mainContent">
        <v-expansion-panel class="panel">
            <v-expansion-panel-content
                    v-for="(recipe,index) in displayedRecipes"
                    :key="index"
            >
                <div slot="header">{{recipe.name}}</div>
                <v-flex class="ingredients">
                    <v-chip @click="searchIngredient(ingredient)" class="ingredient"
                            v-for="(ingredient,index) in recipe.ingredients" :key="index">{{ingredient}}
                    </v-chip>
                </v-flex>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-content>
</template>

<script>
    import * as client from "../network/client";

    export default {
        name: "RecipeView",
        data: function () {
            return {
                recipes: [],
                displayedRecipes: []
            };
        },
        props: {
            filters: Object
        },
        methods: {
            searchIngredient(ingredient) {
                this.$emit("searchIngredient", ingredient);
            },
            filterRecipes() {

            }
        },
        mounted() {
            client.getRecipes()
                .then(response => {
                    if (response.ok) return response.json();
                    else
                        throw new Error("HTTP response status not code 200 as expected.");
                }).then(recipesJson => {
                console.log(recipesJson);
                this.recipes = recipesJson;
                this.displayedRecipes = recipesJson;
            });
        },
        watch: {
            filters: function () {
                this.debouncedGetAnswer();
            }
        },
        created: function () {
            this.debouncedGetAnswer = _.debounce(this.filterRecipes(), 800);
        }
    };
</script>

<style scoped>
    .mainContent {
        padding: 10px !important;
    }

    .ingredients {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .ingredient {
        width: auto !important;
    }
</style>
