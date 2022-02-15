import { kebabCase } from 'lodash'

// 注册global下面的组件为全局公共组件
export function RegisterCommonComponent(app) {
  const files = require.context('./global', true, /\.(vue|js)$/)
  files.keys().forEach(key => {
    // 当前组件
    const config = files(key)
    // 正则匹配 组件名 处理为 a-b
    const name = kebabCase(key.replace(/^\.\//, '').replace(/\.\w+$/, ''))

    app.component(name, config.default || config)
  })

  // app.component('svg-icon', svg)
}
