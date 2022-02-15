<template>
  <div v-if="!item.hidden">
    <!-- 只含有一个子路由 -->
    <template v-if="hasOneShowingChild(item.children, item)">
      <a-menu-item :key="item.name">
        {{ item.name }}
      </a-menu-item>
    </template>
    <!-- 含有多个子路由 -->
    <template v-else>
      <sub-menu :menu-info="item" :key="item.name" />
    </template>
  </div>
</template>

<script>
// import { defineComponent, ref } from "vue";
const SubMenu = {
  name: 'SubMenu',
  props: {
    menuInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  template: `
    <a-sub-menu :key="menuInfo.name">
      <template #title>{{ menuInfo.name }}</template>
      <template v-for="route in menuInfo.children" :key="route.name">
        <template v-if="!route.children">
          <a-menu-item :key="route.name">
            {{ route.name }}
          </a-menu-item>
        </template>
        <template v-else>
          <sub-menu :menu-info="route" :key="route.name" />
        </template>
      </template>
    </a-sub-menu>
  `,
};
export default {
  setup(props) {
    // 判断是否只含有一个可展示子路由
    const hasOneShowingChild = (children = [], parent) => {
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false;
        } else {
          return true;
        }
      });
      if (showingChildren.length === 1) {
        return true;
      }
      if (showingChildren.length === 0) {
        return true;
      }
      return false;
    };

    return {
      hasOneShowingChild,
    };
  },
  props: {
    item: {
      type: Object,
      require: true,
    },
    basePath: {
      type: String,
      default: '',
    },
  },
  components: {
    'sub-menu': SubMenu,
  },
};
</script>
