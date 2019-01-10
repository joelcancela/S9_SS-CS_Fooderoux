<template>
  <div id="app">
    <router-link to="/">Home</router-link>
    <router-link to="/other">Other</router-link>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      //
    };
  }
};
</script>
