<template>
  <div class="container">
    <upload-excel  :before-upload="beforeUpload" :on-success="OnSuccess" />
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  setup () {
    const tableData = ref(null)
    const tableHeader = ref(null)

    const beforeUpload = (file) => {
      const isLimt = file.size / 1024 / 1024 < 1

      if (isLimt) {
        return true
      }
    }

    const OnSuccess = ({ results, header }) => {
      tableData.value = results
      tableHeader.value = header
    }

    return {
      beforeUpload,
      OnSuccess,
      tableData,
      tableHeader
    }
  }
}
</script>
