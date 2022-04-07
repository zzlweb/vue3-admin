<template>
  <div>
    <div style="margin-bottom: 15px">你的权限角色: {{ roles }}</div>

    <div style="margin-bottom: 20px">
      Switch Roles
      <a-radio-group v-model:value="switchRoles">
        <a-radio-button value="admin"> admin </a-radio-button>
        <a-radio-button value="editor"> editor </a-radio-button>
      </a-radio-group>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import store from '@/store'
export default {
  setup (props, { emit }) {
    const roles = computed(() => {
      return store.getters.roles
    })

    const router = useRouter()

    const switchRoles = computed({
      get () {
        return roles.value[0]
      },

      set (val) {
        store.dispatch('user/changeRoles', val).then(() => {
          emit('change')
          router.go(0)
        })
      }
    })
    return { roles, switchRoles }
  }
}
</script>
