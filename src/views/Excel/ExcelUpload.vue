<template>
  <div class="container">
    <upload-excel  :before-upload="beforeUpload" :on-success="OnSuccess" />

    <a-table :columns="tableHeader" :data-source="tableData" :row-key="(record) => record.id" >
    </a-table>
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
      console.log(results, header)

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
