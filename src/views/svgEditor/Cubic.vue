<template>
  <g className="ad-Anchor">
    <line className="ad-Anchor-line" :x1=p1x :y1=p1y :x2=x1 :y2=y1 />
    <line className="ad-Anchor-line" :x1=p2x :y1=p2y :x2=x2 :y2=y2 />
    <circle className="ad-Anchor-point" :cx=x1 :cy=y1 r=6 />
    <circle className="ad-Anchor-point" :cx=x2 :cy=y2 r=6 />
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
