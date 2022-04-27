<template>
  <div class="three-container">
    <div class="back-area flex-row" @click="handleRouter">
      <LogoutOutlined />back to home
    </div>
    <canvas class="webgl"></canvas>
  </div>
</template>

<script>
import * as THREE from 'three'
// import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { LogoutOutlined } from '@ant-design/icons-vue'
export default {
  setup () {
    const router = useRouter()
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

      /**
       * Textures
       */
      const textureLoader = new THREE.TextureLoader()

      const doorColorTexture = textureLoader.load(
        'static/textures/door/color.jpg'
      )
      const doorAlphaTexture = textureLoader.load(
        'static/textures/door/alpha.jpg'
      )
      const doorAmbientOcclusionTexture = textureLoader.load(
        'static/textures/door/ambientOcclusion.jpg'
      )
      const doorHeightTexture = textureLoader.load(
        'static/textures/door/height.jpg'
      )
      const doorNormalTexture = textureLoader.load(
        'static/textures/door/normal.jpg'
      )
      const doorMetalnessTexture = textureLoader.load(
        'static/textures/door/metalness.jpg'
      )
      const doorRoughnessTexture = textureLoader.load(
        'static/textures/door/roughness.jpg'
      )

      const bricksColorTexture = textureLoader.load(
        'static/textures/bricks/color.jpg'
      )
      const bricksAmbientOcclusionTexture = textureLoader.load(
        'static/textures/bricks/ambientOcclusion.jpg'
      )
      const bricksNormalTexture = textureLoader.load(
        'static/textures/bricks/normal.jpg'
      )
      const bricksRoughnessTexture = textureLoader.load(
        'static/textures/bricks/roughness.jpg'
      )

      const grassColorTexture = textureLoader.load(
        'static/textures/grass/color.jpg'
      )
      const grassAmbientOcclusionTexture = textureLoader.load(
        'static/textures/grass/ambientOcclusion.jpg'
      )
      const grassNormalTexture = textureLoader.load(
        'static/textures/grass/normal.jpg'
      )
      const grassRoughnessTexture = textureLoader.load(
        'static/textures/grass/roughness.jpg'
      )

      // Ambient light
      const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
      // gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
      scene.add(ambientLight)

      // Directional light
      const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.5)
      moonLight.position.set(4, 5, -2)
      scene.add(moonLight)

      const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
      doorLight.position.set(0, 2.2, 2.7)

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
        new THREE.MeshStandardMaterial({
          map: bricksColorTexture,
          aoMap: bricksAmbientOcclusionTexture,
          normalMap: bricksNormalTexture,
          roughnessMap: bricksRoughnessTexture
        })
      )
      walls.geometry.setAttribute(
        'uv2',
        new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
      )

      // 屋顶
      const roof = new THREE.Mesh(
        new THREE.ConeGeometry(3.5, 1, 4),
        new THREE.MeshStandardMaterial({ color: '#b35f45' })
      )

      roof.position.y = 1.75
      roof.rotation.y = Math.PI * 0.25

      // 门
      const door = new THREE.Mesh(
        new THREE.PlaneGeometry(1.8, 2.2, 100, 1000),
        new THREE.MeshStandardMaterial({
          map: doorColorTexture,
          // 用于控制整个表面的不透明度。（黑色：完全透明；白色：完全不透明）
          alphaMap: doorAlphaTexture,
          // 该纹理的红色通道用作环境遮挡贴图。
          aoMap: doorAmbientOcclusionTexture,
          //   位移贴图会影响网格顶点的位置，与仅影响材质的
          //   光照和阴影的其他贴图不同，移位的顶点可以投射
          //   阴影，阻挡其他对象， 以及充当真实的几何体。位
          //   移纹理是指：
          // 网格的所有顶点被映射为图像中每个像素的值（白色是最高的），并且被重定位。
          displacementMap: doorHeightTexture,
          // 用于创建法线贴图的纹理。RGB值会影响每个像素片段的曲面法线，
          // 并更改颜色照亮的方式。法线贴图不会改变曲面的实际形状，只会改变光照。
          normalMap: doorNormalTexture,
          // 该纹理的蓝色通道用于改变材质的金属度。
          metalnessMap: doorMetalnessTexture,
          // 该纹理的绿色通道用于改变材质的粗糙度。
          roughnessMap: doorRoughnessTexture,
          transparent: true,
          displacementScale: 0.1
        })
      )

      door.geometry.setAttribute(
        'uv2',
        new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
      )

      door.position.set(0, -0.25, 2.01)

      const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
      const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' })

      const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
      bush1.scale.set(0.5, 0.5, 0.5)
      bush1.position.set(1, -0.7, 2.2)

      const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
      bush2.scale.set(0.25, 0.25, 0.25)
      bush2.position.set(1.4, -0.9, 2.5)

      const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
      bush3.scale.set(0.5, 0.5, 0.5)
      bush3.position.set(-1, -0.7, 2.2)

      const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
      bush4.scale.set(0.25, 0.25, 0.25)
      bush4.position.set(-1.4, -0.9, 2.5)

      house.add(bush1, bush2, bush3, bush4)

      house.add(walls)
      house.add(roof)
      house.add(door)
      house.add(doorLight)

      // floor
      const floor = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(20, 20),
        new THREE.MeshStandardMaterial({
          map: grassColorTexture,
          aoMap: grassAmbientOcclusionTexture,
          normalMap: grassNormalTexture,
          roughnessMap: grassRoughnessTexture
        })
      )
      floor.geometry.setAttribute(
        'uv2',
        new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
      )
      grassColorTexture.wrapS = THREE.RepeatWrapping
      grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
      grassNormalTexture.wrapS = THREE.RepeatWrapping
      grassRoughnessTexture.wrapS = THREE.RepeatWrapping
      grassColorTexture.wrapT = THREE.RepeatWrapping
      grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
      grassNormalTexture.wrapT = THREE.RepeatWrapping
      grassRoughnessTexture.wrapT = THREE.RepeatWrapping
      grassColorTexture.repeat.set(8, 8)
      grassAmbientOcclusionTexture.repeat.set(8, 8)
      grassNormalTexture.repeat.set(8, 8)
      grassRoughnessTexture.repeat.set(8, 8)
      floor.rotation.x = -Math.PI * 0.5
      floor.position.y = -1.251

      // graves
      const graves = new THREE.Group()
      const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2)
      const graveMaterial = new THREE.MeshStandardMaterial({
        color: '#b2b6b1'
      })
      const graveCount = 50

      for (let i = 0; i < graveCount; i++) {
        const r = Math.random() * (9 - 4 + 1) + 4
        const angle = Math.random() * 360
        const x = Math.cos(angle) * r
        const z = Math.sin(angle) * r

        const grave = new THREE.Mesh(graveGeometry, graveMaterial)
        grave.position.set(x, -0.8, z)

        grave.rotation.y = (Math.random() - 0.5) * 0.4
        grave.rotation.z = (Math.random() - 0.5) * 0.4
        graves.add(grave)
      }

      scene.add(graves)
      scene.add(house)
      scene.add(floor)

      /**
       * Ghosts
       */
      const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
      const ghost2 = new THREE.PointLight('#00ffff', 2, 3)
      const ghost3 = new THREE.PointLight('#ffff00', 2, 3)
      scene.add(ghost1, ghost3)

      const fog = new THREE.Fog('#262837', 1, 15)
      scene.fog = fog

      // help
      const axesHelper = new THREE.AxesHelper(5)
      scene.add(axesHelper)

      // renderer
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas
      })
      renderer.setSize(sizes.width, sizes.height)
      // dpi or 2
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor('#262837')
      renderer.shadowMap.enabled = true
      floor.receiveShadow = true
      moonLight.castShadow = true
      doorLight.castShadow = true
      ghost1.castShadow = true
      ghost2.castShadow = true
      ghost3.castShadow = true
      walls.castShadow = true
      bush1.castShadow = true
      bush2.castShadow = true
      bush3.castShadow = true
      bush4.castShadow = true
      for (let i = 0; i < graveCount; i++) {
        graves.children[i].castShadow = true
      }
      moonLight.shadow.mapSize.width = 256
      moonLight.shadow.mapSize.height = 256
      moonLight.shadow.camera.far = 15

      doorLight.shadow.mapSize.width = 256
      doorLight.shadow.mapSize.height = 256
      doorLight.shadow.camera.far = 7

      ghost1.shadow.mapSize.width = 256
      ghost1.shadow.mapSize.height = 256
      ghost1.shadow.camera.far = 7

      ghost2.shadow.mapSize.width = 256
      ghost2.shadow.mapSize.height = 256
      ghost2.shadow.camera.far = 7
      ghost3.shadow.mapSize.width = 256
      ghost3.shadow.mapSize.height = 256
      ghost3.shadow.camera.far = 7

      renderer.shadowMap.type = THREE.PCFSoftShadowMap

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

        const ghost1Angle = elapsedTime * 0.5
        ghost1.position.x = Math.cos(ghost1Angle) * 5
        ghost1.position.z = Math.sin(ghost1Angle) * 5
        ghost1.position.y = Math.sin(elapsedTime * 3)

        const ghost3Angle = -elapsedTime * 0.18
        ghost3.position.x =
        Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
        ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
        ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

        // Update controls
        controls.update()

        // Render
        renderer.render(scene, camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
      }

      tick()
    })
    // methods
    const handleRouter = () => {
      router.push({ name: '首页' })
    }

    return {
      handleRouter
    }
  },
  components: {
    LogoutOutlined
  }
}
</script>

<style lang="less" scoped>
.three-container {
  width: 100%;
  height: 100%;
  position: absolute;
}

.back-area {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #fff;
  line-height: 19px;
  color: #000;
  padding: 6px 12px;
  width: 130px;
  height: 32px;
  text-align: center;
  z-index: 10;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
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
