<template>
  <v-app>
    <v-content class="home">
      <v-layout column>
        <v-flex xs3>
          <v-layout align-center justify-center class="searchBar" row wrap>
            <v-flex xs2>
              <v-img contain width="50%" :src="coloredIcon"></v-img>
            </v-flex>
            <v-flex xs8>
              <v-text-field
                label="Solo"
                :placeholder="placeholder"
                append-icon="search"
                solo
                hide-details
                v-model="search"
              ></v-text-field>
            </v-flex>
            <v-flex xs2 class="select">
              <v-menu offset-y>
                <v-flex class="selectButton" slot="activator">
                  <flag
                    class="flagIcon"
                    :squared="false"
                    :iso="selectedCountry"
                  />
                  <v-icon color="black">arrow_drop_down</v-icon>
                </v-flex>
                <v-list>
                  <v-list-tile
                    v-for="(country, index) in countries"
                    :key="index"
                    @click="toggle(country)"
                  >
                    <flag class="flagIcon" :squared="false" :iso="country" />
                    <v-label>{{ country }}</v-label>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex xs9>
          <v-layout row>
            <v-flex xs2>
              <Drawer
                v-on:map="changeToMap()"
                v-on:diet="changeToDiet()"
                v-on:recipe="changeToRecipe()"
              />
            </v-flex>
            <v-flex xs8 class="mainItemsContainer">
              <component
                :region="selectedCountry"
                :search="search"
                :filters="filters"
                v-on:searchIngredient="(ingredient) => autoSearch(ingredient)"
                v-bind:is="mainComponent"
              />
            </v-flex>
            <v-flex xs2 class="filterContainer">
              <component
                v-on:update_filters="updateFilters"
                v-bind:is="filtersComponent"
              />
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
import MapView from "../components/MapView";
import RecipeView from "../components/RecipeView";
import RecipeFilters from "../components/RecipeFilters";

export default {
  components: {
    Drawer,
    ItemsGrid,
    Criterions,
    MapView,
    RecipeView,
    RecipeFilters
  },
  data: function() {
    return {
      coloredIcon: require("../assets/diet_Colored.png"),
      placeholder: "Chercher un aliment",
      mainComponent: "ItemsGrid",
      filtersComponent: "Criterions",
      search: "",
      filters: {},
      countries: ["fr", "us", "jp", "mx", "ch", "ie", "es"],
      selectedCountry: "fr"
    };
  },
  methods: {
    isoFromCountry(country) {
      switch (country) {
        case "France":
          return "fr";
        case "Etats-Unis":
          return "us";
        case "Japon":
          return "jp";
        case "Mexique":
          return "mx";
        case "Chine":
          return "cn";
        case "Irlande":
          return "ie";
        case "Espagne":
          return "es";
        default:
          return;
      }
    },
    changeToDiet() {
      this.coloredIcon = require("../assets/diet_Colored.png");
      this.placeholder = "Chercher un aliment";
      this.mainComponent = "ItemsGrid";
      this.filtersComponent = "Criterions";
    },
    changeToRecipe() {
      this.coloredIcon = require("../assets/recipe-book_Colored.png");
      this.placeholder = "Chercher une recette";
      this.mainComponent = "RecipeView";
      this.filtersComponent = "RecipeFilters";
    },
    changeToMap() {
      this.coloredIcon = require("../assets/store_Colored.png");
      this.placeholder = "Chercher un magasin";
      this.mainComponent = "MapView";
      this.filtersComponent = "";
    },
    updateFilters(filters) {
      this.filters = filters;
    },
    autoSearch(ingredient) {
        this.search = ingredient;
        this.changeToDiet();
    }
  }
};
</script>

<style scoped>
.searchBar {
  background-color: #404040;
  padding: 5px 3%;
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
.flagIcon {
  margin-right: 10px;
  height: 16px;
}
.selectButton {
  display: flex;
  flex-direction: row;
  background-color: white !important;
  border-radius: 2px;
  align-items: center;
  justify-content: center;
  padding-left: 5px;
}
.select {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}
.mainItemsContainer {
  background-color: #bfbfbf;
}
.filterContainer {
  background-color: #fafafa;
}
</style>
