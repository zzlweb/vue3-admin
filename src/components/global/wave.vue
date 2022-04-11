<template>
  <div id="wave-container">

  </div>
</template>

<script>
import { reactive, onMounted, onUnmounted } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as THREE from 'three'
export default {
  setup () {
    const geo = reactive({
      camera: '', // 创建相机
      renderer: '', // 创建渲染器
      geometry: '', // 创建展示对象
      material: '' // 创建材质
    })

    const init = () => {
      // 创建场景
      geo.scene = new THREE.Scene()
      // 创建相机
      geo.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      geo.camera.position.z = 5
      geo.camera.position.x = 0
      // createGeometry()
      // createRender()
      // animate()
    }

    // 创建材质和对象
    const createGeometry = () => {

    }
  }
}
</script>

<style lang="less" scoped>
#wave-container {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 0;
}
</style>
