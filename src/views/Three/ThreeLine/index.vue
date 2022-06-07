<template>
  <canvas id="container" ></canvas>
</template>

<script>
import { onMounted } from 'vue'
import { ThreeEngine } from '@/utils/threeEngine.js'
export default {
  // 创建场景
  setup () {
    // 获取dom

    // DOM 挂载
    onMounted(() => {
      // 实例化
      const dom = document.querySelector('#container')
      const TE = new ThreeEngine(dom)
    })
  }
}
</script>

<style lang="less" scoped>
#container {
  width: 100%;
  height: calc(100% - 20px) !important;
}
</style>
