<template>
    <v-app>
        <v-container class="mainContainer">
            <v-layout column align-center style="height: 100%">
                <v-flex xs10 class="list">
                    <v-layout row wrap>
                        <v-flex
                                v-for="n in 19"
                                :key="n"
                                shrink
                                pa-1
                        >
                            <v-card class="card">
                                <v-img
                                        class="image"
                                        src="https://images-na.ssl-images-amazon.com/images/I/910uahYmmPL._SY355AA355_PIbundle-40,TopRight,0,0_AA355_SH20_.jpg"
                                >
                                </v-img>

                                <v-layout row align-center justify-center>
                                    <v-flex xs9 class="itemName">
                                        <v-label>Chips lays</v-label>
                                    </v-flex>
                                    <v-flex xs3>
                                        <v-checkbox @change="itemSelect" v-model="checkboxes[n]"/>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex xs2>
                    <ComparisonModal :buttonDisabled="selectedItems < 2" :items="results" :itemsSelected="selectedItems"/>
                </v-flex>
            </v-layout>

        </v-container>
    </v-app>
</template>

<script>
import ComparisonModal from "./ComparisonModal";
export default {
  name: "ItemsGrid",
  components: {
    ComparisonModal
  },
  data: function() {
    return {
      results: [
        {
          path:
            "https://images-na.ssl-images-amazon.com/images/I/910uahYmmPL._SY355AA355_PIbundle-40,TopRight,0,0_AA355_SH20_.jpg",
          price: 2,
          name: "chips lays",
          score: "A"
        }
      ],
      checkboxes: this.initCheckboxes(),
      selectedItems: 0
    };
  },
  methods: {
    initCheckboxes() {
      let array = [];
      for (let i = 0; i < 9; i++) {
        array.push(false);
      }
      return array;
    },
    itemSelect(newValue) {
      newValue ? this.selectedItems++ : this.selectedItems--;
    }
  }
};
</script>

<style scoped>
.card {
  width: 148px;
  padding-top: 5px;
  padding-left: 5px;
  padding-right: 5px;
}

.image {
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
}

.itemName {
  margin-left: 10px;
}
.mainContainer {
  padding: 5px;
}
.list {
  max-height: 63%;
  overflow-y: auto;
}
</style>
