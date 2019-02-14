import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import * as VueGoogleMaps from "vue2-google-maps";
import FlagIcon from "vue-flag-icon";

Vue.config.productionTip = false;
Vue.use(FlagIcon);
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyCThqJaPmVNj_GCPyYcSI_p4_Ewbe7H9Ng",
    libraries: "places"
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
