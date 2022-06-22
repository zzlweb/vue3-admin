<template>
  <div class="canvas-container flex-row">
    <div class="canvas flex-row fill-flex">
      <canvas-box :w="w" :h="h" :grid="grid"
      :path="generatepath" :ctrl="ctrl"
      :points="points" @addPoint="addPoint"
      :activePoint="activePoint"
      :draggedPoint="draggedPoint"
      :draggedQuadratic="draggedQuadratic"
      :draggedCubic="draggedCubic"
      @setPointValue="setPointValue"
      ></canvas-box>
    </div>

    <div class="control-panel flex-row">
      <controls v-model:w="w" v-model:h="h" v-model:size="grid.size" v-model:show="grid.show" @handleRPath="handleRPath" @handleType="handleLineType" :lineType="lineType">
      </controls>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  onMounted,
  reactive,
  onUnmounted,
  toRefs,
  watch,
  ref,
  computed
} from 'vue'
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
        // { x: 200, y: 300, q: { x: 150, y: 50 } }
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
      activePoint: 0,
      draggedPoint: true,
      draggedQuadratic: false,
      draggedCubic: false,
      closePath: false,
      lineType: 'Q'
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
      createPoint()
      // 更新当前激活点
      state.activePoint = state.points.length
    }

    // 暂定监听重置点
    watch(
      () => state.grid.size,
      (newValue, oldValue) => {
        handleRPath()
      }
    )

    // 计算生成path
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
        }
        d += `${p.x} ${p.y} `
      })

      if (closePath) d += 'Z'
      return d
    })

    // 处理重新绘制path
    const handleRPath = () => {
      state.points = []
      state.activePoint = 0
    }

    // 切换曲线生成类型,并根据类型生成point
    const handleLineType = (e) => {
      state.lineType = e.target.value
    }

    // 根据不同曲线类型,变化添加的点坐标
    const createPoint = () => {
      const points = state.points
      const active = state.activePoint

      // not the first point
      if (active !== 0) {
        const v = state.lineType

        switch (v) {
          case 'Q':
            points[active] = {
              x: points[active].x,
              y: points[active].y,
              q: {
                x: (points[active].x + points[active - 1].x) / 2 - 50,
                y: (points[active].y + points[active - 1].y) / 2
              }
            }
            break
          case 'C':
            points[active] = {
              x: points[active].x,
              y: points[active].y,
              c: [
                {
                  x: (points[active].x + points[active - 1].x - 50) / 2,
                  y: (points[active].y + points[active - 1].y) / 2
                },
                {
                  x: (points[active].x + points[active - 1].x + 50) / 2,
                  y: (points[active].y + points[active - 1].y) / 2
                }
              ]
            }
            break
        }

        state.points = points
      }
    }

    // 拖拽后坐标改变,  同步值到 state
    const setPointValue = (value) => {
      console.log(value)
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
      handleRPath,
      handleLineType,
      setPointValue
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
