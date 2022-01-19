<template>
  <a-sub-menu :key="menuInfo.path">
    <template #title>{{ menuInfo.name }}</template>
    <side-item
      v-for="route in menuInfo.children"
      :key="route.path"
      :item="route"
      :base-path="route.path"
    ></side-item>
  </a-sub-menu>
</template>

<script>
import sideItem from "@/layout/Side/SideItem.vue";
export default {
  name: "SubMenu",
  props: {
    menuInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    "SideItem": sideItem,
  },
  setup(props) {
    console.log(props.menuInfo);
  },
};
</script>
