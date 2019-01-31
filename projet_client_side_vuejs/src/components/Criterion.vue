<template>
    <v-flex class="criterion" :style="dynamicStyle">
        <v-layout @click="criterionClick()" row align-center justify-center>
            <v-flex xs2 class="icons">
                <v-img :src="imgPath"></v-img>
            </v-flex>
            <v-flex class="labelFlex" xs8>
                <v-label>
                    Par {{name}}
                </v-label>
            </v-flex>
            <v-flex xs2>
                <v-icon dark v-if="itemSelected" class="checkIcon" color="green">check_box</v-icon>
                <v-icon v-else class="checkIcon" color="lightgrey">check_box_outline_blank</v-icon>
            </v-flex>
        </v-layout>
    </v-flex>
</template>

<script>
export default {
  name: "Criterion",
  data: function() {
    return {
      itemSelected: false
    };
  },
  computed: {
    dynamicStyle() {
      return this.itemSelected
        ? "border-color: black; border-style: solid; background-color: white"
        : "border-style: solid; border-color: transparent";
    }
  },
  props: {
    imgPath: String,
    name: String
  },
  methods: {
    criterionClick() {
      this.itemSelected = !this.itemSelected;
    }
  }
};
</script>

<style scoped>
.criterion {
  border-radius: 5px;
  height: 60px;
  margin-bottom: 10px;
  padding-top: 10px;
  padding-left: 10px;
}
.icons {
  padding-bottom: 5px;
  margin-right: 5px;
}
.labelFlex {
  margin-left: 10px;
}
.checkIcons {
}
</style>
