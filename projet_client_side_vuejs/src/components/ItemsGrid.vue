<template>
    <v-app>
        <v-container class="mainContainer">
            <v-layout column align-center style="height: 100%">
                <v-flex xs10 class="list">
                    <v-layout row wrap>
                        <v-flex v-for="(item, n) of items" :key="n" shrink pa-1>
                            <v-card @click="dialogClicked(item)" class="card">
                                <v-img height="120px" class="image" :src="item.imgUrl"></v-img>

                                <v-layout row align-center justify-center>
                                    <v-flex xs9 class="itemName">
                                        <label class="productName">{{item.name}}</label>
                                    </v-flex>
                                    <v-flex xs3 v-on:click.stop>
                                        <v-checkbox @change="itemSelect" v-model="item.selected" color="#00cc00"/>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>

                        <ItemModal ref="ItemModal" v-on:closeDialog="dialogClicked()" :dialog="dialog"/>
                    </v-layout>
                </v-flex>

                <v-flex xs2 class="comparisonButton">
                    <v-flex class="bottomDiv">
                        <ComparisonModal :buttonDisabled="selectedItems < 2" :items="getSelectedItems()" :itemsSelected="selectedItems"/>
                        <v-flex class="pagination">
                            <v-btn :disabled="page === 1" @click="previousPage" class="pagButton"> <i aria-hidden="true" class="v-icon material-icons theme--light">chevron_left</i>  </v-btn>
                            <v-btn color="#404040" class="pagButton white--text">{{page}}</v-btn>
                            <v-btn @click="nextPage" class="pagButton"> <i aria-hidden="true" class="v-icon material-icons theme--light">chevron_right</i> </v-btn>
                        </v-flex>
                    </v-flex>
                </v-flex>
            </v-layout>
        </v-container>
    </v-app>
</template>

<script>
    import ComparisonModal from "./ComparisonModal";
    import ItemModal from "./ItemModal";
    import * as Client from "../network/client"
    import _ from 'lodash';

    export default {
        name: "ItemsGrid",
        components: {
            ComparisonModal,
            ItemModal
        },
        props: {
            search: String,
            filters: Object
        },
        data: function() {
            return {
                items: this.getAliments(this.page),
                checkboxes: this.initCheckboxes(),
                selectedItems: 0,
                dialog: false,
                page: 1,
            };
        },
        methods: {
            nextPage() {
                this.page+=1;
                this.getAliments(this.page)
            },
            previousPage() {
                if(this.page > 1) {
                    this.page-=1;
                    this.getAliments(this.page)
                }
            },
            getAliments(page) {
                Client.getFoods(this.generateParams(page, 20))
                    .then((response) => {
                        if (response.ok) return response.json();
                        else throw new Error("HTTP response status not code 200 as expected.");
                    })
                    .then((response) => {
                        for (let i in response) {
                            response[i].selected = false;
                        }
                        this.items = response;
                    })
                    .catch((error) => console.log(error));
            },
            getSelectedItems() {
                return this.items === undefined ? [] : this.items.filter(item => item.selected);
            },
            initCheckboxes() {
                let array = [];
                for (let i = 0; i < 9; i++) {
                    array.push(false);
                }
                return array;
            },
            itemSelect(newValue) {
                newValue ? this.selectedItems++ : this.selectedItems--;
            },
            dialogClicked(item) {
                this.$refs.ItemModal.dialogClicked(item);
            },
            generateParams(page, limit) {
                let params = {name: this.search};
                limit ? params["limit"] = limit : null;
                page ? params["page"] = page : null;
                if (this.filters.hasOwnProperty("quantity") && this.filters.quantity !== "" && this.filters.quantity !== null) {
                    params.quantity = this.filters.quantity;
                }
                if (this.filters.hasOwnProperty("ingredient") && this.filters.ingredient !== "" && this.filters.ingredient !== null) {
                    params.ingredients = this.filters.ingredient;
                }
                if (this.filters.hasOwnProperty("additive") && this.filters.additive !== "" && this.filters.additive !== null) {
                    params.additives = this.filters.additive;
                }
                if (this.filters.hasOwnProperty("nutriscore") && this.filters.nutriscore && this.filters.nutriscore !== "") {
                    params["nutrition_score"] = this.filters.nutriscore.toLowerCase();
                }
                if (this.filters.hasOwnProperty("sortBy") && this.filters.sortBy !== "") {
                    params.sortBy = this.filters.sortBy;
                }
                return params;
            }
        },
        watch: {
            search: function () {
                this.debouncedGetAnswer();
            },
            filters: function () {
                this.debouncedGetAnswer();
            }
        },
        created: function () {
            this.debouncedGetAnswer = _.debounce(this.getAliments, 500);
        }
    };
</script>

<style scoped>
    .mainContainer {
        background-color: #bfbfbf;
        padding: 5px;
        max-height: 85vh;
        position: absolute;
        top: 0;
    }
    .list {
        max-height: 75vh;
        overflow-y: auto;
    }
    .card {
        width: 150px;
        height: 200px;
        padding-top: 5px;
        padding-left: 5px;
        padding-right: 5px;
    }
    .image {
        margin-top: 10px;
        margin-left: 10px;
        margin-right: 10px;
    }
    .itemName {
        margin-left: 10px;
    }
    .productName {
        font-family: Roboto, Arial, Helvetica, sans-serif;
        font-size: small;
    }
    .comparisonButton {
        width: 100%;
    }
    .bottomDiv {
        display: flex;
        flex-direction: row;
        width: 100%;
    }
    .pagButton {
        min-width: 0!important;
        border-radius: 5px;
    }
</style>
