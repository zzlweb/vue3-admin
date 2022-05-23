<template>
  <div class="login-box flex-row">
    <div>
      <div class="login-logo">
      <h1>Vue3 Antd Admin</h1>
    </div>
    <a-form
      layout="horizontal"
      :model="formInline"
      @finish="handleFinish"
      @finishFailed="handleFinishFailed"
    >
      <a-form-item>
        <a-input
          v-model:value="formInline.username"
          placeholder="admin"
          autocomplete="new-password"
        >
          <template #prefix
            ><UserOutlined style="color: rgba(0, 0, 0, 0.25)"
          /></template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-model:value="formInline.password"
          type="password"
          placeholder="admin"
          autocomplete="new-password"
        >
          <template #prefix
            ><LockOutlined style="color: rgba(0, 0, 0, 0.25)"
          /></template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          size="large"
          :loading="loading"
          block
        >
          登录
        </a-button>
      </a-form-item>
    </a-form>
    </div>
  </div>
</template>

<script >
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { defineComponent, reactive, toRefs, ref } from 'vue'
import store from '../../store/index'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'login',
  setup () {
    const formState = reactive({
      loading: false,
      formInline: {
        username: '',
        password: ''
      }
    })
    const route = useRoute()
    const router = useRouter()
    // 处理提交
    const handleFinish = async () => {
      const { username, password } = formState.formInline
      if (username.trim() === '' || password.trim() === '') {
        message.destroy()
        return message.warning('用户名或者密码不能为空')
      }
      // 启动加载
      formState.loading = true
      // 发送请求
      const res = await store.dispatch('user/login', {
        username,
        password
      })
      const { data } = res
      try {
        if (data.code === 200) {
          let toPath = route.query?.redirect || '/'
          if (['/permission/index', '/Three/index'].indexOf(toPath) !== -1) {
            toPath = '/'
          }
          message.success('登录成功!')
          router.replace(toPath)
        } else {
          message.error(data.message || '登录失败!')
          formState.loading = false
          message.destroy()
        }
      } catch (error) {
        store.dispatch('user/resetToken')
        message.error('登录失败!')
        formState.loading = false
        message.destroy()
      }
    }
    // 处理提交失败
    const handleFinishFailed = (errors) => {
      console.log(errors)
    }
    return {
      ...toRefs(formState),
      handleFinish,
      handleFinishFailed
    }
  },
  components: {
    UserOutlined,
    LockOutlined
  }
})
</script>

<style lang="less" scoped>
.login-box {
  align-items: center;
  justify-content: center;
  background-size: 100%;
  z-index: 1;
  position: relative;
  height: 100%;

  .login-logo {
    width: 100%;
    text-align: center;
    margin-bottom: 30px;

    .svg-icon {
      font-size: 48px;
    }

    img {
      height: 48px;
    }
    h1 {
      margin-left: 10px;
      margin-bottom: 0;
    }
  }

  ::v-deep(.ant-form) {
    width: 400px;

    .ant-col {
      width: 100%;
    }

    .ant-input-affix-wrapper {
      padding: 8px 11px;
    }

    .ant-input-prefix {
      .anticon {
        color: #000 !important;
        font-size: 16px;
      }
    }

    .ant-form-item-label {
      padding-right: 6px;
    }
  }

  .vertify-container {
    display: flex;
    height: 40px;
    line-height: 1;
    flex-direction: row;
    align-items: center;
    input {
      margin-right: 100px;
      padding: 7px 11px;
    }
  }
}
</style>
