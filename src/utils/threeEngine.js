
// 创建three.js 类
import { WebGLRenderer, PerspectiveCamera, Scene, AmbientLight, Mesh, BoxGeometry, MeshStandardMaterial } from 'three'
export class ThreeEngine {
  /**
   *
   * @param {*} dom 要挂载的dom实例
   */
  constructor (dom) {
    this.dom = dom
    // 渲染器
    this.renderer = new WebGLRenderer({
      canvas: dom
    })
    // 相机
    this.camera = new PerspectiveCamera(
      75,
      dom.offsetWidth / dom.offsetWidth,
      0.1,
      1000
    )
    // 场景
    this.Scene = new Scene()

    // 灯光
    this.light = new AmbientLight(0xffffff)

    this.renderer.setSize(dom.offsetWidth, dom.offsetHeight, true)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    this.camera.position.set(0, 0, 3)
    this.camera.lookAt(this.Scene.position)

    // 物体
    const box = new Mesh(
      new BoxGeometry(1, 1, 1),
      new MeshStandardMaterial({
        color: 0x0000ff
      })
    )

    this.Scene.add(box)
    this.Scene.add(this.light)
    this.renderer.render(this.Scene, this.camera)
  }
}
