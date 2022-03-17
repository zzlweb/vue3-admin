import permission from './permission'

// 注册指令

const install = function (Vue) {
  Vue.directive('permission', permission)
}

if (window.Vue) {
  window.permission = permission
  Vue.use(install); // eslint-disable-line
}

permission.install = install

export default permission
