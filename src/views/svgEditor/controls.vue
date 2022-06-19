<template>
  <div class="ad-Controls">
    <div class="ad-Controls-title">控制面板</div>
    <div class="control-item flex-row">
      <!--  画图区域设置  -->
      <control
        :type="'inputNumber'"
        :value="w"
        @update:value="handleW"
        name="画布宽度"
      >
      </control>
      <!--  画图区域设置  -->
      <control
        :type="'inputNumber'"
        :value="h"
        @update:value="handleH"
        name="画布高度"
      >
      </control>
    </div>
    <div class="control-item flex-row">
      <!--  画布网格单位设置  -->
      <control
        :type="'inputNumber'"
        :value="size"
        @update:value="handleSize"
        name="画布单位"
      >
      </control>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRefs } from 'vue'
import control from './control.vue'
import { positiveNumber } from './utils'
export default defineComponent({
  components: {
    control
  },
  props: {
    w: Number,
    h: Number,
    size: Number
  },
  setup (props, { emit }) {
    const type = ref('radio')

    // range
    const state = reactive({
      // range
      range: { value: 0, name: '调整范围' },
      // text
      text: { value: '' },
      // button
      button: { value: '删除' },
      // checkbox
      checkbox: { value: true, checkboxLabel: '确定' },
      radio: { value: 1 }
    })

    // 处理调整画布width
    const handleW = (value) => {
      value = positiveNumber(value)
      value > 800 ? value = 800 : value
      value < 1 ? value = 1 : value
      emit('update:w', value)
    }

    // 处理调整画布Height
    const handleH = (value) => {
      value = positiveNumber(value)
      value > 600 ? value = 600 : value
      value < 1 ? value = 1 : value
      emit('update:h', value)
    }
    // 处理画布单位
    const handleSize = (value) => {
      emit('update:size', value)
    }

    return {
      type,
      ...toRefs(state),
      handleW,
      handleH,
      handleSize
    }
  }
})
</script>

<style lang="less" scoped>
.ad-Controls {
  width: 215px;

  .control-item {
    justify-content: flex-start;
  }

  .ad-Controls-title {
    line-height: 32px;
    text-align: center;
    background: #000;
    color: #fff;
  }
}
</style>
