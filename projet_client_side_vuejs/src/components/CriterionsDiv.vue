<template>
    <v-flex xs10 class="criterionsDiv">
        <v-layout column>
            <v-flex class="criterion" :style="nameStyle">
                <v-layout @click="criterionClick('name')" row align-center justify-center>
                    <v-flex xs8 class="labelDiv">
                        <v-label>
                            Par nom
                        </v-label>
                    </v-flex>
                    <v-flex xs4>
                        <v-icon v-if="nameSelected" class="checkIcon" color="green">check_circle_outline</v-icon>
                        <v-icon v-else class="checkIcon" color="lightgrey">cancel</v-icon>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex class="criterion" :style="priceStyle">
                <v-layout @click="criterionClick('price')" row align-center justify-center>
                    <v-flex xs8>
                        <v-label>
                            Par prix
                        </v-label>
                    </v-flex>
                    <v-flex xs4>
                        <v-icon v-if="priceSelected" class="checkIcon" color="green">check_circle_outline</v-icon>
                        <v-icon v-else class="checkIcon" color="lightgrey">cancel</v-icon>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex class="criterion" :style="nutriscoreStyle">
                <v-layout @click="criterionClick('nutriscore')" row align-center justify-center>
                    <v-flex xs8 :style="!this.nutriscoreSelected? {marginTop: '2%'} : null">
                        <v-label>
                            Par nutriscore
                        </v-label>
                    </v-flex>
                    <v-flex xs4>
                        <v-icon v-if="nutriscoreSelected" class="checkIcon" color="green">check_circle_outline</v-icon>
                        <v-icon v-else class="checkIcon" color="lightgrey">cancel</v-icon>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-flex>

</template>

<script>
export default {
  name: "Criterion",
  data: function() {
    return {
      nameSelected: false,
      nutriscoreSelected: false,
      priceSelected: false
    };
  },
  methods: {
    criterionClick(category) {
      this[category + "Selected"] = !this[category + "Selected"];
    }
  },
  computed: {
    nameStyle() {
      return this.nameSelected
        ? "background-color: lightgray"
        : "background-color: white";
    },
    priceStyle() {
      return this.priceSelected
        ? "background-color: lightgray"
        : "background-color: white";
    },
    nutriscoreStyle() {
      return this.nutriscoreSelected
        ? "background-color: lightgray"
        : "background-color: white";
    }
  }
};
</script>

<style scoped>
.criterion {
  border-style: solid;
  border-color: black;
  border-radius: 5px;
  height: 50px;
  margin-bottom: 10px;
  padding-top: 10px;
  padding-left: 10px;
}
.checkIcon {
  margin-left: 50%;
}
</style>
