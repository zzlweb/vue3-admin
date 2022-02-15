<template>
  <a-layout>
    <Headers />
    <a-layout>
      <side />
      <a-layout style="padding: 0 24px 24px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item v-for="(item, index) in list" :key="index">
            <router-link
              v-if="true"
              :to="{ path: item.path === '' ? '/' : item.path }"
              > 测试 </router-link
            >
            <span v-else>{{ item.meta.title }}</span>
          </a-breadcrumb-item>
        </a-breadcrumb>
        <a-layout-content
          :style="{
            background: '#fff',
            padding: '24px',
            margin: 0,
            minHeight: '280px',
          }"
        >
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script>
import { LaptopOutlined, NotificationOutlined } from "@ant-design/icons-vue";
import { defineComponent, onMounted, toRefs, watch, reactive } from "vue";
import { useRoute } from "vue-router";
import Side from "./Side/index.vue";
import Headers from "./Header.vue";
export default defineComponent({
  components: {
    LaptopOutlined,
    NotificationOutlined,
    Side,
    Headers,
  },

  setup() {
    const route = useRoute();

    const state = reactive({
      list: [],
      name: "",
    });

    const getBreadCrumb = () => {
      state.list = [];
      state.name = route.name;
      let matched = route.matched;
      matched.forEach((item) => {
        state.list.push(item);
      });

      console.log(state.list,state.name);
    };

    onMounted(() => {
      getBreadCrumb();
    });

    watch(
      () => route.matched,
      () => {
        getBreadCrumb();
      }
    );

    return {
      ...toRefs(state),
    };
  },
});
</script>
<style lang="less">
#components-layout-demo-top-side-2 .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side-2 .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
}
</style>
