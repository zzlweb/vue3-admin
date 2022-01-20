<template>
  <a-layout-header class="header flex-row">
    <div>
      logo
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
import { DownOutlined } from "@ant-design/icons-vue";
import { message } from 'ant-design-vue'
import store from '@/store/index'
export default defineComponent({
  setup() {
    const handleClick = async ({ key }) => {
      try {
        if(key ===  '1') {
          await store.dispatch('user/logout')
          message.success('退出登录成功！')
          location.reload()
        }
      } catch (error) {
        message.error('退出登录失败！')
      }
    };

    return {
      handleClick,
    };
  },
  components: {
    DownOutlined,
  },
});
</script>

<style lang="less" scoped>
.header{
  justify-content: space-between;
}
</style>
