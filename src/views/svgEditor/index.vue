<template>
  <div class="canvas-container flex-row" @mouseup="cancleDragger" @mouseleave="cancleDragger">
    <div class="canvas flex-row fill-flex">
      <canvas-box :Histogram="Histogram" :cubicNumber="cubicNumber" :w="w" :h="h" :grid="grid" :keyframePoint="keyframePoint" :path="generatepath" :ctrl="ctrl" :points="points" @addPoint="addPoint" :activePoint="activePoint" :draggedPoint="draggedPoint" :draggedCubic="draggedCubic" @setPointValue="setPointValue" @setCubicCoords="setCubicCoords" @handlePointDragger="handlePointDragger" @handleSetCubic="handleSetCubic"></canvas-box>
    </div>

    <div class="control-panel flex-row">
      <controls v-model:Histogram="Histogram" :cubicNumber="cubicNumber" :cubicPath="cubicValue" :keyframePoint="keyframePoint" v-model:time="time" v-model:show="grid.show" @handleRPath="handleRPath" :lineType="lineType" v-model:mosueType="mosueType">
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
  computed,
  watch
} from 'vue'
import Controls from './controls.vue'
import CanvasBox from './canvas.vue'
import {
  getMirrorPoint,
  throttle,
  getAnglePoint,
  getDistance,
  Bezier,
  removeDuplicates,
  getEvenNumber
} from './utils'

