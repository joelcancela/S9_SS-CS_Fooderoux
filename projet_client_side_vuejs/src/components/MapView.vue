<template>
    <v-content class="map">
        <gmap-map
                ref="map"
                  :center="center"
                  :zoom="14"
                   style="width:100%;  height: 500px;"
                  :options="{streetViewControl: false, disableDefaultUi: true, mapTypeControl: false ,fullscreenControl: false, panControl: false}"
        >
            <gmap-marker
                    @click="openInfosWindow()"
                    :clickable="true"
                    :draggable="true"
                    :position="center"
                    :icon="generateIcon()"
            >
                <gmap-info-window v-on:closeclick="openInfosWindow()" :opened="openInfos"><v-img width="70px" :src="require('../assets/leclerc.png')"></v-img>Leclerc Antibes</gmap-info-window>
            </gmap-marker>
        </gmap-map>
    </v-content>
</template>

<script>
import { gmapApi } from "vue2-google-maps";
import * as utils from "../utils";
export default {
  name: "MapView",
  data: function() {
    return {
      center: {
        lat: 0,
        lng: 0
      },
      openInfos: false,
      mapLoaded: false
    };
  },
  mounted: function() {
    navigator.geolocation.getCurrentPosition(
      function(location) {
        this.center.lat = location.coords.latitude;
        this.center.lng = location.coords.longitude;
      }.bind(this)
    );
    this.mapLoaded = true;
  },
  methods: {
    openInfosWindow() {
      this.openInfos = !this.openInfos;
    },
    generateIcon() {
      if (this.mapLoaded) {
        try {
            var pinColor = utils.colors[0];
            return new this.google.maps.MarkerImage(
                "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" +
                pinColor,
                new this.google.maps.Size(21, 34),
                new this.google.maps.Point(0, 0),
                new this.google.maps.Point(10, 34)
            );
        } catch (e) {
            console.log("")
        }
      } else {
        return null;
      }
    }
  },
  computed: {
    google: gmapApi
  }
};
</script>

<style scoped>
.map {
  margin-top: 10px;
  margin-left: 10px;
}
</style>
