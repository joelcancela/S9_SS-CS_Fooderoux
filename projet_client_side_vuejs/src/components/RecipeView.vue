<template>
    <v-layout class="mainContent" column justify-space-between align-center>
        <v-expansion-panel class="panel">
            <v-expansion-panel-content expand-icon="add">
                <div class="addRecipeHeader" slot="header">Créer une recette</div>
                <v-flex class="recipeCreationContent">
                    <v-text-field hide-details class="textField ingredientsCombobox" placeHolder="Entrez le nom" color="#00cc00" v-model="recipeName" solo></v-text-field>
                    <v-flex class="ingredientsRow ingredientsCombobox">
                        <v-text-field
                            hide-details
                            class="textField"
                            v-model="newIngredient"
                            placeholder="Entrez les ingrédients"
                            multiple
                            solo>
                        </v-text-field>
                        <v-btn class="white--text" color="#00cc00" :disabled="newIngredient === ''" @click="addIngredient">Ajouter l'ingrédient</v-btn>
                    </v-flex>
                    <v-flex>
                        <v-chip color="#00cc00" outline @input="removeIngredient(index)" close v-for="(ingredient, index) in newIngredients" :key="index">{{ingredient}}</v-chip>
                    </v-flex>
                    <v-dialog v-model="creationError" max-width="500px">
                        <v-card>
                            <v-card-actions class="dialogContent">
                                <div class="errorDialog">Vous devez ajouter le nom et au moins un ingrédient à la recette.</div>
                                <v-btn color="success" flat @click="creationError=false">OK</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-btn color="#00cc00" @click="createRecipe()" class="white--text creationButton">Créer</v-btn>
                </v-flex>
            </v-expansion-panel-content>

            <v-expansion-panel-content v-for="(recipe,index) in displayedRecipes" :key="index" @input="getRecipePrice(recipe)">
                <div slot="header">{{recipe.name}}</div>
                <v-layout class="ingredients">
                    <v-flex class="ingredients" xs1>
                        <v-icon color="#00cc00" style="margin-left: 35px">comments</v-icon>
                    </v-flex>
                    <v-flex class="ingredients" xs10>
                        <v-chip @click="searchIngredient(ingredient)" class="ingredient"
                                v-for="(ingredient,index) in recipe.ingredients" :key="index">{{ingredient}}
                        </v-chip>
                    </v-flex>
                    <v-flex class="ingredients" xs1>
                        <v-label>{{price}} €</v-label>
                    </v-flex>
                </v-layout>
            </v-expansion-panel-content>
        </v-expansion-panel>

        <v-pagination
                v-model="page"
                :length="totalPages"
                :total-visible="5"
                v-on:next="nextPage"
                v-on:previous="previousPage"
                color="#404040"
                @input="getNextOrPreviousRecipes"
        ></v-pagination>
    </v-layout>
</template>

<script>
    import * as client from "../network/client";

    export default {
        name: "RecipeView",
        data: function () {
            return {
                recipeName: "",
                newIngredient: "",
                newIngredients: [],
                recipes: [],
                displayedRecipes: [],
                creationError: false,
                page: 1,
                totalPages: 0,
                price: -1
            };
        },
        props: {
            filters: Object
        },
        methods: {
            getNextOrPreviousRecipes() {
                client.getRecipes(this.page)
                    .then(response => {
                        if (response.ok) return response.json();
                        else throw new Error("HTTP response status not code 200 as expected.");
                    })
                    .then(recipesJson => {
                        this.recipes = recipesJson.filter((recipe)=>recipe.name);
                        this.displayedRecipes = recipesJson.filter((recipe)=>recipe.name);
                    });
            },
            nextPage() {
                if (this.page <= this.totalPages) {
                    client.getRecipes(this.page)
                        .then(response => {
                            if (response.ok) return response.json();
                            else throw new Error("HTTP response status not code 200 as expected.");
                        })
                        .then(recipesJson => {
                            this.recipes = recipesJson.filter((recipe)=>recipe.name);
                            this.displayedRecipes = recipesJson.filter((recipe)=>recipe.name);
                        });
                }
            },
            previousPage() {
                if (this.page >= 1) {
                    client.getRecipes(this.page)
                        .then(response => {
                            if (response.ok) return response.json();
                            else throw new Error("HTTP response status not code 200 as expected.");
                        })
                        .then(recipesJson => {
                            this.recipes = recipesJson.filter((recipe)=>recipe.name);
                            this.displayedRecipes = recipesJson.filter((recipe)=>recipe.name);
                        });
                }
            },
            addIngredient() {
                this.newIngredients.push(this.newIngredient);
                this.newIngredient = "";
            },
            removeIngredient(index) {
               this.newIngredients.splice(index, 1);
            },
            createRecipe() {
                if(this.newIngredients.length === 0 || this.recipeName === "") {
                    this.creationError = true;
                }
                else {
                    client.createRecipe(this.recipeName, this.newIngredients.slice(0, this.newIngredients.length)).then(()=>{
                        client.getRecipes(this.page)
                            .then(response => {
                                if (response.ok) return response.json();
                                else throw new Error("HTTP response status not code 200 as expected.");
                            })
                            .then(recipesJson => {
                                this.recipes = recipesJson.filter((recipe)=>recipe.name);
                                this.displayedRecipes = recipesJson.filter((recipe)=>recipe.name);
                            });
                    });
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
                            else throw new Error("HTTP response status not code 200 as expected.");
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
                    newDisplayedRecipes = this.recipes.filter((recipe) => recipe.ingredients.length <= this.filters.ingredientsNumberMax);
                    this.displayedRecipes = newDisplayedRecipes;
                }
                else {
                    this.displayedRecipes = this.recipes;
                }
            },
            getRecipePrice(recipe) {
                client.getRecipePrice(recipe._id)
                    .then((res) => {
                        if (res.ok) return res.json();
                        else throw new Error("HTTP response status not code 200 as expected.");
                    })
                    .then((response) => this.price = response.price);
            }
        },
        mounted() {
            client.getRecipesNumber()
                .then(response => {
                    if (response.ok) return response.json();
                    else throw new Error("HTTP response status not code 200 as expected.");
                })
                .then(resJson => {
                    this.totalPages = Math.ceil(resJson.items / 8);
                });
            client.getRecipes(this.page)
                .then(response => {
                    if (response.ok) return response.json();
                    else throw new Error("HTTP response status not code 200 as expected.");
                }).then(recipesJson => {
                    this.recipes = recipesJson.filter((recipe)=>recipe.name);
                    this.displayedRecipes = recipesJson.filter((recipe)=>recipe.name);
                });
        },
        watch: {
            filters: function() {
                this.debouncedGetAnswer();
            }
        },
        created: function() {
            this.debouncedGetAnswer = _.debounce(this.filterRecipes, 800);
        }
    };
</script>

<style scoped>
    .mainContent {
        padding: 10px !important;
        height: 80vh;
    }

    .panel {
        max-height: 70vh;
        overflow-y: auto;
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
    .ingredientsRow {
        display: flex;
        flex-direction: row;
    }
    .textField {
        margin-bottom: 5px;
    }
</style>
