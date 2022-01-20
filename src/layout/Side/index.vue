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
import { defineComponent, reactive, toRefs } from 'vue';
import sideItem from './SideItem.vue';
import store from '@/store';
import { useRoute, useRouter } from 'vue-router';
export default defineComponent({
  setup() {
    const currentRoute = useRoute();
    const router = useRouter();
    const list = store.getters.permissionRouter;
    // 获取当前打开的子菜单
    const getOpenKeys = () => {
      // const meta = currentRoute.meta;
      // if (meta?.activeMenu) {
      //   const targetMenu = getTargetMenuByActiveMenuName(meta.activeMenu);
      //   return targetMenu?.meta?.namePath ?? [meta?.activeMenu];
      // }
      // return (
      //   currentRoute.meta?.namePath ??
      //   currentRoute.matched.slice(1).map((n) => n.name)
      // );
    };
    const state = reactive({
      openKeys: [],
      selectedKeys: [currentRoute.name],
    });

    // 点击菜单
    const clickMenuItem = ({ key }) => {
      console.log(key);
      if (key === currentRoute.name) return;
      if (/http(s)?:/.test(key)) {
        window.open(key);
      } else {
        router.push({ name: key });
      }
    };

    console.log(state.selectedKeys, state.openKeys);
    return {
      list,
      ...toRefs(state),
      clickMenuItem,
    };
  },
  components: {
    'side-item': sideItem,
  },
});
</script>
