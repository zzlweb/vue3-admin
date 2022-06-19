<template>
  <div class="canvas-container flex-row">
    <div class="canvas">
      <canvas-box :w="w" :h="h" :grid="grid"></canvas-box>
    </div>

    <div class="control-panel">
      <Controls
        v-model:w="w"
        v-model:h="h"
        v-model:size="grid.size"
        >
      </Controls>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, onUnmounted, toRefs } from 'vue'
import Controls from './controls.vue'
import CanvasBox from './canvas.vue'
export default defineComponent({
  components: {
    Controls,
    CanvasBox
  },
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
        {
          x: 500,
          y: 300,
          c: [
            { x: 450, y: 550 },
            { x: 450, y: 50 }
          ]
        },
        {
          x: 600,
          y: 300,
          c: [
            { x: 550, y: 50 },
            { x: 550, y: 550 }
          ]
        },
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

    onMounted(() => {
      document.addEventListener('keydown', handleKeyDown, false)
      document.addEventListener('keyup', handleKeyUp, false)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    })

    return {
      ...toRefs(state)
    }
  }
})
</script>

<style lang="less" scoped>
.canvas-container {
  height: 100%;

  .control-panel {
    position: absolute;
    top: 0;
    right: 0;
    border: 1px solid rgb(214, 213, 213);
    min-height: 100%;
    border-radius: 4px;
  }
}
</style>
