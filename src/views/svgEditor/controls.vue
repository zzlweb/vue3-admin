<template>
  <div class="ad-Controls">
    <div class="ad-Controls-title">控制面板</div>
    <control :type="type" :name="name" v-model:value="value"></control>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRefs } from 'vue'
import control from './control.vue'
export default defineComponent({
  components: {
    control
  },
  setup () {
    const type = ref('text')

    // range
    // const range = reactive({
    //   value: 0,
    //   name: '调整范围'
    // })
    // text
    const text = reactive({
      value: null
    })

    return {
      type,
      // ...toRefs(range),
      ...toRefs(text)
    }
  }
})
</script>

<style lang="less" scoped>
.ad-Controls {
  width: 300px;

  .ad-Controls-title {
    line-height: 32px;
    text-align: center;
    background: #000;
    color: #fff;
  }
}
</style>
