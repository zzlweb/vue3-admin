<template>
  <g class="ad-Anchor">
    <line class="ad-Anchor-line" :x1="p1x" :y1="p1y" :x2="x1" :y2="y1" />
    <line class="ad-Anchor-line" :x1="p2x" :y1="p2y" :x2="x2" :y2="y2" />
    <circle class="ad-Anchor-point" :cx="x1" :cy="y1" r=6  @mousedown="setCubic(0)"/>
    <circle class="ad-Anchor-point" :cx="x2" :cy="y2" r=6 @mousedown="setCubic(1)"/>
  </g>
</template>

<script>
import { defineComponent, toRefs } from 'vue'

export default defineComponent({
  props: {
    x1: Number,
    y1: Number,
    x2: Number,
    y2: Number,
    p1x: Number,
    p1y: Number,
    p2x: Number,
    p2y: Number,
    cubicIndex: Number
  },
  setup (props, { emit }) {
    const { cubicIndex } = toRefs(props)
    const cubicIndexValue = cubicIndex.value
    const setCubic = (index) => {
      //  index: 控制柄下标
      emit('handleSetCubic', { index, cubicIndexValue })
    }

    return { setCubic }
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
