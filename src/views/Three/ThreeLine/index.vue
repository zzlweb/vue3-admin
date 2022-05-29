<template>
  <canvas id="wave-container"></canvas>
</template>

<script>
import { reactive, onMounted, onUnmounted } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as THREE from 'three'
import { throttle } from 'lodash'

const scene = new THREE.Scene()
let mesh
export default {
  // 创建场景
  setup () {
    const geo = reactive({
      camera: null, // 创建相机
      renderer: '', // 创建渲染器
      geometry: '', // 创建展示对象
      material: '', // 创建材质
      canvas: null, // DOM
      controls: null
    })

    // 创建场景
    const createRender = (sizes) => {
      geo.renderer = new THREE.WebGLRenderer({
        canvas: geo.canvas
      })

      geo.renderer.setSize(sizes.width, sizes.height)
      geo.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    // 创建材质和对象
    const createGeometry = () => {
      geo.geometry = new THREE.PlaneBufferGeometry(2, 2, 32, 32)

      // mesh = new THREE.Mesh(geo.geometry, geo.material)

      scene.add(mesh)
    }

    const init = (sizes) => {
      // 获取dom

      // 创建相机
      geo.camera = new THREE.PerspectiveCamera(
        75,
        sizes.width / sizes.height,
        0.1,
        100
      )
      // 控制器
      geo.controls = new OrbitControls(geo.camera, geo.canvas)
      geo.controls.enableDamping = true

      geo.camera.position.z = 2
      geo.camera.position.x = 0
      geo.camera.position.y = -3
    }

    const light = new THREE.AmbientLight(0xffffff) // soft white light
    scene.add(light)

    const clock = new THREE.Clock()

    // 动画
    const animate = () => {
      const elapsedTime = clock.getElapsedTime()

      // update controls
      geo.controls.update()

      geo.renderer.render(scene, geo.camera)

      // Call tick again on the next frame
      window.requestAnimationFrame(animate)
    }

    // DOM 挂载
    onMounted(() => {
      geo.canvas = document.querySelector('#wave-container')

      const sizes = {
        width: geo.canvas.offsetWidth,
        height: geo.canvas.offsetHeight
      }

      window.addEventListener(
        'resize',
        throttle(() => resize(), 200)
      )
      init(sizes)
      createGeometry()
      createRender(sizes)
      animate()
    })

    // 卸载
    onUnmounted(() => {
      window.removeEventListener('resize', resize)
      geo.renderer.dispose()
      scene.clear()
      mesh = null
    })

    // resize
    const resize = () => {
      const width = document.querySelector('#wave-container').offsetWidth
      const height = document.querySelector('#wave-container').offsetHeight

      // update carame
      geo.camera.aspect = width / height
      geo.camera.updateProjectionMatrix()

      // uodate renderer
      geo.renderer.setSize(width, height)
      // dpi or 2
      geo.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
  }
}
</script>

<style lang="less" scoped>
#wave-container {
  width: 100% !important;
  height: 100% !important;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
