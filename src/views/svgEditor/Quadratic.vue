<template>
  <g class="ad-Anchor">
    <line class="ad-Anchor-line" :x1="p1x" :y1="p1y" :x2="x" :y2="y" />
    <line class="ad-Anchor-line" :x1="x" :y1="y" :x2="p2x" :y2="p2y" />
    <circle class="ad-Anchor-point" :cx="x" :cy="y" r=6 @mousedown="handleDraggerQuadratic"/>
  </g>
</template>

<script>
import { toRefs, defineComponent } from 'vue'

export default defineComponent({
  props: {
    x: Number,
    y: Number,
    p1x: Number,
    p1y: Number,
    p2x: Number,
    p2y: Number,
    quadraticIndex: Number
  },
  setup (props, { emit }) {
    const { quadraticIndex } = toRefs(props)

    const handleDraggerQuadratic = () => {
      emit('handleDraggerQua', quadraticIndex.value)
    }

    return {
      handleDraggerQuadratic
    }
  }
})
</script>

<style lang="less" scoped>
.ad-Anchor-point {
  cursor: pointer;
  fill: #fff;
  stroke: #888;
  stroke-width: 5px;
}
.ad-Anchor-line {
  stroke: #888;
  stroke-width: 1px;
  stroke-dasharray: 5 5;
}
</style>
