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
import { defineComponent} from "vue";
import { useRouter } from 'vue-router'
export default defineComponent({
  name: "Home",
  components: {},
  setup() {
    const router = useRouter()
  }
});
</script>
