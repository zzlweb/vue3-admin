<template>
  <div class="canvas-container flex-row" @mouseup="cancleDragger">
    <div class="canvas flex-row fill-flex">
      <canvas-box :w="w" :h="h" :grid="grid" :path="generatepath" :ctrl="ctrl" :points="points" @addPoint="addPoint" :activePoint="activePoint" :draggedPoint="draggedPoint" :draggedCubic="draggedCubic" @setPointValue="setPointValue" @setCubicCoords="setCubicCoords" @handlePointDragger="handlePointDragger" @handleSetCubic="handleSetCubic"></canvas-box>
    </div>

    <div class="control-panel flex-row">
      <controls :path="generatepath" v-model:show="grid.show" @handleRPath="handleRPath" :lineType="lineType">
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
      w: 500,
      h: 1500,
      grid: {
        show: true,
        snap: true,
        size: 10
      },
      ctrl: false,
      points: [
        {
          x: 0,
          y: 1000
        },
        // { x: 140, y: 620, c: [{ x: 160, y: 850 }, { x: 160, y: 850 }] },
        {
          x: 500,
          y: 500,
          c: [
            { x: 0, y: 1000 },
            { x: 500, y: 500 }
          ]
        }
      ],
      activePoint: 0,
      draggedPoint: false,
      draggedCubic: false,
      lineType: 'C',
      // 是否移动了终点坐标
      lineEndMove: false
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
      if (value.y > state.h * 2 / 3 || value.y < state.h / 3) return
      // 判断是否移动了终点坐标
      if (state.points[state.points.length - 1].x !== state.w || state.points[state.points.length - 1].y !== state.w) {
        state.lineEndMove = true
        // 移动了终点，从终点之后添加坐标
        state.points.push(value)
        // 更新当前激活点下标 + 1 值
        state.activePoint = state.points.length
      } else {
        state.lineEndMove = false
        // 对比添加点的坐标, 介于当前存在的那两个坐标之间，将坐标添加到相应位置, 并获取下标
        state.points.splice(state.points.length - 1, 0, value)

        // 更新当前激活点下标 + 1
        state.activePoint = state.points.length - 1
      }

      createPoint()
    }

    // 计算生成path
    const generatepath = computed(() => {
      const { points } = state
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
        d += `${p.x} ${p.y}`
      })

      return d
    })

    // 处理重新绘制path
    const handleRPath = () => {
      state.points = [
        {
          x: 0,
          y: 1000
        },
        {
          x: 500,
          y: 500,
          c: [
            { x: 0, y: 1000 },
            { x: 500, y: 500 }
          ]
        }
      ]
      state.activePoint = 0
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
                  x: (points[active].x + points[active - 1].x) / 2,
                  y: (points[active].y + points[active - 1].y) / 2
                },
                {
                  x: (points[active].x + points[active - 1].x) / 2,
                  y: (points[active].y + points[active - 1].y) / 2
                }
              ]
            }
            break
        }

        // 更改下段曲线的c 的第一个坐标为
        state.points = points
      }
    }

    // 拖拽后坐标改变,  同步值到 state
    const setPointValue = (value) => {
      state.points[state.activePoint - 1].x = value.x
      state.points[state.activePoint - 1].y = value.y
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
      setPointValue,
      handlePointDragger,
      cancleDragger,
      handleSetCubic,
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
    overflow: hidden;
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
