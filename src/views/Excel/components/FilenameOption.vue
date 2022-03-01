<template>
  <div style="flex-row">
    <span style="padding-left: 0">文件名: </span>
    <a-input
      v-model="filename"
      placeholder="请输入文件名(default excel-list)"
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
        emit('input', val)
      }
    })

    return {
      filename
    }
  },
};
</script>
