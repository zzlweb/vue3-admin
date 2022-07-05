<template>
  <div class="canvas-container flex-row" @mouseup="cancleDragger" @mouseleave="cancleDragger">
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
import { getMirrorPoint } from './utils'
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
      if (value.y > (state.h * 2) / 3 || value.y < state.h / 3) return

      state.lineEndMove = false
      // 将点添加到倒数第二的位置
      state.points.splice(state.points.length - 1, 0, value)
      // 更新当前激活点下标 + 1
      state.activePoint = state.points.length - 1

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
          case 'C':
            // 判断前一段是否为起点
            points[active] = {
              x: points[active].x,
              y: points[active].y,
              c: [
                {
                  x: (points[active].x + points[active - 1].x) / 2,
                  y: (points[active].y + points[active - 1].y) / 2 + 50
                },
                // 前一个点的第一个控制点的对称点
                {
                  x: (points[active].x + points[active - 1].x) / 2,
                  y: (points[active].y + points[active - 1].y) / 2 - 50
                }
              ]
            }
            break
        }
        // 求镜像坐标
        points[active + 1].c[0].x = getMirrorPoint(
          { x: points[active].x, y: points[active].y },
          { x: points[active].c[1].x, y: points[active].c[1].y }, state.w
        ).x
        points[active + 1].c[0].y = getMirrorPoint(
          { x: points[active].x, y: points[active].y },
          { x: points[active].c[1].x, y: points[active].c[1].y }, state.w
        ).y

        // 判断是否为起点
        if (points[active - 1].c) {
          points[active].c[0].x = getMirrorPoint(
            { x: points[active - 1].x, y: points[active - 1].y },
            { x: points[active - 1].c[1].x, y: points[active - 1].c[1].y },
            state.w
          ).x
          points[active].c[0].y = getMirrorPoint(
            { x: points[active - 1].x, y: points[active - 1].y },
            { x: points[active - 1].c[1].x, y: points[active - 1].c[1].y },
            state.w
          ).y
        }

        state.points = points
      }
    }

    // 拖拽后坐标改变,  同步值到 state
    const setPointValue = (value) => {
      // 需要补充逻辑，如果为起点或终点坐标不移动
      if (state.activePoint - 1 === 0 || state.activePoint === state.points.length) {
        return
      }
      // 获取偏移相对值， 同步到相应的手柄
      const x = parseInt(value.x - state.points[state.activePoint - 1].x)
      const y = parseInt(value.y - state.points[state.activePoint - 1].y)

      state.points[state.activePoint - 1].c[1].x += x
      state.points[state.activePoint - 1].c[1].y += y

      state.points[state.activePoint - 1].x = value.x
      state.points[state.activePoint - 1].y = value.y

      state.points[state.activePoint].c[0].x += x
      state.points[state.activePoint].c[0].y += y
    }

    const setCubicCoords = (value) => {
      state.points[state.activePoint - 1].c[state.draggedCubic].x = value.x
      state.points[state.activePoint - 1].c[state.draggedCubic].y = value.y

      // 同等改变镜像手柄的坐标值 ,并且不是起点坐标或者终点坐标
      if (state.points.length >= 2) {
        if (!(state.activePoint - 2 === 0 && state.draggedCubic === 0) || !(state.activePoint === state.points.length && state.draggedCubic === 1)) {
        // 拖动点为第一个控制点
          if (state.draggedCubic === 0) {
            if (state.points[state.activePoint - 2].c) {
              state.points[state.activePoint - 2].c[1].x = getMirrorPoint({ x: state.points[state.activePoint - 2].x, y: state.points[state.activePoint - 2].y }, { x: value.x, y: value.y }, state.w).x
              state.points[state.activePoint - 2].c[1].y = getMirrorPoint({ x: state.points[state.activePoint - 2].x, y: state.points[state.activePoint - 2].y }, { x: value.x, y: value.y }, state.w).y
            }
          } else {
            if (state.points[state.activePoint]) {
              state.points[state.activePoint].c[0].x = getMirrorPoint({ x: state.points[state.activePoint - 1].x, y: state.points[state.activePoint - 1].y }, { x: value.x, y: value.y }, state.w).x
              state.points[state.activePoint].c[0].y = getMirrorPoint({ x: state.points[state.activePoint - 1].x, y: state.points[state.activePoint - 1].y }, { x: value.x, y: value.y }, state.w).y
            }
          }
        }
      }
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
