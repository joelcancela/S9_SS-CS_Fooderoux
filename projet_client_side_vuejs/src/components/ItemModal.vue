<template>
    <v-dialog max-width="900px" max-height="800px" v-model="dialog">
        <v-card flat>
            <v-card-title>
                <v-icon @click="closeDialog" color="red" class="closeIcon">close</v-icon>
            </v-card-title>
            <v-card-text>
                <v-layout column class="mainCol" align-center justify-center>
                    <v-layout row align-center justify-center class="productInfos">
                        <v-layout column align-center justify-center>
                            <v-label>{{item.name}}</v-label>
                            <v-img width="60px" :src="require('../assets/n'+item.nutrition_grade_fr.toLowerCase()+'.png')"></v-img>
                        </v-layout>
                        <v-img max-width="90px" :src="item.path"></v-img>
                    </v-layout>
                    <v-layout column align-center justify-center>
                        <v-label>Prix</v-label>
                        <v-layout row align-center justify-center>
                            <v-card class="shopIcons" v-for="(price, index) in item.prices" :key="index">
                                <v-layout column align-center justify-center>
                                    <v-img width="60px" :src="require('../assets/'+price.shop+'.png')"/>
                                    <v-label>
                                        {{price.price}}€
                                    </v-label>
                                </v-layout>
                            </v-card>
                        </v-layout>
                    </v-layout>
                    <v-layout row align-center justify-center>
                        <v-label v-for="(ingredient, index) in item.ingredients" :key="index">{{ingredient.text + ","}}</v-label>
                    </v-layout>
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
.shopIcons {
  margin-right: 10px;
}
.closeIcon {
  position: absolute;
  right: 0;
}
.productInfos {
    width: 100%;
}
</style>
