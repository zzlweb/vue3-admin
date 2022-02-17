<template>
  <div class="home">
    <apexcharts></apexcharts>
  </div>
</template>

<script >
import { defineComponent} from "vue";
import { useRouter } from 'vue-router'
export default defineComponent({
  name: "Home",
  setup() {
    const router = useRouter()
  }
});
</script>
