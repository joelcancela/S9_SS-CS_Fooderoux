<template>
    <v-layout column align-center>
        <v-flex xs2>
            <v-img class="filterImg" width="40%" :src="require('../assets/filter.png')"/>
            <v-label>Trier les résultats</v-label>
        </v-flex>
        <v-flex xs10 class="criterionsDiv">
            <v-layout column>
                <Criterion name="nom" :imgPath="require('../assets/name.png')"/>
                <Criterion name="prix" :imgPath="require('../assets/price.png')"/>
                <Criterion name="nutriscore" :imgPath="require('../assets/nutriscore.png')"/>
            </v-layout>
        </v-flex>
    </v-layout>


</template>

<script>
import Criterion from "./Criterion";

export default {
  name: "Criterions",
  components: {
    Criterion
  }
};
</script>

<style scoped>
.filterImg {
  margin-top: 5%;
  margin-left: 25%;
}
.criterionsDiv {
  width: 90%;
  margin-top: 10px;
}
</style>
