<template>
  <v-app>
    <v-content>
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

        <v-flex xs9 >
          <v-layout row wrap>
            <v-flex xs2>
              <Drawer v-on:diet="changeToDiet()" v-on:recipe="changeToRecipe()"/>
            </v-flex>
            <v-flex xs10>
              <ItemsGrid></ItemsGrid>
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
export default {
  components: {
    Drawer,
    ItemsGrid
  },
  data: function() {
    return {
      coloredIcon: require("../assets/diet_Colored.png"),
      placeholder: "Chercher un aliment"
    };
  },
  methods: {
    changeToDiet() {
      this.coloredIcon = require("../assets/diet_Colored.png");
      this.placeholder = "Chercher un aliment";
    },
    changeToRecipe() {
      this.coloredIcon = require("../assets/recipe-book_Colored.png");
      this.placeholder = "Chercher une recette";
    }
  }
};
</script>

<style scoped>
.searchBar {
  padding-right: 10%;
  padding-left: 10%;
  background-color: lightslategrey;
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
