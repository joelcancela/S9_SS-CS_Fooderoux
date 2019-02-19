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
                        <v-icon color="#00cc00" style="margin-left: 35px" @click="displayDialog(recipe)">comments</v-icon>
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

        <v-flex class="pagination">
            <v-btn :disabled="page === 1" @click="previousPage" class="pagButton"> <i aria-hidden="true" class="v-icon material-icons theme--light">chevron_left</i>  </v-btn>
            <v-btn color="#404040" class="pagButton white--text">{{page}}</v-btn>
            <v-btn @click="nextPage" class="pagButton"> <i aria-hidden="true" class="v-icon material-icons theme--light">chevron_right</i> </v-btn>
        </v-flex>

        <v-dialog v-model="dialog" width="500">
            <v-card>
                <v-card-title class="headline grey lighten-2" primary-title>
                    Commentaires
                </v-card-title>

                <v-card-text>
                    <v-layout v-for="comment in selectedRecipe.comments" style="margin-bottom: 20px">
                        <v-label>
                            {{comment.username}} : {{comment.text}}
                        </v-label>
                    </v-layout>

                    <v-textarea label="Avis" color="#00cc00" v-model="comment" solo clearable hide-details></v-textarea>

                    <v-layout style="margin-top: 5px">
                        <v-text-field label="Nom d'utilisateur" color="#00cc00" v-model="username" solo clearable hide-details></v-text-field>
                        <v-btn class="white--text" color="#00cc00" @click="sendComment">Ajouter</v-btn>
                    </v-layout>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="#404040" flat @click="dialog = false">
                        Fermer
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
                price: -1,
                dialog: false,
                selectedRecipe: {},
                comment: "",
                username: ""
            };
        },
        props: {
            filters: Object,
            search: String
        },
        methods: {
            nextPage() {
                this.page++;
                if(!this.filterRecipes(this.page)){
                    this.page--;
                }
            },
            previousPage() {
                if(this.page >= 1) {
                    this.page--;
                    this.filterRecipes(this.page);
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
            filterByName(name) {
                if(name) {
                    client.getRecipes(this.page, name)
                        .then((response) => {
                            if (response.ok) return response.json();
                            else throw new Error("HTTP response status not code 200 as expected.");
                        })
                        .then((responseJson) => {
                            this.displayedRecipes = this.filterByIngredientsNumber(responseJson.filter((recipe)=>recipe.name));
                            this.recipes = responseJson.filter((recipe)=>recipe.name);
                        });
                }
                else {
                    this.getAllRecipes();
                    this.displayedRecipes = this.filterByIngredientsNumber(this.recipes);
                }

            },
            filterByIngredientsName(name) {
                if (this.filters.hasOwnProperty("ingredient") && this.filters.ingredient && this.filters.ingredient !== "") {
                    client.getRecipesByIngredient(this.filters.ingredient, this.page, name)
                        .then((response) => {
                            if (response.ok) return response.json();
                            else throw new Error("HTTP response status not code 200 as expected.");
                            })
                        .then((responseJson) => {
                            this.displayedRecipes = this.filterByIngredientsNumber(responseJson.filter((recipe)=>recipe.name));
                            this.recipes = responseJson.filter((recipe)=>recipe.name);
                        });
                }
                else {
                    this.filterByName(name);
                }
            },
            filterByIngredientsNumber(newDisplayedRecipes) {
                if (this.filters.hasOwnProperty("ingredientsNumberMax") && this.filters.ingredientsNumberMax && this.filters.ingredientsNumberMax !== "") {
                    let result = newDisplayedRecipes.filter((recipe) => recipe.ingredients.length <= this.filters.ingredientsNumberMax);
                    return result;
                }
                else {
                    return newDisplayedRecipes;
                }
            },
            async filterRecipes(page) {
                let name = this.search === "" ? undefined : this.search;
                this.page = page ? page : 1;
                this.filterByIngredientsName(name);
                return true;
            },
            getRecipePrice(recipe) {
                client.getRecipePrice(recipe._id)
                    .then((res) => {
                        if (res.ok) return res.json();
                        else throw new Error("HTTP response status not code 200 as expected.");
                    })
                    .then((response) => this.price = response.price);
            },
            getAllRecipes() {
                let name = this.search === "" ? undefined : this.search;
                client.getRecipes(this.page, name)
                    .then(response => {
                        if (response.ok) return response.json();
                        else
                            throw new Error("HTTP response status not code 200 as expected.");
                    }).then(recipesJson => {
                    this.recipes = recipesJson.filter((recipe) => recipe.name);
                    this.displayedRecipes = recipesJson.filter((recipe) => recipe.name);
                });
            },
            displayDialog(recipe) {
                this.selectedRecipe = recipe;
                this.dialog = true;
            },
            sendComment() {
                const user = (this.username === "" || this.username === undefined || this.username === null) ? "Moi" : this.username;
                this.selectedRecipe.comments.push({username: user, text: this.comment});
                client.postComment(this.selectedRecipe._id, user, this.comment);
                this.comment = "";
            }
        },
        mounted() {
            this.getAllRecipes()
        },
        watch: {
            filters: function() {
                this.debouncedGetAnswer();
            },
            search: function () {
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
    .pagButton {
        min-width: 0!important;
        border-radius: 5px;
    }
</style>
