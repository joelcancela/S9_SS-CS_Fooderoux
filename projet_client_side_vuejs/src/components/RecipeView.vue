<template>
    <v-content class="mainContent">
        <v-expansion-panel class="panel">
            <v-expansion-panel-content
                    v-for="(item,i) in 5"
                    :key="i"
            >
                <div slot="header">Macaronis and cheese</div>
                <v-flex class="ingredients">
                    <v-chip class="ingredient" v-for="(ingredient,index) in ingredients" :key="index">{{ingredient}}</v-chip>
                </v-flex>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-content>
</template>

<script>
export default {
  name: "RecipeView",
  data: function() {
    return {
      ingredients: ["macaronis", "cheddar", "beurre", "farine", "lait"]
    };
  }
};
</script>

<style scoped>
.mainContent {
  padding: 10px !important;
}
.ingredients {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
.ingredient {
    width: auto !important;
}
</style>
