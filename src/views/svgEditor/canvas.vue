<template>
  <div class="svg-dom" ref="svgDom">
    <svg :width="w" :height="h" @click="addPoints">
      <g :class="{'hidden': !show}" class="add-g">
        <line v-for="(item, index) in Math.round(w/size)" :key="index" :x1="item*size" :y1="0" :x2="item*size" :y2="h">
        </line>
        <line v-for="(item, index) in Math.round(h/size)" :key="index" :x1="0" :y1="item*size" :y2="item*size" :x2="w">
        </line>
      </g>
      <!-- path -->
      <path class="path" :d="path">
      </path>
      <!-- points -->
      <g>
        <g v-for="(item, index) in points" :key="index">
          <circle :cx="item.x" :cy="item.y" r="8" class="point"></circle>
          <cubic v-if="item.c" />
          <quadratic v-if="item.q"></quadratic>
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
    path: String
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
    const { ctrl } = toRefs(props)
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

    return {
      show,
      snap,
      size,
      addPoints,
      svgDom
    }
  }
}
</script>

<style lang="less" scoped>
svg {
  display: block;
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
  fill: none;
  stroke: #555;
  stroke-width: 4px;
  stroke-linecap: round;
}
</style>
