<template>
  <div style="display:inline-block;">
    <label class="radio-label">文件类型: </label>
    <a-select v-model:value="bookType" style="width:120px;">
      <a-select-option
        v-for="item in options"
        :key="item"
        :value="item"
      >
      {{ item }}
      </a-select-option>
    </a-select>
  </div>
</template>

<script>
import { computed, ref } from 'vue'

export default {
  props: {
    value: {
      type: String,
      default: 'xlsx'
    }
  },
  setup (props, { emit }) {
    const options = ref(['xlsx', 'csv', 'txt'])

    const bookType = computed({
      get () {
        return props.value
      },

      set (val) {
        emit('update:value', val)
      }
    })

    return {
      bookType,
      options
    }
  }
}
</script>
