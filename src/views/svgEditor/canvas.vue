<template>
  <div class="svg-dom" ref="svgDom">
    <svg :width="w" :height="h" @click="addPoints" @mousemove="handleMouseMove">

      <g :class="{'hidden': !show}" class="add-g">
        <!-- x -->
        <line v-for="(item, index) in Math.round(w/size)" :key="index" :x1="item*size" :y1="0 + h/3" :x2="item*size" :y2="h*2/3">
        </line>
        <line :x1="0" :y1="h/3 - 50" :x2="0" :y2="h*2/3" style="stroke-width: 2px; stroke: #000">
        </line>
        <polyline :points="`-30 ${h/3-10}, 0 ${h/3-50}, 30 ${h/3-10}`" style="stroke-width: 2px; stroke: #000"></polyline>
        <!-- y -->
        <line v-for="(item, index) in Math.round(h/size)" :class="{'hidden': item*size < h /3 || item*size > 2*h/3}" :key="index" :x1="0" :y1="item*size " :x2="w" :y2="item*size "></line>
        <line :x1="0" :y1="2*h/3" :x2="w + 50" :y2="h*2/3" style="stroke-width: 2px; stroke: #000">
        </line>
        <polyline :points="`${w +10} ${h*2/3 - 30}, ${w + 50} ${h*2/3}, ${w + 10} ${h*2/3 + 30}`" style="stroke-width: 2px; stroke: #000"></polyline>
      </g>

      <!-- rect -->
      <g v-if="Histogram && cubicNumber" style="z-index: -1 ; position: relative">
        <defs>
          <linearGradient id="test-linear-gradient">
            <stop offset="0%" stop-color="#00a971" stop-opacity="0.6"></stop>
            <stop offset="100%" stop-color="#2af598" stop-opacity="1"></stop>
          </linearGradient>
          <linearGradient id="right_to_left" xlink:href="#test-linear-gradient" x1="100%" y1="100%" x2="0%" y2="0%"></linearGradient>
        </defs>
        <rect v-for="(item, index) in keyframePoint" :key="index" :x="item[0] * 500 - 7.5" :y="calcHeight(item[1]) > 1000 ? 1000 : calcHeight(item[1])" width="15" :height="Math.abs(calcHeight(item[1]) > 1000 ?  calcHeight(item[1]) - 1000 : 1000 - calcHeight(item[1]))" rx="2" ry="2" style="fill:url(#right_to_left)"></rect>
      </g>
      <!-- path -->
      <path class="path" :d="path" id="path">
      </path>

      <!-- points -->
      <g>
        <g v-for="(item, index) in points" :key="index" :class="{'point-active': activePoint - 1 === index }">
          <circle :cx="item.x" :cy="item.y" r="6" class="point" @mousedown="handlePointDragger(index)"></circle>
          <cubic v-if="item.c" @handleSetCubic="handleSetCubic" :cubicIndex="index" :x1="item.c[0].x" :y1="item.c[0].y" :x2="item.c[1].x" :y2="item.c[1].y" :p1x="points[index-1].x" :p1y="points[index-1].y" :p2x="points[index].x" :p2y="points[index].y" />
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
import { throttle } from 'lodash'
// dom
import { toRefs, onMounted, ref, onUnmounted, computed } from 'vue'
// 二次贝塞尔曲线控制柄
import cubic from './Cubic.vue'
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
    // 是否拖拽三次贝塞尔曲线控制柄
    draggedCubic: [Boolean, Number],
    // 获取动画点
    keyframePoint: Array,
    // 是否显示柱状图
    Histogram: Boolean,

    cubicNumber: Boolean
  },
  components: {
    cubic
  },
  setup (props, { emit }) {
    // const { keyframePoint } = toRefs(props)
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
    // 边界条件限制
    const { w, h } = toRefs(props)
    // grid 信息
    const { show, snap, size } = toRefs(props.grid)
    // ctrl
    const { ctrl, draggedPoint, draggedCubic } = toRefs(props)
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
        } else if (draggedCubic.value !== false) {
          setCubicCoords(getAddMouse(e))
        }
      }
    }

    // 处理拖拽点,传递当前拖拽点的下标
    const handlePointDragger = (index) => {
      emit('handlePointDragger', index)
    }

    const handleSetCubic = (value) => {
      emit('handleSetCubic', value)
    }

    // 改变原坐标点为拖拽后的坐标点
    const setPointCoords = (value) => {
      if (
        value.x > w.value ||
        value.x < 0 ||
        value.y > (h.value * 2) / 3 ||
        value.y < h.value / 3
      ) {
        return
      }
      emit('setPointValue', value)
    }

    // 处理三次贝塞儿控制点坐标
    const setCubicCoords = (value) => {
      if (value.x > w.value || value.x < 0) return
      emit('setCubicCoords', value)
    }

    // 处理柱状图高度
    const calcHeight = computed(() => (value) => {
      const it = value > 0 ? 1000 - value * 500 : 1000 + -value * 500
      return it
    })

    return {
      show,
      snap,
      size,
      addPoints,
      svgDom,
      handleMouseMove,
      handlePointDragger,
      handleSetCubic,
      // resetkeyPoint,
      calcHeight
    }
  }
}
</script>

<style lang="less" scoped>
svg {
  display: block;
  overflow: visible;
  background-color: #fff;
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
  stroke-width: 2px;
  transition: fill 0.2s;
}

.point-active .point {
  stroke: #00a971;
}

.path {
  stroke: #00a971;
  stroke-width: 3px;
  stroke-linecap: round;
  fill: none;
}

@keyframes stroke {
  to {
    stroke-dashoffset: -100%;
  }
}
</style>
