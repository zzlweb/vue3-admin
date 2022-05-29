<template>
  <a-config-provider :locale="locale === 'en' ? enUS : zhCN">
    <router-view />
  </a-config-provider>
</template>

<script>
import { defineComponent, computed } from 'vue'
import enUS from 'ant-design-vue/es/locale/en_US'
import store from '@/store/index'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh')
export default defineComponent({
  setup () {
    const locale = computed(() =>
      store.state.user.language
    )

    // const locale = store.getters.language
    // console.log(store.getters.language)
    dayjs.locale(locale)

    return {
      locale,
      dayjs,
      enUS,
      zhCN
    }
  }
})
</script>
