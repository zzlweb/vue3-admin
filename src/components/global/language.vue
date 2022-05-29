
<template>
<a-dropdown>
    <a class="ant-dropdown-link" @click.prevent>
      {{$t('HeaderLanguage.language')}}
      <DownOutlined />
    </a>
    <template #overlay>
      <a-menu>
        <a-menu-item>
          <div @click="change('zh')">{{$t('HeaderLanguage.zh')}}</div>
        </a-menu-item>
        <a-menu-item>
          <div @click="change('en')">{{$t('HeaderLanguage.en')}}</div>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script>
import { DownOutlined } from '@ant-design/icons-vue'
import { getCurrentInstance } from 'vue'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import store from '@/store/index'
export default {
  name: 'language',
  components: {
    DownOutlined
  },
  setup () {
    const { t } = useI18n()
    const { proxy } = getCurrentInstance()
    function change (type) {
      switch (type) {
        case 'en':
          store.commit('user/SET_language', 'en')
          break

        default:
          store.commit('user/SET_language', 'zh')
          break
      }
      localStorage.setItem('lang', type)
      proxy.$i18n.locale = type
      message.destroy()
      message.success(t('ToggleLanguage'), 2)
    }
    return { change }
  }
}
</script>
