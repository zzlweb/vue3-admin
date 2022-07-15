<template>
  <div id="container"></div>
</template>

<script>
import { onMounted, nextTick, onUnmounted } from 'vue'
import { ThreeEngine } from '@/utils/threeEngine.js'
import { throttle } from 'lodash'
export default {
  // 创建场景
  setup () {
    // DOM 挂载
    let dom
    let t

    const resize = () => {
      nextTick(() => {
        dom = document.querySelector('#container')
        t.onWindowResize(dom)
      })
    }

    const tick = () => {
    // const elapsedTime = this.clock.getElapsedTime()
      window.requestAnimationFrame(tick)
      t.controls.update()
      t.render()
      t.water.material.uniforms.time.value += 1.0 / 60.0
    }

    onMounted(() => {
      // 实例化
      nextTick(() => {
        dom = document.querySelector('#container')
        t = new ThreeEngine(dom)

        tick(t)
      })

      resize()
      // 自适应操作
      window.addEventListener('resize', throttle(resize, 200))
    })

    onUnmounted(() => {
      t.renderer.dispose()
      t.Scene.clear()
      window.removeEventListener('resize', resize)
    })
  }
}
</script>

<style lang="less" scoped>
#container {
  width: 100% !important;
  height: 100% !important;
}
</style>
