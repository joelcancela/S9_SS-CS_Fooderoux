<template>
    <v-app>
        <v-content class="home">
            <v-layout column>
                <v-flex xs3>
                    <v-layout align-center justify-center class="searchBar" row wrap>
                        <v-flex xs2>
                            <v-img contain width="50%" :src="coloredIcon"></v-img>
                        </v-flex>
                        <v-flex xs10>
                            <v-text-field
                                    label="Solo"
                                    :placeholder="placeholder"
                                    append-icon="search"
                                    solo
                                    hide-details
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-flex>

                <v-flex xs9>
                    <v-layout row>
                        <v-flex xs2>
                            <Drawer v-on:map="changeToMap()" v-on:diet="changeToDiet()" v-on:recipe="changeToRecipe()"/>
                        </v-flex>
                        <v-flex xs8>
                            <component v-bind:is="mainComponent"/>
                        </v-flex>
                        <v-flex xs2>
                            <Criterions/>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-content>
    </v-app>
</template>

<script>
import Drawer from "../components/Drawer";
import ItemsGrid from "../components/ItemsGrid";
import Criterions from "../components/Criterions";
import MapView from "../components/MapView"

export default {
  components: {
    Drawer,
    ItemsGrid,
    Criterions,
    MapView
  },
  data: function() {
    return {
      coloredIcon: require("../assets/diet_Colored.png"),
      placeholder: "Chercher un aliment",
      mainComponent: "ItemsGrid"
    };
  },
  methods: {
    changeToDiet() {
      this.coloredIcon = require("../assets/diet_Colored.png");
      this.placeholder = "Chercher un aliment";
      this.mainComponent = "ItemsGrid";
    },
    changeToRecipe() {
      this.coloredIcon = require("../assets/recipe-book_Colored.png");
      this.placeholder = "Chercher une recette";
      this.mainComponent = "ItemsGrid";
    },
    changeToMap() {
      this.coloredIcon = require("../assets/store_Colored.png");
      this.placeholder = "Chercher un magasin";
      this.mainComponent = "MapView";
    }
  }
};
</script>

<style scoped>
    .searchBar {
        background-color: #404040;
        padding: 5px 10%;
    }

    .home {
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        height: 100%;
        max-height: 100vh;
        overflow: hidden;
        padding-bottom: 1px;
    }
</style>
