<template>
    <v-dialog max-width="900px" max-height="800px" v-model="dialog">
        <v-card flat>
            <v-card-title>
                <v-icon @click="closeDialog" color="red" class="closeIcon">close</v-icon>
            </v-card-title>
            <v-card-text>
                <v-layout column class="mainCol" align-center justify-center>
                    <v-flex xs3 class="productInfos row">
                        <v-flex xs3/>
                        <v-flex xs3 class="headerFlex">
                            <v-label>{{item.name}}</v-label>
                        </v-flex>
                        <v-flex xs3 class="headerFlex">
                            <v-img max-width="120px" :src="item.path"></v-img>
                        </v-flex>
                        <v-flex xs3 class="headerFlex">
                            <v-img :src="require('../assets/n'+item.nutrition_grade_fr.toLowerCase()+'.png')"></v-img>
                        </v-flex>
                        <v-flex xs3/>
                    </v-flex>

                    <v-flex xs3 class="prices row">
                        <v-card class="shopIcons" v-for="(price, index) in item.prices" :key="index">
                            <v-flex xs8>
                                <v-img width="60px" style="margin: 5px" :src="require('../assets/'+price.shop+'.png')"/>
                            </v-flex>
                            <v-flex xs4>
                                <v-label>
                                    {{price.price}}€
                                </v-label>
                            </v-flex>
                        </v-card>
                    </v-flex>

                    <v-flex xs3 class="ingredients row">
                        <v-label v-for="(ingredient, index) in item.ingredients" :key="index">{{ingredient.text + ","}}</v-label>
                    </v-flex>

                    <v-flex xs3 class="row">
                        <v-label>Nutrition facts</v-label>
                    </v-flex>
                </v-layout>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
  name: "ItemModal",
  data: function() {
    return {
      dialog: false,
      item: {
        path:
          "https://images-na.ssl-images-amazon.com/images/I/910uahYmmPL._SY355AA355_PIbundle-40,TopRight,0,0_AA355_SH20_.jpg",
        prices: [
          { shop: "carrefour", price: 5 },
          { shop: "leclerc", price: 10 },
          { shop: "leclerc", price: 10 },
          { shop: "leclerc", price: 10 },
          { shop: "leclerc", price: 10 },
          { shop: "leclerc", price: 10 },
          { shop: "leclerc", price: 10 }
        ],
        ingredients: [
          { text: "Lait" },
          { text: "Beurre" },
          { text: "Oeuf" },
          { text: "Sucre" }
        ],
        name: "chips lays",
        nutrition_grade_fr: "a"
      }
    };
  },
  methods: {
    closeDialog() {
      this.dialog = false;
    },
    dialogClicked() {
      this.dialog = true;
    }
  },
  props: {
    items: Object
  }
};
</script>

<style scoped>
.mainCol {
    height: 75vh;
}
.headerFlex {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
.productInfos {
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: grey solid;
}
.row {
    width: 100%;
    flex-direction: row;
}
.shopIcons {
    margin-left: 5px;
    margin-right: 5px;
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
}
.prices {
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: grey solid;
}
.ingredients {
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: grey solid;
}
.closeIcon {
    position: absolute;
    right: 0;
}
</style>
