<template>
  <a-layout-header class="header flex-row">
    <div>
      <menu-unfold-outlined
      v-if="collapsed"
      class="trigger"
      @click="ToggleCollapsed"
    />
    <menu-fold-outlined
      v-else
      class="trigger"
      @click="ToggleCollapsed"
    />
    </div>
    <a-dropdown>
      <a class="ant-dropdown-link" @click.prevent>
        Hover me
        <DownOutlined />
      </a>
      <template #overlay>
        <a-menu @click="handleClick">
          <a-menu-item key="1">
            <div>退出登录</div>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </a-layout-header>
</template>

<script>
import { defineComponent } from "vue";
import {
  DownOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { useRouter, useRoute } from 'vue-router'
import store from "@/store/index";
export default defineComponent({
  props: {
    collapsed: Boolean
  },
  setup(props,{emit}) {
    const router = useRouter()
    const route = useRoute()
    const handleClick = async ({ key }) => {
      try {
        if (key === "1") {
          await store.dispatch("user/logout");
          message.success("退出登录成功！");
          router.go(0)
        }
      } catch (error) {
        message.error("退出登录失败！");
      }
    };

    const ToggleCollapsed = () => {
      emit('changeCollapsed')
    }

    return {
      handleClick,
      ToggleCollapsed
    };
  },
  components: {
    DownOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
  },
});
</script>

<style lang="less" scoped>
.header {
  justify-content: space-between;
}

#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #00a971;
}
</style>
