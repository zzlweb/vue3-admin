
// 创建three.js 类
import * as THREE from 'three'
import {
  WebGLRenderer, PerspectiveCamera, Scene, AmbientLight,
  Clock, PlaneGeometry, TextureLoader,
  AxesHelper,
  Curve
} from 'three'
import { Water } from 'three/examples/jsm/objects/Water.js'
import { getPoints } from './utils'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// const waypoints = [[0, 0, 0], [0, 0, 10], [20, 0, 10], [20, 20, 20], [20, 20, 40], [30, 20, 40]]
export class ThreeEngine {
  /**
   *
   * @param {*} dom 要挂载的dom实例
   */
  constructor (dom) {
    // 渲染器
    this.renderer = new WebGLRenderer({
      antialias: true
    })
    // 相机
    this.camera = new PerspectiveCamera(
      35,
      dom.offsetWidth / dom.offsetWidth,
      1,
      1000
    )
    // 场景
    this.Scene = new Scene()

    // 环境灯光
    this.light = new AmbientLight(0xffffff, 1)
    this.point = new THREE.PointLight(0xffffff)
    this.point.position.set(110, 100, 0) // 点光源位置
    this.Scene.add(this.point) // 点光源添加到场景中

    this.renderer.setSize(dom.offsetWidth, dom.offsetHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    dom.appendChild(this.renderer.domElement)

    this.camera.position.set(310, 300, 0)
    this.camera.lookAt(this.Scene.position)

    this.Scene.add(this.light)

    this.clock = new Clock()

    // Axes help 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
    this.AxesHelp()
    // GUI
    // this.buildGui()

    // ground
    this.ground()

    // 鼠标控制器
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.enablePan = false

    // line init
    // this.TubeLineCircle(waypoints, 8, { color: '#0f6' })

    // 模型加载
    this.loadModel()
  }

  render () {
    this.renderer.render(this.Scene, this.camera)
  }

  // AxesHelper
  AxesHelp () {
    var axesHelper = new AxesHelper(30)
    this.Scene.add(axesHelper)
  }

  // ground
  ground () {
    const geometry = new PlaneGeometry(12, 230)
    this.water = new Water(
      geometry,
      {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load('static/textures/water/waternormals.jpg', function (texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        }),
        alpha: 1,
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x2c8ade,
        distortionScale: 3.5
        // side: DoubleSide
      }
    )
    this.water.position.z = 2
    this.water.position.x = -1
    this.water.position.z = -85
    this.water.rotation.x = -Math.PI / 2
    this.water.rotation.z = -Math.PI / 2
    // const ground = new PlaneGeometry(200, 200)
    // const match = new MeshMatcapMaterial({ color: 0xffffff })
    // const mesh = new THREE.Mesh(ground, match)
    this.Scene.add(this.water)
    // this.Scene.add(mesh)
  }

  // loadModel
  loadModel () {
    const loader = new GLTFLoader()
    loader.load('static/model/ls.glb', (gltf) => {
      console.log(gltf.scene)
      gltf.scene.position.x = -46
      gltf.scene.position.z = -30
      this.Scene.add(gltf.scene)
    }, (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    }, (error) => {
      console.error(error)
    })
  }

  // line
  TubeLineCircle (waypoints, radius, materialConfig) {
    const textureLoader = new TextureLoader()
    const texture = textureLoader.load('../assets/logo.png')
    // 设置阵列模式 RepeatWrapping
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    // 设置x方向的重复数(沿着管道路径方向)
    // 设置y方向的重复数(环绕管道方向)
    texture.repeat.x = 20
    texture.repeat.y = 4
    // 设置管道纹理偏移数,便于对中
    texture.offset.y = 0.5

    // 为线添加作用点，并按转角进行分组
    var pts = getPoints(waypoints, radius)
    var ln = new Curve(pts)

    const geometry = new THREE.TubeGeometry(ln, 200, 2, 18, false)
    const material = new THREE.MeshBasicMaterial({ map: texture })
    const mesh = new THREE.Mesh(geometry, material)

    var matrix = new THREE.Matrix4()
    mesh.applyMatrix(matrix.makeTranslation(-50, 0, 0))

    this.Scene.add(mesh)
  }

  // 自适应
  onWindowResize (D) {
    this.camera.aspect = D.offsetWidth / D.offsetHeight
    this.renderer.setSize(D.offsetWidth, D.offsetHeight)
    this.camera.updateProjectionMatrix()
    this.render()
  }
}
