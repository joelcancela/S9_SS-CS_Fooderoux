<template>
    <v-app>
        <v-content class="navigationContainer">
            <v-layout column >
                <v-flex class="item">
                   <v-layout row @click="emitIcon('diet')" align-center justify-center>
                       <v-flex xs4>
                           <v-img class="catImg" width="60%" :src="require('../assets/diet.png')"></v-img>
                       </v-flex>
                       <v-flex xs8>
                           <v-list-tile-title class="catName">Aliments</v-list-tile-title>
                       </v-flex>
                   </v-layout>
                </v-flex>
                <v-flex class="item">
                    <v-layout row @click="emitIcon('recipe')" align-center justify-center>
                        <v-flex xs4>
                            <v-img class="catImg" width="60%" :src="require('../assets/recipe-book.png')"></v-img>
                        </v-flex>
                        <v-flex xs8>
                            <v-list-tile-title class="catName">Recettes</v-list-tile-title>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex class="item">
                    <v-layout row @click="emitIcon('map')" align-center justify-center>
                        <v-flex xs4>
                            <v-img class="catImg" width="60%" :src="require('../assets/store.png')"></v-img>
                        </v-flex>
                        <v-flex xs8>
                            <v-list-tile-title class="catName">Magasins</v-list-tile-title>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-content>
    </v-app>
</template>

<script>
    export default {
        name: "Drawer",
        methods: {
            emitIcon(name) {
                this.$emit(name);
            }
        }
    };
</script>

<style scoped>
    .item {
        padding-bottom: 5%;
        padding-top: 5%;
        border-bottom-style: solid;
        border-bottom-color: white;
    }
    .catName {
        color: white;
        font-family: Roboto, Arial, Helvetica, sans-serif;
        font-size: large;
    }
    .catImg {
        margin-left: 15px;
    }
    .navigationContainer {
        background-color: #00cc00;
    }
</style>
