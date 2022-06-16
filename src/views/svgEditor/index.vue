<template>
  <div class="canvas-dom">
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, onUnmounted } from 'vue'

export default defineComponent({
  setup () {
    // 状态定义
    const state = reactive({
      w: 800,
      h: 600,
      grid: {
        show: true,
        snap: true,
        size: 50
      },
      ctrl: false,
      points: [
        { x: 100, y: 300 },
        { x: 200, y: 300, q: { x: 150, y: 50 } },
        { x: 300, y: 300, q: { x: 250, y: 550 } },
        { x: 400, y: 300, q: { x: 350, y: 50 } },
        { x: 500, y: 300, c: [{ x: 450, y: 550 }, { x: 450, y: 50 }] },
        { x: 600, y: 300, c: [{ x: 550, y: 50 }, { x: 550, y: 550 }] },
        { x: 700, y: 300, a: { rx: 50, ry: 50, rot: 0, laf: 1, sf: 1 } }
      ],
      activePoint: 2,
      draggedPoint: false,
      draggedQuadratic: false,
      draggedCubic: false,
      closePath: false
    })
    // 处理键盘按下
    const handleKeyDown = () => {}
    // 处理键盘抬起
    const handleKeyUp = () => {}

    // 设置网格宽度
    const setWidth = (e) => {
      const v = positiveNumber(e.target.value)
    }

    onMounted(() => {
      document.addEventListener('keydown', handleKeyDown, false)
      document.addEventListener('keyup', handleKeyUp, false)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    })
  }
})
</script>

<style lang="less" scoped>
.canvas-dom {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
