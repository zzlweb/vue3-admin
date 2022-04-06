import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index.js'
import store from '@/store/index.js'
import { AppConfig } from '@/config/app.js'
import { loadAllPlugins } from '@/plugin/index.js'
import { RegisterCommonComponent } from '@/components/index.js'
// 引入样式文件

import '@/styles/index.less'

// mock接口
import '@/mock/index'

// 权限控制
import './permission'

/** 将全局静态配置注入到应用中,可以通过 this.a读取,比 provide 和 inject 手动注入更方便  */
const app = createApp(App)
app.config.globalProperties = AppConfig

// 加载plugin
loadAllPlugins(app)

// 自动注册全局组件
RegisterCommonComponent(app)

app.use(store).use(router).mount('#app')
