<template>
    <v-app>
        <v-container class="mainContainer">
            <v-layout column align-center style="height: 100%">
                <v-flex xs10 class="list">
                    <v-layout row wrap>
                        <v-flex v-for="(item, n) of items" :key="n" shrink pa-1>
                            <v-card @click="dialogClicked()" class="card">
                                <v-img height="120px" class="image" :src="item.image"></v-img>

                                <v-layout row align-center justify-center>
                                    <v-flex xs9 class="itemName">
                                        <v-label>{{item.product_name}}</v-label>
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
                    <ComparisonModal :buttonDisabled="selectedItems < 2" :items="getSelectedItems()" :itemsSelected="selectedItems"/>
                </v-flex>
            </v-layout>
        </v-container>
    </v-app>
</template>

<script>
    import ComparisonModal from "./ComparisonModal";
    import ItemModal from "./ItemModal";
    import * as Client from "../network/client"

    export default {
        name: "ItemsGrid",
        components: {
            ComparisonModal,
            ItemModal
        },
        data: function() {
            return {
                items: this.getAliments(),
                checkboxes: this.initCheckboxes(),
                selectedItems: 0,
                dialog: false
            };
        },
        methods: {
            getAliments() {
                Client.getFoods({name: ""})
                    .then((response) => {
                        if (response.ok) return response.json();
                        else throw new Error("HTTP response status not code 200 as expected.");
                    })
                    .then((response) => {
                        for (let i in response) {
                            response[i].image = "https://paulinediet.fr/wp-content/uploads/2018/02/fruits.png";
                            response[i].selected = false;
                            this.getItemImage(response[i].id, i);
                            this.getAverageItemPrice(response[i].id, i);
                            this.getOurItemScore(response[i].id, i);
                        }
                        this.items = response;
                    })
                    .catch((error) => console.log(error));
            },
            getItemImage(itemId, index) {
                Client.getImageFromItemID(itemId)
                    .then((response) => {
                        if (response.ok) return response.json();
                        else throw new Error("HTTP response status not code 200 as expected.");
                    })
                    .then((response) => {
                        this.items[index].image = response.link;
                    })
                    .catch(() => {});
            },
            getAverageItemPrice(itemId, index) {
                Client.getPriceFromItemID(itemId)
                    .then((response) => {
                        if (response.ok) return response.json();
                        else throw new Error("HTTP response status not code 200 as expected.");
                    })
                    .then((response) => {
                        this.items[index].price = response.item.price + "€";
                    })
                    .catch(() => {
                        this.items[index].price = "Inconnu"
                    });
            },
            getOurItemScore(itemId, index) {
                Client.getScoreFromItemID(itemId)
                    .then((response) => {
                        if (response.ok) return response.json();
                        else throw new Error("HTTP response status not code 200 as expected.");
                    })
                    .then((response) => {
                        this.items[index].our_score = response.score;
                    })
                    .catch(() => {});
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
            dialogClicked() {
                this.$refs.ItemModal.dialogClicked();
            }
        }
    };
</script>

<style scoped>
    .mainContainer {
        background-color: #bfbfbf;
        padding: 5px;
    }
    .list {
        max-height: 75vh;
        overflow-y: auto;
    }
    .card {
        width: 150px;
        height: 220px;
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
    .comparisonButton {
        height: 5vh;
        margin-top: 10px;
    }
</style>
