<template>
  <div>
    <div style="margin-bottom: 15px;">
      你的权限角色: {{ roles }}
    </div>

    <div style="margin-bottom: 20px">
      Switch Roles
      <a-radio-group v-model:value="switchRoles">
        <a-radio-button value="admin">
          admin
        </a-radio-button>
        <a-radio-button value="editor">
          editor
        </a-radio-button>
      </a-radio-group>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import store from '@/store'
export default {
  setup (props, { emit }) {
    const roles = computed(() => {
      return store.getters.roles
    })

    const switchRoles = computed({
      get () {
        return roles.value[0]
      },

      set (val) {
        store.dispatch('user/changeRoles', val)
        emit('change')
      }
    })
    return { roles, switchRoles }
  }
}
</script>
