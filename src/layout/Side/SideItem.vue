<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item.children, item)">
      <router-link
        v-if="onlyOneChild.meta"
        :to="resolvePath(onlyOneChild.path)"
      >
        <a-menu-item :key="item.key">
          {{ item.name }}
        </a-menu-item>
      </router-link>
    </template>
    <template v-else>
      <sub-menu :key="item.key" :menu-info="item" />
    </template>
  </div>
</template>

<script>
import { isExternal } from  '@/utils/validate.js'
import path from 'path'
const SubMenu = {
  name: "SubMenu",
  props: {
    menuInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  template: `
    <a-sub-menu :key="menuInfo.key">
      <template #title>{{ menuInfo.title }}</template>
      <template v-for="item in menuInfo.children" :key="item.key">
        <template v-if="!item.children || item.hidden">
          <a-menu-item :key="item.key">
            {{ item.name }}
          </a-menu-item>
        </template>
        <template v-else>
          <sub-menu :menu-info="item" :key="item.key" />
        </template>
      </template>
    </a-sub-menu>
  `,
};
import { defineComponent, ref } from "vue";
export default {
  setup(props) {
    const onlyOneChild = ref(null);
    // 判断是否只含有一个可展示子路由
    const hasOneShowingChild = (children = [], parent) => {
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false;
        } else {
          // Temp set(will be used if only has one showing child)
          onlyOneChild.value = item;
          return true;
        }
      });
      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true;
      }
      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        onlyOneChild.value = { ...parent, path: "", noShowingChildren: true };
        return true;
      }
      return false;
    };

    // 处理路由
    const resolvePath = (routePath) => {
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(props.basePath)) {
        return props.basePath;
      }
      return path.resolve(props.basePath, routePath);
    };

    return {
      hasOneShowingChild,
      onlyOneChild,
      resolvePath
    };
  },
  components: {
    "sub-menu": SubMenu,
  },
  props: {
    item: {
      type: Object,
      require: true,
    },
    basePath: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="less" scoped>
</style>