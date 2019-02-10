<template>
    <v-layout row>
        <v-dialog class="mainContainer" :disabled="buttonDisabled" v-model="dialog" max-width="80%">
            <v-btn slot="activator" color="#404040" class="white--text">Comparer</v-btn>
            <v-card flat>
                <v-card-title>
                    <v-icon @click="closeDialog" color="red" class="closeIcon">close</v-icon>
                </v-card-title>
                <v-divider></v-divider>

                <v-card-text class="modalContainer py-0">
                    <v-flex class="column c0">
                        <v-layout justify-center align-center xs3 class="comparisonItem comparisonItemSmall odd legend">
                            <v-label>Nom</v-label>
                        </v-layout>
                        <v-layout justify-center align-center xs3 class="comparisonItem comparisonItemBig even legend">
                            <v-label>Photo</v-label>
                        </v-layout>
                        <v-layout justify-center align-center xs3 class="comparisonItem comparisonItemSmall odd legend">
                            <v-label>Prix</v-label>
                        </v-layout>
                        <v-layout justify-center align-center xs3 class="comparisonItem comparisonItemBig even legend">
                            <v-label>Nutriscore</v-label>
                        </v-layout>
                        <v-layout justify-center align-center xs3 class="comparisonItem comparisonItemBig odd legend">
                            <v-label>Score</v-label>
                        </v-layout>
                    </v-flex>

                    <v-flex class="productsTable">
                        <v-flex grow v-for="n in itemsSelected" class="column c1" :key="n">
                            <v-flex justify-center align-center class="comparisonItem comparisonItemSmall odd values">
                                <v-label>{{items[0].name}}</v-label>
                            </v-flex>
                            <v-flex justify-center align-center class="comparisonItem comparisonItemBig even values">
                                <v-img max-width="80px" :src="items[0].path"></v-img>
                            </v-flex>
                            <v-flex justify-center align-center class="comparisonItem comparisonItemSmall odd values">
                                <v-label>{{items[0].price}}</v-label>
                            </v-flex>
                            <v-flex justify-center align-center class="comparisonItem comparisonItemBig even values">
                                <v-img max-width="80px" :src="require('../assets/n'+items[0].score.toLowerCase()+'.png')"></v-img>
                            </v-flex>
                            <v-flex justify-center align-center class="comparisonItem comparisonItemBig odd values">
                                <v-img max-width="80px" :src="require('../assets/n'+items[0].score.toLowerCase()+'.png')"></v-img>
                            </v-flex>
                        </v-flex>
                    </v-flex>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    export default {
        name: "ComparisonModal",
        data: function() {
            return {
                dialog: false
            };
        },
        props: {
            items: Array,
            buttonDisabled: Boolean,
            itemsSelected: Number
        },
        methods: {
            closeDialog() {
                this.dialog = false;
            }
        }
    };
</script>

<style scoped>
    .mainContainer {
        display: flex !important;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .closeIcon {
        position: absolute;
        right: 0;
    }
    .column {
        border-right: #00cc00 solid;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 75vh;
    }
    .c0 {
        flex: none !important;
    }
    .values {
        width: -moz-available;
        width: -webkit-fill-available;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        flex-flow: row wrap;
    }
    .legend {
        width: 10vw;
        background-color: #404040!important;
    }
    .c1 {
        width: 20vw;
    }
    .odd {
        background-color: #cfcfcf;
    }
    .even {
        background-color: #e2e2e2;
    }
    .comparisonItemBig {
        height: 20vh;
    }
    .comparisonItemSmall {
        height: 10vh;
    }
    .comparisonItem {
        border-bottom: solid #00cc00;
    }
    .modalContainer {
        display: flex;
        flex-direction: row;
        height: 85vh;
        overflow-y: hidden;
    }
    .productsTable {
        overflow-y: hidden;
        overflow-x: auto;
        display: flex;
        flex-direction: row;
    }
</style>
