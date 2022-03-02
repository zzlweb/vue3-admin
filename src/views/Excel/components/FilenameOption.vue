<template>
  <div style="flex-row; margin-right: 10px">
    <span style="padding-left: 0">文件名: </span>
    <a-input
      v-model:value="filename"
      placeholder="请输入文件名(默认 excel)"
      style="width: 250px"
    />
  </div>
</template>
<script>
import { computed } from 'vue'

export default {
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  setup(props, {emit}) {
    const filename = computed({
      get() {
        return props.value
      },

      set(val) {
        emit('update:value', val)
      }
    })

    return {
      filename
    }
  },
};
</script>
