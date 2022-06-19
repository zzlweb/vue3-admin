<template>
  <svg :width="w" :height="h">
     <g :class="{'hidden': !show}" class="add-g">
      <line v-for="(item, index) in Math.floor(w/size)" :key="index" :x1="item*size" :y1="0" :x2="item*size" :y2="h">
      </line>
      <line v-for="(item, index) in Math.floor(h/size)" :key="index" :x1="0" :y1="item*size" :y2="item*size" :x2="w">
      </line>
     </g>
  </svg>
</template>

<script>
import { toRefs } from 'vue'
export default {
  props: {
    w: Number,
    h: Number,
    grid: Object
  },
  setup (props) {
    console.log(props)
    const { show, snap, size } = toRefs(props.grid)

    return { show, snap, size }
  }
}
</script>

<style lang="less" scoped>
svg{
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
</style>
