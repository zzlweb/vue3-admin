<template>
  <div class="ad-Controls">
    <div class="ad-Controls-title">控制面板</div>
    <div class="control-box flex-row">
      <!--  是否显示grid  -->
      <control :type="'checkbox'" :value="show" :checkboxLabel="'画布显示'" @update:value="handleShow" name="显示背景画布">
      </control>
      <!--  重置路径  -->
      <control :type="'button'" :value="'Rwrite'" @update:value="handleRPath" name="重置路径">
      </control>
    </div>

    <div class="path-content flex-col">
      <div>路径坐标</div>
      <div class="path-box">{{path}}</div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from 'vue'
import control from './control.vue'
export default defineComponent({
  components: {
    control
  },
  props: {
    // w: Number,
    // h: Number,
    size: Number,
    show: Boolean,
    path: String
  },
  setup (props, { emit }) {
    const { path } = toRefs(props)

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

    // 处理显示画布
    const handleShow = (value) => {
      emit('update:show', value)
    }

    // 处理重绘路径
    const handleRPath = () => {
      emit('handleRPath')
    }

    return {
      ...toRefs(state),
      handleShow,
      handleRPath,
      path
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

.path-content {
  margin: 10px;

  .path-box {
    width: 100%;
    border: 1px solid #eee;
    border-radius: 5px;
    overflow: scroll;
    height: 100px;
  }
}
</style>