export default defineComponent({
  components: {
    Controls,
    CanvasBox
  },
  setup () {
    // 状态定义
    const state = reactive({
      // 画布宽高
      w: 500,
      h: 1500,
      // 画布设置
      grid: {
        // 是否显示画布
        show: true,
        // 画布单位
        size: 10
      },
      // 是否按下ctrl
      ctrl: false,
      // 初始设置点坐标
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
      // 当前激活点下标
      activePoint: 0,
      // 是否拖拽点
      draggedPoint: false,
      // 是否拖拽手柄
      draggedCubic: false,
      // 曲线模式三次贝塞尔曲线
      lineType: 'C',
      // 是否移动了终点坐标
      lineEndMove: false,
      // 当前手柄的拖动呈现方式
      mosueType: 4,
      // 动画时间
      time: 3,
      // 原始分割点
      DupPointArray: [],
      // 分割曲线下标
      splitIndex: null,
      // 过滤后曲线分割为点集合,
      pointArray: [],
      // 输出动画
      keyframePoint: [],
      // 运动类型
      animateType: 'scale',
      // 是否显示柱状图
      Histogram: true,
      // 新增点是否为拆分点
      isSplit: false
    })

    // 处理键盘按下
    const handleKeyDown = (e) => {
      // 判断是否点击ctrl
      if (e.keyCode === 17 || (e.key === 'Meta' && e.keyCode === 91)) {
        state.ctrl = true
      }
    }
    // 处理键盘抬起
    const handleKeyUp = (e) => {
      state.ctrl = false
    }

    // 当前为一条贝塞尔曲线返回为false 否则为true
    const cubicNumber = computed(() => {
      return state.points.length > 2
    })

    // 根据曲线控制坐标点, 获取该段曲线上的点的坐标
    const getPathPoint = () => {
      // 重置pointArray
      state.pointArray = []
      const BZ = new Bezier()

      for (let i = 1; i < state.points.length; i++) {
        const point = BZ.getBezierPoints(
          100,
          [state.points[i - 1].x, state.points[i - 1].y],
          [state.points[i].c[0].x, state.points[i].c[0].y],
          [state.points[i].c[1].x, state.points[i].c[1].y],
          [state.points[i].x, state.points[i].y]
        )
        state.pointArray.push(point)
      }
      // 拼接
      state.pointArray = [].concat(...state.pointArray)
      state.DupPointArray = state.pointArray

      // 将点处理为标准单位点
      state.pointArray.forEach((item, index) => {
        if (item[0] < 0) {
          item[0] = 0
        } else {
          item[0] = +(item[0] / 500).toFixed(2)
        }
        item[1] = +((1000 - item[1]) / 500).toFixed(2)
      })

      // 筛选多段曲线, 位置重合值不同情况, 按照x值进行排序, 取相同x值得最大值
      state.pointArray.sort(function (a, b) {
        return a[0] - b[0]
      })
      state.pointArray = removeDuplicates(state.pointArray)
    }

    // 处理添加点
    const addPoint = (value) => {
      if (value.y > (state.h * 2) / 3 || value.y < state.h / 3) return
      state.lineEndMove = false
      // 判断是否是拆分曲线, 如果是执行拆分逻辑, 更改全局拆分点添加逻辑。
      value = checkPoint(value)
      if (state.isSplit) {
        // 如果是拆分点, 将拆分点插入到要拆分的两点之间。
        state.points.splice(state.splitIndex + 1, 0, value)
        // 更新当前激活点下标 + 1
        state.activePoint = state.splitIndex + 2
      } else {
        // 将点添加到倒数第二的位置
        state.points.splice(state.points.length - 1, 0, value)
        // 更新当前激活点下标 + 1
        state.activePoint = state.points.length - 1
      }

      // 新增点逻辑
      createPoint()
      // 分割曲线
      getPathPoint()
    }

    // 判断点是否是在贝塞尔曲线之上, 如果是更改全局分割点状态。
    const checkPoint = (value) => {
      // 标准单位化当前点击点, 与现存曲线点进行匹配。
      const Npoint = []

      Npoint[0] = +(value.x / 500).toFixed(2)
      Npoint[1] = +((1000 - value.y) / 500).toFixed(2)
      let findIndex

      // 问题待修复
      for (let i = 0; i < state.DupPointArray.length; i++) {
        if (
          (Math.abs(Npoint[0] - state.DupPointArray[i][0]) <= 0.04) &&
           (Math.abs(Npoint[1] - state.DupPointArray[i][1]) <= 0.04)
        ) {
          findIndex = i
          break
        }
      }

      if (findIndex) {
        // 计算所添加点为第几线段
        // eslint-disable-next-line func-call-spacing
        state.splitIndex = Math.floor(findIndex / 100)
        state.isSplit = true
        // 判断 Y 值是否在曲线上下 30 区间
        // eslint-disable-next-line no-unexpected-multiline
        // (Math.abs(Npoint[1] - state.DupPointArray[findIndex][1]) <= 0.02) &&
        // (Math.abs(Npoint[0] - state.DupPointArray[findIndex][0]) <= 0.02)
        //   ? (state.isSplit = true)
        //   : (state.isSplit = false)
        // console.log(state.isSplit)
        // 如果是拆分点, 将点修改为最近曲线点, 否则返回原来点击点坐标
        return {
          x: state.DupPointArray[findIndex][0] * 500,
          y: 1000 - state.DupPointArray[findIndex][1] * 500
        }
      } else {
        return value
      }
    }

    // 计算生成path
    const generatepath = computed(() => {
      const { points } = state
      let d = ''

      points.forEach((p, i) => {
        if (i === 0) {
          // first point
          d += 'M '
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
      getPathPoint()
    }

    // 根据不同曲线类型,变化添加的点坐标
    const createPoint = () => {
      const points = state.points
      const active = state.activePoint - 1

      if (active !== 0) {
        const v = state.lineType

        switch (v) {
          case 'C':
            // 判断前一段是否为起点, 如果是起点, 设置控制手柄为原点
            if (active === 1) {
              points[active] = {
                x: points[active].x,
                y: points[active].y,
                c: [
                  {
                    x: 0,
                    y: (state.h * 2) / 3
                  },
                  // 前一个点的第一个控制点的对称点
                  {
                    x: (points[active].x + points[active - 1].x) / 2,
                    y: (points[active].y + points[active - 1].y) / 2 - 50
                  }
                ]
              }
            } else {
              if (state.isSplit) {
                points[active] = {
                  x: points[active].x,
                  y: points[active].y,
                  c: [
                    // A 点坐标
                    {
                      x: (points[active - 1].x + points[active + 1].c[0].x) / 2,
                      y: (points[active - 1].y + points[active + 1].c[0].y) / 2
                    },
                    // D 点坐标
                    {
                      x:
                        ((points[active + 1].c[0].x +
                          points[active + 1].c[1].x) /
                          2 +
                          (points[active - 1].x + points[active + 1].c[0].x) /
                            2) /
                        2,
                      y:
                        ((points[active + 1].c[0].y +
                          points[active + 1].c[1].y) /
                          2 +
                          (points[active - 1].y + points[active + 1].c[0].y) /
                            2) /
                        2
                    }
                  ]
                }

                points[active + 1].c[1] = {
                  x:
                      (points[active + 1].x + points[active + 1].c[1].x) /
                        2,
                  y:
                      (points[active + 1].y + points[active + 1].c[1].y) /
                        2
                }
              } else {
                points[active] = {
                  x: points[active].x,
                  y: points[active].y,
                  c: [
                    {
                      x: (points[active].x + points[active - 1].x) / 2,
                      y: (points[active].y + points[active - 1].y) / 2 + 50
                    },
                    {
                      x: (points[active].x + points[active - 1].x) / 2,
                      y: (points[active].y + points[active - 1].y) / 2 - 50
                    }
                  ]
                }
              }
            }

            break
        }
        // 求新增点手柄的镜像坐标
        points[active + 1].c[0].x = getMirrorPoint(
          { x: points[active].x, y: points[active].y },
          { x: points[active].c[1].x, y: points[active].c[1].y },
          state.w
        ).x
        points[active + 1].c[0].y = getMirrorPoint(
          { x: points[active].x, y: points[active].y },
          { x: points[active].c[1].x, y: points[active].c[1].y },
          state.w
        ).y

        // 判断是否为起点，设置起点手柄
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
        state.isSplit = false
      }
    }

    // 拖拽后坐标改变,  同步值到 state
    const setPointValue = (value) => {
      // 需要补充逻辑，如果为起点或终点坐标不移动
      if (
        state.activePoint - 1 === 0 ||
        state.activePoint === state.points.length
      ) {
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

      if (state.points.length > 2) {
        throttle(getPathPoint, 5, this)
      }
    }

    // 拖拽手柄改变坐标
    const setCubicCoords = (value) => {
      // 手柄坐标等于鼠标坐标
      state.points[state.activePoint - 1].c[state.draggedCubic].x =
        +value.x.toFixed(2)
      state.points[state.activePoint - 1].c[state.draggedCubic].y =
        +value.y.toFixed(2)

      // 同等改变镜像手柄的坐标值 ,排除起点坐标或者终点坐标, 并根据不同手柄类型，同步对应手柄坐标
      if (state.points.length >= 2) {
        if (
          !(state.activePoint - 2 === 0 && state.draggedCubic === 0) ||
          !(
            state.activePoint === state.points.length &&
            state.draggedCubic === 1
          )
        ) {
          // 拖动点为第一个控制点
          if (state.draggedCubic === 0) {
            if (state.points[state.activePoint - 2].c) {
              // 等长等角度
              if (state.mosueType === 4) {
                state.points[state.activePoint - 2].c[1].x = getMirrorPoint(
                  {
                    x: state.points[state.activePoint - 2].x,
                    y: state.points[state.activePoint - 2].y
                  },
                  { x: value.x, y: value.y },
                  state.w
                ).x
                state.points[state.activePoint - 2].c[1].y = getMirrorPoint(
                  {
                    x: state.points[state.activePoint - 2].x,
                    y: state.points[state.activePoint - 2].y
                  },
                  { x: value.x, y: value.y },
                  state.w
                ).y
                // 等角度
              } else if (state.mosueType === 3) {
                const { degrees } = getAnglePoint(
                  { x: value.x, y: value.y },
                  {
                    x: state.points[state.activePoint - 2].x,
                    y: state.points[state.activePoint - 2].y
                  }
                )
                const radius = getDistance(
                  {
                    x: state.points[state.activePoint - 2].x,
                    y: state.points[state.activePoint - 2].y
                  },
                  {
                    x: state.points[state.activePoint - 2].c[1].x,
                    y: state.points[state.activePoint - 2].c[1].y
                  }
                )
                state.points[state.activePoint - 2].c[1].x = +(
                  state.points[state.activePoint - 2].x -
                  radius * Math.cos((degrees * Math.PI) / 180)
                ).toFixed(2)
                state.points[state.activePoint - 2].c[1].y = +(
                  state.points[state.activePoint - 2].y -
                  radius * Math.sin((degrees * Math.PI) / 180)
                ).toFixed(2)
                // 无手柄
              } else if (state.mosueType === 1) {
                state.points[state.activePoint - 2].c[1].x =
                  state.points[state.activePoint - 2].x
                state.points[state.activePoint - 2].c[1].y =
                  state.points[state.activePoint - 2].y
                // 不等长不等角度
              } else {
                state.mosueType = 2
              }
            }
          } else {
            // 如果存在下段曲线
            if (state.points[state.activePoint]) {
              // 等长等角度
              if (state.mosueType === 4) {
                state.points[state.activePoint].c[0].x = getMirrorPoint(
                  {
                    x: state.points[state.activePoint - 1].x,
                    y: state.points[state.activePoint - 1].y
                  },
                  { x: value.x, y: value.y },
                  state.w
                ).x
                state.points[state.activePoint].c[0].y = getMirrorPoint(
                  {
                    x: state.points[state.activePoint - 1].x,
                    y: state.points[state.activePoint - 1].y
                  },
                  { x: value.x, y: value.y },
                  state.w
                ).y
              } else if (state.mosueType === 3) {
                // 等角度
                const { degrees } = getAnglePoint(
                  { x: value.x, y: value.y },
                  {
                    x: state.points[state.activePoint - 1].x,
                    y: state.points[state.activePoint - 1].y
                  }
                )
                const radius = getDistance(
                  {
                    x: state.points[state.activePoint - 1].x,
                    y: state.points[state.activePoint - 1].y
                  },
                  {
                    x: state.points[state.activePoint].c[0].x,
                    y: state.points[state.activePoint].c[0].y
                  }
                )
                state.points[state.activePoint].c[0].x = +(
                  state.points[state.activePoint - 1].x -
                  radius * Math.cos((degrees * Math.PI) / 180)
                ).toFixed(2)
                state.points[state.activePoint].c[0].y = +(
                  state.points[state.activePoint - 1].y -
                  radius * Math.sin((degrees * Math.PI) / 180)
                ).toFixed(2)
              } else if (state.mosueType === 1) {
                // 无手柄
                state.points[state.activePoint].c[0].x =
                  state.points[state.activePoint - 1].x
                state.points[state.activePoint].c[0].y =
                  state.points[state.activePoint - 1].y
              } else {
                // 不等长不等角度
                state.mosueType = 2
              }
            }
          }
        }
      }

      if (state.points.length > 2) {
        throttle(getPathPoint, 5, this)
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

    // 在一条三次贝塞尔曲线显示cubic
    const cubicValue = computed(() => {
      let cubic = ''
      // 将d 转换成为 cubic
      const path = generatepath.value.split(' ')
      // 匹配到的
      const indexArray = []
      path.forEach((item, index) => {
        if (item.indexOf('C') !== -1) {
          indexArray.push(index)
        }
      })
      const cubicArray = []
      indexArray.forEach((item) => {
        cubicArray.push(path.slice(item + 1, item + 5).map(Number))
      })
      cubicArray.forEach((item) => {
        cubic += `cubic-bezier(${+(item[0] / 500).toFixed(2)}, ${+(
          (1000 - item[1]) /
          500
        ).toFixed(2)}, ${+(item[2] / 500).toFixed(2)}, ${+(
          (1000 - item[3]) /
          500
        ).toFixed(2)})/`
      })
      cubic = cubic.substr(0, cubic.length - 1)
      return cubic
    })

    // 根据曲线点, 生成keyframe
    watch(
      () => state.pointArray,
      (value, oldValue) => {
        // 根据不同的动画类型输出不同的动画
        switch (state.animateType) {
          case 'scale':
            // eslint-disable-next-line no-case-declarations
            const arr = getEvenNumber(value, 15)

            if (arr.some((item) => !item)) {
              return
            }
            state.keyframePoint = arr

            break
        }
      },
      { deep: true }
    )

    onMounted(() => {
      getPathPoint()

      // 监听键盘按下抬起事件
      document.addEventListener('keydown', handleKeyDown, false)
      document.addEventListener('keyup', handleKeyUp, false)
    })

    onUnmounted(() => {
      // 移除键盘按下抬起事件
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
      setCubicCoords,
      cubicValue,
      cubicNumber
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
    width: 300px;
    min-width: 250px;
    border: 1px solid rgb(214, 213, 213);
    min-height: 100%;
    border-radius: 4px;
    justify-content: center;
    overflow: hidden;
  }
}
</style>
