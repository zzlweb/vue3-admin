<template>
  <a-layout-sider width="200" style="background: #fff">
    <a-menu
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      mode="inline"
      :style="{ height: '100%', borderRight: 0 }"
    >
      <side-item
        v-for="route in list"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      ></side-item>
    </a-menu>
  </a-layout-sider>
</template>

<script>
import { defineComponent, ref } from "vue";
import router from "@/router";
import sideItem from "./SideItem.vue";
export default defineComponent({
  setup() {
    const list = router.options.routes;

    return {
      list,
      selectedKeys: ref(["1"]),
      openKeys: ref(["2"]),
    };
  },
  components: {
    "side-item": sideItem,
  },
});
</script>

<style lang="less" scoped>
</style>
