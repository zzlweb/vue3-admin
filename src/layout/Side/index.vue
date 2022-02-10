<template>
  <a-layout-sider width="200" style="background: #fff">
    <a-menu
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      mode="inline"
      @click="clickMenuItem"
      :style="{ height: '100%', borderRight: 0 }"
    >
      <side-item
        v-for="route in list"
        :key="route.name"
        :item="route"
        :base-path="route.path"
      ></side-item>
    </a-menu>
  </a-layout-sider>
</template>

<script>
import { defineComponent, reactive, toRefs, watch } from "vue";
// 3.0 监听路由改变
import sideItem from "./SideItem.vue";
import store from "@/store";
import { useRoute, useRouter } from "vue-router";
export default defineComponent({
  setup() {
    const currentRoute = useRoute();
    const router = useRouter();
    const list = store.getters.permissionRouter;
    // 获取当前打开的子菜单
    const state = reactive({
      openKeys: [],
      selectedKeys: [currentRoute.name],
    });

    console.log(currentRoute);

    // 点击菜单
    const clickMenuItem = ({ key }) => {
      if (key === currentRoute.name) return;
      if (/http(s)?:/.test(key)) {
        window.open(key);
      } else {
        router.push({ name: key });
      }
    };

    watch(() => currentRoute.path,() => {
    console.log('监听到变化')
    })

    return {
      list,
      currentRoute,
      ...toRefs(state),
      clickMenuItem,
    };
  },
  components: {
    "side-item": sideItem,
  },
});
</script>
