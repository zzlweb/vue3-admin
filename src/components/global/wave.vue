<template>
  <canvas id="wave-container"></canvas>
</template>

<script>
import { reactive, onMounted, onUnmounted } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as THREE from 'three'
const scene = new THREE.Scene()
const textureLoader = new THREE.TextureLoader()
const count = 400
const dimension = 3
const particleGeometry = new THREE.BufferGeometry()

export default {
  // 创建场景
  setup () {
    const geo = reactive({
      camera: '', // 创建相机
      renderer: '', // 创建渲染器
      geometry: '', // 创建展示对象
      material: '', // 创建材质
      canvas: null, // DOM
      controls: null,
      id: null
    })

    const sizes = reactive({
      width: window.innerWidth,
      height: window.innerHeight
    })

    const init = () => {
      // 获取dom
      geo.canvas = document.querySelector('#wave-container')

      // 创建相机
      geo.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        100
      )
      // 控制器
      geo.controls = new OrbitControls(geo.camera, geo.canvas)
      geo.controls.enableDamping = true

      geo.camera.position.z = 8
      geo.camera.position.x = 0
      geo.camera.position.y = 1

      const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
      scene.add(ambientLight)
      createGeometry()
      createRender(geo.canvas)
      animate()
    }

    // 创建材质和对象
    const createGeometry = () => {
      const particleTexture = textureLoader.load('/static/wave/4.png')

      const total = dimension * count
      const positions = new Float32Array(total)
      const colors = new Float32Array(total)

      for (let i = 0; i < total; i++) {
        positions[i] = (Math.random() - 0.5) * 12
        colors[i] = Math.random()
      }
      particleGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, dimension)
      )
      particleGeometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, dimension)
      )

      const particleMaterial = new THREE.PointsMaterial({
        size: 0.5,
        color: new THREE.Color('#00a971'),
        alphaMap: particleTexture,
        transparent: true,
        // 透明度没有完全奏效，有些圈子重叠罚款，但其他人表现得好像是坚实的。
        // 我在了解了 depthWrite：false 和 depthTest：false 在 THREE.PointsMaterial 。
        depthWrite: false,
        // 材质融合
        blending: THREE.AdditiveBlending,
        // 颜色混合
        vertexColors: true
      })
      const particles = new THREE.Points(particleGeometry, particleMaterial)
      // particles.rotation.y = -Math.PI * 0.2
      scene.add(particles)
    }

    // 创建场景
    const createRender = (canvas) => {
      geo.renderer = new THREE.WebGLRenderer({
        canvas: canvas
      })

      geo.renderer.setSize(sizes.width, sizes.height)
      geo.renderer.setClearColor('#262837')
      geo.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    const clock = new THREE.Clock()

    // 动画
    const animate = () => {
      const elapsedTime = clock.getElapsedTime() * 0.5

      for (let i = 0; i < count; i++) {
        const group = i * dimension
        const yAxis = group + 1
        const xValue = particleGeometry.attributes.position.array[group]
        particleGeometry.attributes.position.array[yAxis] = Math.sin(
          elapsedTime * 0.6 + xValue
        )
      }

      particleGeometry.attributes.position.needsUpdate = true

      // update controls
      geo.controls.update()

      geo.renderer.render(scene, geo.camera)

      geo.id = window.requestAnimationFrame(animate)
    }

    // DOM 挂载
    onMounted(() => {
      window.addEventListener('resize', () => resize())
      init()
      animate()
    })

    // 卸载
    onUnmounted(() => {
      window.removeEventListener('resize', resize)
      geo.renderer.dispose()
      scene.clear()
    })

    // resize
    const resize = () => {
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight

      // update carame
      geo.carame.aspect = sizes.width / sizes.height
      geo.carame.updateProjectionMatrix()

      // uodate renderer
      geo.renderer.setSize(sizes.width, sizes.height)
      // dpi or 2
      geo.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
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
}
</style>
