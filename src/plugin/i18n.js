import { createI18n } from 'vue-i18n'

import zh from '@/i18n/zh'
import en from '@/i18n/en'

const messages = {
  en,
  zh
}
const language = (navigator.language || 'zh').toLocaleLowerCase() // 这是获取浏览器的语言
const i18n = createI18n({
  locale: localStorage.getItem('lang') || language.split('-')[0] || 'zh', // 首先从缓存里拿，没有的话就用浏览器语言，
  fallbackLocale: 'zh', // 设置备用语言
  messages,
  globalInjection: true // 全局注册 $t方法
})

/**
 * @description 手动注册 antd-vue 组件,达到按需加载目的
 * @description Automatically register components under Button, such as Button.Group
 * @param {ReturnType<typeof createApp>} app 整个应用的实例
 * @returns void
 */
export default function loadComponent(app) {
  app.use(i18n)
}
