import { createApp } from 'vue'

/**
 * @description 加载所有 Plugins
 * @param  {ReturnType<typeof createApp>} app 整个应用的实例
 */
export function loadAllPlugins(app) {
  const files = require.context('.', true, /\.js$/)
  files.keys().forEach(key => {
    if (typeof files(key).default === 'function') {
      // 排除index.ts
      if (key !== './index.js') files(key).default(app)
    }
  })
}
