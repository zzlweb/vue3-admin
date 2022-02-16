<template>
   <a-layout>
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo-area flex-row">Vue Admin</div>
      <side />
    </a-layout-sider>
    <a-layout>
      <Headers :collapsed="collapsed" @changeCollapsed="changeCollapsed"/>
       <a-layout-content style="padding: 0 24px 24px" class="flex-col">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item v-for="(item, index) in list" :key="index">
            <router-link
              v-if="!item.redirect"
              :to="{ path: item.path === '' ? '/' : item.path }"
            >
              {{ item.name }}
            </router-link>
            <span v-else>{{ item.name }}</span>
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
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import { UserOutlined, VideoCameraOutlined, UploadOutlined } from "@ant-design/icons-vue";
import {
  defineComponent,
  onMounted,
  toRefs,
  watch,
  reactive,
  computed,
} from "vue";
import { useRoute } from "vue-router";
import Side from "./Side/index.vue";
import Headers from "./Header.vue";
export default defineComponent({
  components: {
    UserOutlined, VideoCameraOutlined, UploadOutlined,
    Side,
    Headers,
  },

  setup() {
    const route = useRoute();

    const state = reactive({
      list: [],
      name: "",
      collapsed: false
    });

    const getBreadCrumb = () => {
      state.list = [];
      state.name = route.name;
      const matched = route.matched;
      matched.forEach((item) => {
        state.list.push(item);
      });

      if (
        state.list.length >= 2 &&
        state.list[0].meta.title === state.list[1].name
      ) {
        state.list = state.list.splice(0, 1);
      }
    };

    const changeCollapsed = () => {
      state.collapsed = !state.collapsed
    }

    onMounted(() => {
      getBreadCrumb();
    });

    watch(
      () => route.matched,
      () => {
        getBreadCrumb();
      }
    );

    const checkLength = computed(() => {
      return (params) => {
        if (
          params.children &&
          params.children.filter((item) => !item.hidden).length < 2
        ) {
          return true;
        }
      };
    });
    return {
      ...toRefs(state),
      checkLength,
      changeCollapsed
    };
  },
});
</script>
<style lang="less">
@import '../styles/antd.less';

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

.logo-area{
  width: 100%;
  height: 64px;
  background-image: linear-gradient(60deg, #64b3f4 0%, #c2e59c 100%);
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 20px;
  overflow: hidden;
  white-space: nowrap;
}
</style>
