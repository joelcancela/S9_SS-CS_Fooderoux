<template>
  <v-layout class="map">
    <gmap-map
      class="gmap"
      ref="map"
      :center="center"
      :zoom="14"
      :options="{
        streetViewControl: false,
        disableDefaultUi: true,
        mapTypeControl: false,
        fullscreenControl: false,
        panControl: false
      }"
    >
      <gmap-marker
        v-for="(store, index) in stores"
        :key="index"
        @click="openInfosWindow()"
        :clickable="true"
        :draggable="true"
        :position="parsePosition(store.location.coordinates)"
        :icon="generateIcon()"
      >
        <gmap-info-window
          v-on:closeclick="openInfosWindow()"
          :opened="openInfos"
          ><v-img width="70px" :src="require('../assets/leclerc.png')"></v-img
          >Leclerc Antibes</gmap-info-window
        >
      </gmap-marker>
    </gmap-map>
  </v-layout>
</template>

<script>
import { gmapApi } from "vue2-google-maps";
import * as utils from "../utils";
import * as client from "../network/client";
export default {
  name: "MapView",
  props: {
    region: String
  },
  data: function() {
    return {
      center: {
        lat: 0,
        lng: 0
      },
      openInfos: false,
      mapLoaded: false,
      stores: []
    };
  },
  mounted: function() {
    navigator.geolocation.getCurrentPosition(
      function(location) {
        this.center.lat = location.coords.latitude;
        this.center.lng = location.coords.longitude;
        this.mapLoaded = true;
        this.getStores(location.coords.latitude, location.coords.longitude);
      }.bind(this)
    );
  },
  methods: {
    getStores() {
      client.getStoresFromRegion(this.region)
         .then(response => {
             if (response.ok) return response.json();
             else throw new Error("HTTP response status not code 200 as expected.");
         })
         .then((storesJson)=>{
           this.stores = storesJson.stores;
         });
    },
    parsePosition(position) {
      let lat = parseInt(position.lat);
      let lng = parseInt(position.lng);
      return {
        lat,
        lng
      };
    },
    getIso(lat, lng) {},
    getStoresArray(iso) {},
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
          let a;
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
  margin: 10px;
  height: 100%;
  width: 100%;
}
.gmap {
  width: 99%;
  height: 82%;
}
template {
  height: 100%;
  width: 100%;
}

div#content {
  width: 100%;
  height: 100%;
}
</style>
