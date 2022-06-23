<template>
  <div class="svg-dom" ref="svgDom">
    <svg :width="w" :height="h" @click="addPoints" @mousemove="handleMouseMove">

      <defs>
        <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgb(98, 180, 76)" />
          <stop offset="20%" stop-color="rgb(242, 179, 61)" />
          <stop offset="40%" stop-color="rgb(238, 125, 55)" />
          <stop offset="60%" stop-color="rgb(205, 58, 71)" />
          <stop offset="80%" stop-color="rgb(142, 61, 140)" />
          <stop offset="100%" stop-color="rgb(39, 155, 213)" />
        </linearGradient>
      </defs>

      <g :class="{'hidden': !show}" class="add-g">
        <line v-for="(item, index) in Math.round(w/size)" :key="index" :x1="item*size" :y1="0" :x2="item*size" :y2="h">
        </line>
        <line v-for="(item, index) in Math.round(h/size)" :key="index" :x1="0" :y1="item*size" :y2="item*size" :x2="w">
        </line>
      </g>
      <!-- path -->
      <path class="path" fill="url(#linear)" :d="path">
      </path>
      <!-- points -->
      <g>
        <g v-for="(item, index) in points" :key="index" :class="{'point-active': activePoint - 1 === index }">
          <circle :cx="item.x" :cy="item.y" r="8" class="point" @mousedown="handlePointDragger(index)"></circle>
          <cubic v-if="item.c" @handleSetCubic="handleSetCubic" :cubicIndex="index"  :x1="item.c[0].x" :y1="item.c[0].y" :x2="item.c[1].x" :y2="item.c[1].y" :p1x="points[index-1].x" :p1y="points[index-1].y" :p2x="points[index].x" :p2y="points[index].y" />
          <quadratic v-if="item.q" @handleDraggerQua="handleDraggerQua" :quadraticIndex="index" :p1x="points[index - 1].x" :p1y="points[index-1].y" :p2x="item.x" :p2y="item.y" :x="item.q.x" :y="item.q.y"></quadratic>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
import { throttle } from 'lodash'
// dom
import { toRefs, onMounted, ref, onUnmounted } from 'vue'
// 二次贝塞尔曲线控制柄
import cubic from './Cubic.vue'
// 三次贝塞尔曲线控制柄
import Quadratic from './Quadratic.vue'
// point
export default {
  props: {
    w: Number,
    h: Number,
    grid: Object,
    // 键盘是否开启ctrl
    ctrl: Boolean,
    //  默认添加的一些点
    points: Object,
    // 计算所得path
    path: String,
    // 当前激活点下标
    activePoint: Number,
    // 是否拖拽点
    draggedPoint: Boolean,
    // 是否拖拽二次贝塞尔曲线控制柄
    draggedQuadratic: Boolean,
    // 是否拖拽三次贝塞尔曲线控制柄
    draggedCubic: [Boolean, Number]
  },
  components: {
    cubic,
    Quadratic
  },
  setup (props, { emit }) {
    const svgDom = ref(null)
    const CurrentAddPoint = ref(null)
    onMounted(() => {
      window.addEventListener(
        'resize',
        throttle(() => resize(), 200)
      )
    })
    onUnmounted(() => {
      window.removeEventListener('resize', resize)
    })
    // grid 信息
    const { show, snap, size } = toRefs(props.grid)
    // ctrl
    const { ctrl, draggedPoint, draggedQuadratic, draggedCubic } =
      toRefs(props)
    // 处理添加点逻辑
    const addPoints = (e) => {
      if (ctrl.value) {
        // 获取添加点的坐标， 然后将点传递到父组件
        CurrentAddPoint.value = getAddMouse(e)
        emit('addPoint', CurrentAddPoint.value)
      }
    }
    // 获取点击添加的点坐标
    const getAddMouse = (e) => {
      const svg = svgDom.value

      let x = Math.round(e.pageX - svg.offsetLeft)
      let y = Math.round(e.pageY - svg.offsetTop)

      x = size.value * Math.round(x / size.value)
      y = size.value * Math.round(y / size.value)

      return { x, y }
    }

    // resize 处理页面resize 相关数据
    const resize = () => {}

    // 处理mousemove
    const handleMouseMove = (e) => {
      // 排除添加点时的鼠标移动
      if (!ctrl.value) {
        // 如果是拖拽点
        if (draggedPoint.value) {
          setPointCoords(getAddMouse(e))
        } else if (draggedQuadratic.value) {
          setQuadraticCoords(getAddMouse(e))
        } else if (draggedCubic.value !== false) {
          setCubicCoords(getAddMouse(e))
        }
      }
    }

    // 处理拖拽点,传递当前拖拽点的下标
    const handlePointDragger = (index) => {
      emit('handlePointDragger', index)
    }

    // 处理二次贝塞尔曲线控制点拖拽
    const handleDraggerQua = (index) => {
      emit('handleDraggerQua', index)
    }

    const handleSetCubic = (value) => {
      emit('handleSetCubic', value)
    }

    // 改变原坐标点为拖拽后的坐标点
    const setPointCoords = (value) => {
      emit('setPointValue', value)
    }

    // 处理二次贝塞尔控制点拖拽坐标
    const setQuadraticCoords = (value) => {
      emit('setQuadraticPointValue', value)
    }

    // 处理三次贝塞儿控制点坐标
    const setCubicCoords = (value) => {
      emit('setCubicCoords', value)
    }

    return {
      show,
      snap,
      size,
      addPoints,
      svgDom,
      handleMouseMove,
      handlePointDragger,
      handleDraggerQua,
      handleSetCubic
    }
  }
}
</script>

<style lang="less" scoped>
svg {
  display: block;
  overflow: visible;
  background-color: #fff;
  border: 1px solid #eee;
}
.add-g {
  fill: none;
  stroke: #eee;
  stroke-width: 1px;
}
.hidden {
  display: none;
}

.point {
  cursor: pointer;
  fill: #fff;
  stroke: #555;
  stroke-width: 5px;
  transition: fill 0.2s;
}

.point-active .point {
  stroke: #00a971;
}

.path {
  stroke: #555;
  stroke-width: 4px;
  stroke-linecap: round;
  fill: none;
  // stroke-dasharray: 30% 70%;
  // animation: stroke 2.5s infinite linear;
}

@keyframes stroke {
  to {
    stroke-dashoffset: -100%;
  }
}
</style>
