import store from '@/store'

// 权限指令 // 指令定义对象钩子函数->被绑定元素插入父节点时调用

function checkPermission (el, binding) {
  // 指令的值
  const {
    value
  } = binding

  // 获取当前的角色值
  const roles = store.getters && store.getters.roles

  // 确保指令的值为数组
  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRoles = value

      const hasPermission = roles.some(role => permissionRoles.includes(role))

      // 如果没有权限，删除父节点
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    throw new Error('need roles! Like v-permission="[\'admin\',\'editor\']"')
  }
}

export default {
  mounted (el, binding) {
    checkPermission(el, binding)
  },

  update (el, binding) {
    checkPermission(el, binding)
  }
}
