<template>
  <div class="container">
    <upload-excel :before-upload="beforeUpload" :on-success="OnSuccess" />

    <div style="margin-top: 20px">
      <a-table :columns="tableHeader" v-show="tableData" :data-source="tableData" bordered :rowKey="(record,index)=>{return index}" />
    </div>
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
      const columns = []
      for (const key in header) {
        var item = {
          title: header[key],
          dataIndex: header[key],
          key: header[key]
        }

        columns.push(item)
      }

      tableData.value = results
      tableHeader.value = columns
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
