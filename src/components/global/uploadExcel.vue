<template>
  <div>
    <input ref="InputRef" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      拖拽上传 or
      <a-button :loading="loading" style="margin-left:16px;" type="primary" @click="handleUpload">
        点击上传
      </a-button>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'
import { message } from 'ant-design-vue'
import { ref, reactive, toRefs } from 'vue'
export default {
  props: {
    beforeUpload: Function,
    onSuccess: Function
  },
  setup (props) {
    const InputRef = ref(null)

    const state = reactive({
      loading: false,
      excelData: {
        header: null,
        results: null
      }
    })

    const handleDragover = (e) => {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    }

    const generateData = ({ header, results }) => {
      state.excelData.header = header
      state.excelData.results = results
      props.onSuccess && props.onSuccess(state.excelData)
    }

    const getHeaderRow = (sheet) => {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) {
        /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    }

    const isExcel = (file) => {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }

    const handleDrop = (e) => {
      e.stopPropagation()
      e.preventDefault()
      if (state.loading) return
      const files = e.dataTransfer.files
      if (files.length !== 1) {
        message.error('仅支持上传一个文件!')
        return
      }
      const rawFile = files[0] // only use files[0]

      if (!isExcel(rawFile)) {
        message.error('仅支持 .xlsx, .xls, .csv 格式文件')
        return false
      }
      upload(rawFile)
      e.stopPropagation()
      e.preventDefault()
    }

    const readerData = (rawFile) => {
      state.loading = true
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = getHeaderRow(worksheet)
          const results = XLSX.utils.sheet_to_json(worksheet)
          generateData({ header, results })
          state.loading = false
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    }

    const upload = (rawFile) => {
      InputRef.value = null

      if (!props.beforeUpload) {
        // 如果没有做预上传处理
        readerData(rawFile)
        return
      }

      const before = props.beforeUpload(rawFile)
      if (before) {
        readerData(rawFile)
      }
    }

    const handleClick = (e) => {
      const files = e.target.files
      const rawFile = files[0]
      if (!rawFile) return
      upload(rawFile)
    }

    const handleUpload = () => {
      InputRef.value.click()
    }

    return {
      InputRef,
      ...toRefs(state),
      handleUpload,
      handleClick,
      handleDragover,
      handleDrop
    }
  }
}
</script>

<style lang="less" scoped>
.excel-upload-input {
  display: none;
  z-index: -9999;
}
.drop {
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
</style>
