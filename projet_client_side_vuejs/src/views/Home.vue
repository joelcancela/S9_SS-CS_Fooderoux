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
                            <Drawer v-on:diet="changeToDiet()" v-on:recipe="changeToRecipe()"/>
                        </v-flex>
                        <v-flex xs8>
                            <ItemsGrid/>
                        </v-flex>
                        <v-flex xs2>
                            <v-layout column align-center>
                                <v-flex xs2>
                                   <v-img class="filterImg" width="40%" :src="require('../assets/filter.png')"/>
                                   <v-label>Filtrer les résultats</v-label>
                                </v-flex>
                                <CriterionsDiv/>
                            </v-layout>
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
import CriterionsDiv from "../components/CriterionsDiv";

export default {
  components: {
    Drawer,
    ItemsGrid,
    CriterionsDiv
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
.filterImg {
  margin-top: 5%;
  margin-left: 25%;
}
.criterionsDiv {
  width: 90%;
  margin-top: 10px;
}
</style>
