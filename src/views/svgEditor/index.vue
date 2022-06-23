<template>
  <div class="canvas-container flex-row" @mouseup="cancleDragger">
    <div class="canvas flex-row fill-flex">
      <canvas-box :w="w" :h="h" :grid="grid"
      :path="generatepath" :ctrl="ctrl"
      :points="points" @addPoint="addPoint"
      :activePoint="activePoint"
      :draggedPoint="draggedPoint"
      :draggedQuadratic="draggedQuadratic"
      :draggedCubic="draggedCubic"
      @setPointValue="setPointValue"
      @setQuadraticPointValue="setQuadraticPointValue"
      @setCubicCoords="setCubicCoords"
      @handlePointDragger="handlePointDragger"
      @handleDraggerQua="handleDraggerQua"
      @handleSetCubic="handleSetCubic"
      ></canvas-box>
    </div>

    <div class="control-panel flex-row">
      <controls
      v-model:w="w"
      v-model:h="h"
      :path="generatepath"
      v-model:size="grid.size"
      v-model:show="grid.show"
      @handleRPath="handleRPath"
      @handleType="handleLineType"
      :lineType="lineType">
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
      points: [],
      activePoint: 0,
      draggedPoint: false,
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
      // 更新当前激活点下标 + 1
      state.activePoint = state.points.length
      createPoint()
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
      const active = state.activePoint - 1

      if (active !== 0) {
        const v = state.lineType

        switch (v) {
          case 'Q':
            points[active] = {
              x: points[active].x,
              y: points[active].y,
              q: {
                x: (points[active].x + points[active - 1].x - 50) / 2,
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
      state.points[state.activePoint - 1].x = value.x
      state.points[state.activePoint - 1].y = value.y
    }

    const setQuadraticPointValue = (value) => {
      state.points[state.activePoint - 1].q.x = value.x
      state.points[state.activePoint - 1].q.y = value.y
    }

    const setCubicCoords = (value) => {
      state.points[state.activePoint - 1].c[state.draggedCubic].x = value.x
      state.points[state.activePoint - 1].c[state.draggedCubic].y = value.y
    }

    // 处理拖拽点逻辑
    const handlePointDragger = (index) => {
      // 排除 ctrl 状态
      if (!state.ctrl) {
        state.activePoint = index + 1
        state.draggedPoint = true
      }
    }

    // 处理二次贝塞尔曲线控制点拖拽
    const handleDraggerQua = (index) => {
      if (!state.ctrl) {
        state.draggedQuadratic = true
        state.activePoint = index + 1
      }
    }

    // 处理三次贝塞尔曲线控制点拖拽
    const handleSetCubic = (value) => {
      if (!state.ctrl) {
        // 当前激活点下标
        state.activePoint = value.cubicIndexValue + 1
        // 手柄下标
        state.draggedCubic = value.index
      }
    }

    // 取消拖拽状态
    const cancleDragger = () => {
      state.draggedPoint = false
      state.draggedQuadratic = false
      state.draggedCubic = false
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
      setPointValue,
      handlePointDragger,
      cancleDragger,
      handleDraggerQua,
      handleSetCubic,
      setQuadraticPointValue,
      setCubicCoords
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
