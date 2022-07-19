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
      <!-- 设置时间 -->
    </div>
    <!-- 动画执行时长 -->
    <div class="control-box flex-row">
      <a-input-number id="inputNumber" :value="time" @change="handleTime" :min="1" :max="10" />
    </div>

    <!-- 选择手柄样式 -->
    <div class="control-box flex-row">
      <a-radio-group v-model:value="value">
        <a-radio :style="radioStyle" :value="1">无手柄</a-radio>
        <a-radio :style="radioStyle" :value="2">不等长不等角度</a-radio>
        <a-radio :style="radioStyle" :value="3">等角度</a-radio>
        <a-radio :style="radioStyle" :value="4">等长等角度</a-radio>
      </a-radio-group>
    </div>

    <div class="path-content flex-col">
      <div>运动曲线</div>
      <div class="path-box" ></div>
    </div>

    <div class="effect-box" ></div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, watch } from 'vue'
import control from './control.vue'
export default defineComponent({
  components: {
    control
  },
  props: {
    size: Number,
    show: Boolean,
    path: String,
    mosueType: Number,
    time: Number
  },
  setup (props, { emit }) {
    const { mosueType } = toRefs(props)

    // range
    const state = reactive({
      radioStyle: {
        height: '30px',
        display: 'flex',
        alignItems: 'center'
      },
      value: mosueType.value
    })

    watch(() => state.value, (current, oldValue) => {
      emit('update:mosueType', current)
    }, { immediate: true })

    // 处理显示画布
    const handleShow = (value) => {
      emit('update:show', value)
    }

    // 处理重绘路径
    const handleRPath = () => {
      emit('handleRPath')
    }

    // 处理动画时间
    const handleTime = (value) => {
      if (typeof value === 'number') {
        emit('update:time', value)
      }
    }

    return {
      ...toRefs(state),
      handleShow,
      handleRPath,
      handleTime
    }
  }
})
</script>

<style lang="less" scoped>
.ad-Controls {
  width: 100%;

  .control-box {
    justify-content: space-between;
    margin: 10px ;

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
  }
}

.effect-box {
  width: 30px;
  height: 30px;
  background: #00a971;
  margin-left: 10px;
}

.effect-box:hover {
  transform: translateX(200px);
}
</style>
