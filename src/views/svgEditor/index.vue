<template>
  <div class="canvas-container flex-row">
    <div class="canvas flex-row fill-flex">
      <canvas-box :w="w" :h="h" :grid="grid" :path="generatepath" :ctrl="ctrl" :points="points" @addPoint="addPoint"></canvas-box>
    </div>

    <div class="control-panel flex-row">
      <controls v-model:w="w" v-model:h="h" v-model:size="grid.size" v-model:show="grid.show" @handleRPath="handleRPath">
      </controls>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, onUnmounted, toRefs, watch, ref, computed } from 'vue'
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
      h: 800,
      grid: {
        show: true,
        snap: true,
        size: 50
      },
      ctrl: false,
      points: [
        // { x: 200, y: 300, q: { x: 150, y: 50 } },
        // {
        //   x: 500,
        //   y: 300,
        //   c: [
        //     { x: 450, y: 550 },
        //     { x: 450, y: 50 }
        //   ]
        // },
        // {
        //   x: 600,
        //   y: 300,
        //   c: [
        //     { x: 550, y: 50 },
        //     { x: 550, y: 550 }
        //   ]
        // },
        // { x: 700, y: 300, a: { rx: 50, ry: 50, rot: 0, laf: 1, sf: 1 } }
      ],
      activePoint: 2,
      draggedPoint: false,
      draggedQuadratic: false,
      draggedCubic: false,
      closePath: false
    })

    // 处理键盘按下
    const handleKeyDown = (e) => {
      // 判断是否点击ctrl
      if (e.ctrlKey) state.ctrl = true
    }
    // 处理键盘抬起
    const handleKeyUp = (e) => {
      state.ctrl = false
    }

    // 处理添加点
    const addPoint = (value) => {
      // 获取新添加的点
      state.points.push(value)
      // 更新当前激活点
      state.activePoint = state.points.length - 1
    }

    // 暂定监听重置点
    watch(() => state.grid.size, (newValue, oldValue) => {
      handleRPath()
    })

    // 计算 path
    const generatepath = computed(() => {
      const { points, closePath } = state
      let d = ''

      points.forEach((p, i) => {
        if (i === 0) {
          // first point
          d += 'M '
        } else if (p.q) {
          // quadratic
          d += `Q ${p.q.x} ${p.q.y} `
        } else if (p.c) {
          // cubic
          d += `C ${p.c[0].x} ${p.c[0].y} ${p.c[1].x} ${p.c[1].y} `
        } else if (p.a) {
          // arc
          d += `A ${p.a.rx} ${p.a.ry} ${p.a.rot} ${p.a.laf} ${p.a.sf} `
        } else {
          d += 'L '
        }

        d += `${p.x} ${p.y} `
      })

      if (closePath) d += 'Z'

      console.log(d)

      return d
    })

    // 处理重新绘制path
    const handleRPath = () => {
      state.points = []
    }

    onMounted(() => {
      document.addEventListener('keydown', handleKeyDown, false)
      document.addEventListener('keyup', handleKeyUp, false)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    })

    return {
      ...toRefs(state),
      addPoint,
      generatepath,
      handleRPath
    }
  }
})
</script>

<style lang="less" scoped>
.canvas-container {
  height: 100%;

  .canvas {
    justify-content: center;
    align-items: center;
  }

  .control-panel {
    width: 250px;
    min-width: 250px;
    border: 1px solid rgb(214, 213, 213);
    min-height: 100%;
    border-radius: 4px;
    justify-content: center;
    overflow: hidden;
  }
}
</style>
