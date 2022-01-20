<template>
  <a-sub-menu :key="menuInfo.path">
    <template #title>{{ menuInfo.name }}</template>
    <side-item
      v-for="route in menuInfo.children"
      :key="route.name"
      :item="route"
      :base-path="resolvePath(route.path)"
    ></side-item>
  </a-sub-menu>
</template>

<script>
import { isExternal } from  '@/utils/validate.js'
import sideItem from "@/layout/Side/SideItem.vue";
import path from 'path'
export default {
  name: "SubMenu",
  props: {
    menuInfo: {
      type: Object,
      default: () => ({}),
    },
    subPath: {
      type: String,
      default: ''
    }
  },
  components: {
    "SideItem": sideItem,
  },
  setup(props) {
     const resolvePath = (routePath) => {
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(props.subPath)) {
        return props.subPath;
      }
      return path.resolve(props.subPath, routePath);
    };
    return {
      resolvePath
    }
  },
};
</script>
