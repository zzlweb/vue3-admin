<template>
  <div>
    <div>
      <change-roles @change="handleRolesChange"></change-roles>
    </div>

    <a-space :key="key">
      <a-button type="primary" v-permission="['admin']">ONLY ADMIN</a-button>
      <a-button type="primary" v-permission="['editor']">ONLY EDITOR</a-button>
      <a-button type="primary" v-permission="['editor', 'admin']">ADMIN & EDITOR</a-button>
    </a-space>
  </div>
</template>

<script>
import permission from '@/directive/permission/index.js' // 权限判断指令
import ChangeRoles from './component/SwitchRoles.vue'
import { ref } from 'vue'
export default {
  directives: { permission },
  components: { ChangeRoles },
  setup () {
    const key = ref(0)

    const handleRolesChange = () => {
      key.value++
    }
    return {
      handleRolesChange,
      key
    }
  }
}
</script>
