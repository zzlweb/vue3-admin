<template>
  <div class="three-container">
    <canvas class="webgl"></canvas>
  </div>
</template>

<script>
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { onMounted } from 'vue'
export default {
  setup () {
    // canvas
    onMounted(() => {
      // Debug
      // const gui = new dat.GUI()
      // canvas
      const canvas = document.querySelector('.webgl')
      // Scene
      const scene = new THREE.Scene()
      // Sizes
      const sizes = {
        width: canvas.offsetWidth,
        height: canvas.offsetHeight
      }

      // renderer
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas
      })
      renderer.setSize(sizes.width, sizes.height)
      // dpi or 2
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor('#262837')
      renderer.shadowMap.enabled = true

      // Ambient light
      const ambientLight = new THREE.AmbientLight('#ffffff', 0.12)
      // gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
      scene.add(ambientLight)

      // camera
      const camera = new THREE.PerspectiveCamera(
        75,
        sizes.width / sizes.height,
        0.1,
        100
      )
      camera.updateProjectionMatrix()

      camera.position.x = 4
      camera.position.y = 2
      camera.position.z = 5
      scene.add(camera)

      // Controls
      const controls = new OrbitControls(camera, canvas)
      controls.enableDamping = true

      // Object
      const house = new THREE.Group()

      const walls = new THREE.Mesh(
        new THREE.BoxBufferGeometry(4, 2.5, 4),
        new THREE.MeshStandardMaterial({ color: '#fff' })
      )

      house.add(walls)

      // floor
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.MeshStandardMaterial({
          color: 0xffff00,
          side: THREE.DoubleSide
        })
      )
      floor.position.x = -Math.pI * 0.5
      scene.add(house)
      scene.add(floor)
      // help
      const axesHelper = new THREE.AxesHelper(5)
      scene.add(axesHelper)

      const resize = () => {
        sizes.width = canvas.offsetWidth
        sizes.height = canvas.offsetHeight

        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      }

      resize()

      window.addEventListener('resize', () => {
        // Update sizes
        resize()
      })

      // Animate
      const clock = new THREE.Clock()

      const tick = () => {
        const elapsedTime = clock.getElapsedTime()

        // Update controls
        controls.update()

        // Render
        renderer.render(scene, camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
      }

      tick()
    })
  }
}
</script>

<style lang="less" scoped>
.three-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.webgl {
  position: absolute;
  top: 0;
  left: 0;
  outline: none;
  width: 100% !important;
  height: 100% !important;
}
</style>
