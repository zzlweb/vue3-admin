<template>
  <div style="display:inline-block;">
    <label class="radio-label">设置自适应宽度: </label>
    <a-radio-group v-model:value="autoWidth">
      <a-radio :value="true" >
        True
      </a-radio>
      <a-radio :value="false" >
        False
      </a-radio>
    </a-radio-group>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    value: {
      type: Boolean,
      default: true
    }
  },

  setup (props, { emit }) {
    const autoWidth = computed({
      get () {
        return props.value
      },

      set (val) {
        emit('update:value', val)
      }
    })

    return {
      autoWidth
    }
  }
}
</script>
