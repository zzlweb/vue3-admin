<template>
  <div class="ad-Controls">
    <div class="ad-Controls-title">控制面板</div>
    <div class="control-box flex-row">
      <!--  画图区域设置  -->
      <control
        :type="'inputNumber'"
        :value="w"
        :step="10"
        @update:value="handleW"
        name="画布宽度"
      >
      </control>
      <!--  画图区域设置  -->
      <control
        :type="'inputNumber'"
        :value="h"
        :step="10"
        @update:value="handleH"
        name="画布高度"
      >
      </control>
    </div>
    <div class="control-box flex-row">
      <!--  画布网格单位设置  -->
      <control
        :type="'inputNumber'"
        :value="size"
        :step="10"
        @update:value="handleSize"
        name="画布单位"
      >
      </control>
       <!--  是否显示grid  -->
      <control
        :type="'checkbox'"
        :value="show"
        :checkboxLabel="'画布显示'"
        @update:value="handleShow"
        name="显示背景画布"
      >
      </control>
    </div>

    <div class="control-box flex-row">
      <!--  选择曲线类型  -->
      <control
        :type="'radio'"
        :value="lineType"
        @update:value="handleType"
        name="曲线类型"
      >
      </control>
      <!--  返回上一步 -->
      <control
        :type="'button'"
        :value="'Rwrite'"
        @update:value="handleRPath"
        name="返回上一步"
      >
      </control>
    </div>

    <div class="control-box flex-row">
      <!--  重置路径  -->
      <control
        :type="'button'"
        :value="'Rwrite'"
        @update:value="handleRPath"
        name="重置路径"
      >
      </control>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from 'vue'
import control from './control.vue'
import { positiveNumber } from './utils'
export default defineComponent({
  components: {
    control
  },
  props: {
    w: Number,
    h: Number,
    size: Number,
    show: Boolean,
    lineType: String
  },
  setup (props, { emit }) {
    // const type = ref('radio')

    // range
    const state = reactive({
      // // range
      // range: { value: 0, name: '调整范围' },
      // // text
      // text: { value: '' },
      // // button
      // button: { value: '删除' },
      // // checkbox
      // checkbox: { value: true, checkboxLabel: '确定' },
      // radio: { value: 1 }
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
      value > 800 ? value = 800 : value
      value < 1 ? value = 1 : value
      emit('update:h', value)
    }
    // 处理画布单位
    const handleSize = (value) => {
      emit('update:size', value)
    }

    // 处理显示画布
    const handleShow = (value) => {
      emit('update:show', value)
    }

    // 处理重绘路径
    const handleRPath = () => {
      emit('handleRPath')
    }

    // 处理更换曲线类型
    const handleType = (e) => {
      emit('handleType', e)
    }

    return {
      ...toRefs(state),
      handleW,
      handleH,
      handleSize,
      handleShow,
      handleRPath,
      handleType
    }
  }
})
</script>

<style lang="less" scoped>
.ad-Controls {
  width: 100%;

  .control-box {
    justify-content: space-between;

    .control-item {
      width: 50%;
      justify-items: flex-start;
    }
  }

  .ad-Controls-title {
    line-height: 32px;
    text-align: center;
    background: #000;
    color: #fff;
  }
}
</style>
