<template>
  <div class="home">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <test-component></test-component>
    </div>
  </div>
</template>

<script >
import { defineComponent } from "vue";

export default defineComponent({
  name: "Home",
  components: {},
});
</script>
