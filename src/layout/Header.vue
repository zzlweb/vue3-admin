<template>
  <a-layout-header class="header flex-row">
    <div>
      <menu-unfold-outlined
        v-if="collapsed"
        class="trigger"
        @click="ToggleCollapsed"
        style="font-size: 18px"
      />
      <menu-fold-outlined
        style="font-size: 18px"
        v-else
        class="trigger"
        @click="ToggleCollapsed"
      />
    </div>
    <div class="right-part flex-row">
      <div class="full-screen">
        <a-tooltip placement="bottom">
          <fullscreen-outlined
            style="font-size: 18px"
            v-if="!ShowFullScreen"
            class="trigger"
            @click="ToggleShowFullScreen"
          />
          <fullscreen-exit-outlined
            style="font-size: 18px"
            v-else
            class="trigger"
            @click="ToggleShowFullScreen"
          />
          <template #title>
            <span v-if="!ShowFullScreen">切换全屏</span>
            <span v-else>退出全屏</span>
          </template>
        </a-tooltip>
      </div>
      <a-dropdown>
        <a class="ant-dropdown-link" @click.prevent>
          <img
            src="@/assets/images/107800.jpg"
            class="dropdown-img"
            alt=""
            srcset=""
          />
          <DownOutlined />
        </a>
        <template #overlay>
          <a-menu @click="handleClick">
            <a-menu-item key="1">
              <div>首页</div>
            </a-menu-item>
            <a-menu-item key="2">
              <div>退出登录</div>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </a-layout-header>
</template>

<script>
import { defineComponent, onMounted } from "vue";
import {
  DownOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { useRouter, useRoute } from "vue-router";
import { ref, reactive ,onBeforeUnmount} from "vue";
import screenfull from "screenfull";
import store from "@/store/index";
export default defineComponent({
  props: {
    collapsed: Boolean,
  },
  setup(props, { emit }) {
    const ShowFullScreen = ref(false);
    const router = useRouter();
    const handleClick = async ({ key }) => {
      switch (key) {
        case "2":
          try {
            await store.dispatch("user/logout");
            message.success("退出登录成功！");
            router.go(0);
          } catch (error) {
            message.error("退出登录失败！");
          }
          break;
        case "1":
          router.push({ path: "/" });
          break;
        default:
          break;
      }
    };

    const ToggleCollapsed = () => {
      emit("changeCollapsed");
    };

    const ToggleShowFullScreen = () => {
      if (!screenfull.enabled) {
        message.info({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false;
      }

      console.log(111);
      screenfull.toggle();
    };

    const change = () => {
      ShowFullScreen.value = screenfull.isFullscreen;
    };

    // 初始化screenfull
    const init = () => {
      if (screenfull.enabled) {
        screenfull.on("change", change);
      }
    };

    const destroy = () => {
      if (screenfull.enabled) {
        screenfull.off("change", change);
      }
    };

    onMounted(() => {
      init();
    });

    onBeforeUnmount(() => {
      destroy();
    });

    return {
      handleClick,
      ToggleCollapsed,
      ShowFullScreen,
      ToggleShowFullScreen,
    };
  },
  components: {
    DownOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    FullscreenOutlined,
    FullscreenExitOutlined,
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

.dropdown-img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  position: relative;
  top: -4px;
}

.ant-dropdown-trigger {
  width: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.right-part .full-screen {
  margin-right: 30px;
}
</style>
