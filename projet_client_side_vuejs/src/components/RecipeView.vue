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
            <v-expansion-panel-content>
                <div class="addRecipeHeader" slot="header">Créer une recette</div>
                <v-flex class="recipeCreationContent">
                    <v-text-field class="ingredientsCombobox" placeHolder="Entrez le nom" color="#00cc00" v-model="recipeName" solo></v-text-field>
                    <v-combobox
                            class="ingredientsCombobox"
                            v-model="newIngredients"
                            chips
                            placeholder="Entrez les ingrédients"
                            multiple
                            deletable-chips
                            solo
                    >
                        <div slot="append"></div>
                    </v-combobox>
                    <v-dialog v-model="creationError" max-width="500px">
                        <v-card>
                            <v-card-actions class="dialogContent">
                                <div class="errorDialog">Vous devez ajouter le nom et au moins un ingrédient à la recette</div>
                                <v-btn color="primary" flat @click="creationError=false">OK</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-btn @click="createRecipe()" class="creationButton">Créer</v-btn>
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
                recipeName: "",
                newIngredients: [],
                recipes: [],
                displayedRecipes: [],
                creationError: false
            };
        },
        props: {
            filters: Object
        },
        methods: {
            createRecipe() {
                if(this.newIngredients.length === 0 || this.recipeName === "") {
                    this.creationError = true;
                }
                else {
                    client.createRecipe(this.recipeName, this.newIngredients.slice(0, this.newIngredients.length));
                    this.recipeName = "";
                    this.newIngredients = [];
                }
            },
            searchIngredient(ingredient) {
                this.$emit("searchIngredient", ingredient);
            },
            filterRecipes() {
                let newDisplayedRecipes = [];
                if (this.filters.hasOwnProperty("ingredient") && this.filters.ingredient && this.filters.ingredient !== "") {
                    client.getRecipesByName(this.filters.ingredient)
                        .then((recipes) => {
                            if (recipes.ok) return recipes.json();
                            else
                                throw new Error("HTTP response status not code 200 as expected.");
                        })
                        .then((recipesJson) => {
                        newDisplayedRecipes = recipesJson;
                        if (this.filters.hasOwnProperty("ingredientsNumberMax") && this.filters.ingredientsNumberMax && this.filters.ingredientsNumberMax !== "") {
                            newDisplayedRecipes = newDisplayedRecipes.filter((recipe)=>recipe.ingredients.length <= this.filters.ingredientsNumberMax)
                        }
                        this.displayedRecipes = newDisplayedRecipes;
                    });
                }
                else if (this.filters.hasOwnProperty("ingredientsNumberMax") && this.filters.ingredientsNumberMax && this.filters.ingredientsNumberMax !== "") {
                    newDisplayedRecipes = this.recipes.filter((recipe)=>recipe.ingredients.length <= this.filters.ingredientsNumberMax)
                    this.displayedRecipes = newDisplayedRecipes;
                }
                else {
                    this.displayedRecipes = this.recipes;
                }
            }
        },
        mounted() {
            client.getRecipes()
                .then(response => {
                    if (response.ok) return response.json();
                    else
                        throw new Error("HTTP response status not code 200 as expected.");
                }).then(recipesJson => {
                this.recipes = recipesJson.filter((recipe)=>recipe.name);
                this.displayedRecipes = recipesJson.filter((recipe)=>recipe.name);
            });
        },
        watch: {
            filters: function () {
                this.debouncedGetAnswer();
            }
        },
        created: function () {
            this.debouncedGetAnswer = _.debounce(this.filterRecipes, 800);
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

    .addRecipeHeader {
        font-style: italic;
    }
    .ingredientsCombobox {
        width: 95%;
    }
    .recipeCreationContent {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .creationButton {
        width: 25%;
    }
    .errorDialog {
        color: red;
    }
    .dialogContent {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>
