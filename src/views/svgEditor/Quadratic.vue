<template>
  <g className="ad-Anchor">
    <line className="ad-Anchor-line" :x1=p1x :y1=p1y :x2=x :y2=y />
    <line className="ad-Anchor-line" :x1=x :y1=y :x2=p2x :y2=p2y />
    <circle className="ad-Anchor-point" :cx=x :cy=y r=6 />
  </g>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {}
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
