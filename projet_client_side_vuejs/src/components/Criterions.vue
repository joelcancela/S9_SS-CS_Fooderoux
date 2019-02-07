<template>
    <v-layout column align-center>
        <v-flex xs2>
            <v-img class="filterImg" width="40%" :src="require('../assets/filter.png')"/>
            <v-label>Trier les résultats</v-label>
        </v-flex>
        <v-flex xs10 class="criterionsDiv">
            <v-radio-group class="radiosGroup" v-model="radios" column>
                <Criterion name="aucun" :imgPath="require('../assets/name.png')"></Criterion>
                <Criterion name="nom" :imgPath="require('../assets/name.png')"/>
                <Criterion name="prix" :imgPath="require('../assets/price.png')"/>
                <Criterion name="nutriscore" :imgPath="require('../assets/nutriscore.png')"/>
                <Criterion name="score" :imgPath="require('../assets/nutriscore.png')"/>
            </v-radio-group>
        </v-flex>
    </v-layout>


</template>

<script>
import Criterion from "./Criterion";

export default {
  name: "Criterions",
  components: {
    Criterion
  },
  data: function () {
      return {
          radios: 'aucun'
      }
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
.radiosGroup {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
}
</style>
