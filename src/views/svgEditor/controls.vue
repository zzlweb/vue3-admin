<template>
  <div class="ad-Controls">
    <div class="ad-Controls-title">控制面板 (Ctrl 加点)</div>
    <div class="control-box flex-row">
      <!--  是否显示grid  -->
      <control :type="'checkbox'" :value="show" :checkboxLabel="'画布显示'" @update:value="handleShow" name="显示背景画布">
      </control>
      <!--  重置路径  -->
      <control :type="'button'" :value="'重绘'" @update:value="handleRPath" name="重置路径">
      </control>
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

    <!-- 动画执行时长 -->
    <div class="control-box flex-row">
      <div class="flex-col control-item">
        <div>动画执行时长</div>
        <a-input-number id="inputNumber" :value="time" @change="handleTime" :min="1" :max="10" />
      </div>

      <div class="flex-col control-item">
        <div>是否显示柱状图</div>
        <a-checkbox :checked="Histogram" @change="handleHistogram">柱状图显示</a-checkbox>
      </div>
    </div>

    <!-- 多曲线 -->
    <div v-if="cubicNumber">
      <div class="path-content flex-col">
        <a-button type="primary" @click="ChangeStyleObject">大小缩放</a-button>
        <div class="path-box">
          {{handleKeyframe}}
        </div>
      </div>

      <div class="effect-box" v-if="trigger" :style="styleObject"></div>
      <div class="effect-box" v-else :style="styleObject"></div>
    </div>

    <!-- 单曲线 -->
    <div v-else>
      <div class="path-content flex-col">
        <a-button type="primary" @click="trigger = !trigger">大小缩放</a-button>
        <div class="path-box">{{cubicPath}}</div>
      </div>

      <div class="effect-box" :class="{'two': trigger}" :style="FixedPath"></div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, reactive, toRefs, watch } from 'vue'
import control from './control.vue'
export default defineComponent({
  components: {
    control
  },
  props: {
    size: Number,
    show: Boolean,
    cubicPath: String,
    mosueType: Number,
    time: Number,
    keyframePoint: Array,
    cubicNumber: Boolean,
    Histogram: Boolean
  },
  setup (props, { emit }) {
    const { cubicPath, time, mosueType, keyframePoint } = toRefs(props)

    // range
    const state = reactive({
      radioStyle: {
        height: '30px',
        display: 'flex',
        alignItems: 'center'
      },
      value: mosueType.value,
      trigger: false,
      styleObject: ''
    })

    watch(
      () => state.value,
      (current, oldValue) => {
        emit('update:mosueType', current)
      },
      { immediate: true }
    )

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

    // 处理柱状图显示
    const handleHistogram = (e) => {
      emit('update:Histogram', e.target.checked)
    }

    // 动态加载css
    const loadStyleString = (cssText) => {
      if (document.getElementsByClassName('scale-animate')[0]) {
        document
          .getElementsByTagName('head')[0]
          .removeChild(document.getElementsByClassName('scale-animate')[0])
      }
      var style = document.createElement('style')
      style.type = 'text/css'
      style.className = 'scale-animate'
      try {
        // firefox、safari、chrome和Opera
        style.appendChild(document.createTextNode(cssText))
      } catch (ex) {
        // IE早期的浏览器 ,需要使用style元素的stylesheet属性的cssText属性
        style.styleSheet.cssText = cssText
      }
      document.getElementsByTagName('head')[0].appendChild(style)
    }

    // 计算keyframe
    const handleKeyframe = computed(() => {
      const a = '@keyframes scale-animate {'
      let b = ''
      keyframePoint.value.forEach((it) => {
        b += `${(it[0] * 100).toFixed(2)}% {
          transform: scale(${(it[1] + 1).toFixed(2)});
        } `
      })
      const c = '}'
      loadStyleString(a + b + c)
      return a + b + c
    })

    // 多段曲线输出动画
    const ChangeStyleObject = () => {
      state.trigger = !state.trigger
      //  /* 动画名称 */
      /* animation-name: move; */
      /* 持续时间 */
      /* animation-duration: 2s; */
      /* 速度曲线 */
      /* animation-timing-function: ease-in; */
      /* 何时开始:延迟一秒 */
      /* animation-delay: 1s; */
      /* 重复次数 */
      /* animation-iteration-count: 2; */
      /* 是否逆向播放 */
      /* animation-direction: alternate-reverse; */
      /* 结束后状态 */
      /* animation-fill-mode: forwards; */
      if (state.trigger) {
        state.styleObject = `animation: scale-animate  ${time.value}s linear 0s 1 normal both running;`
      } else {
        state.styleObject = `animation: scale-animate  ${time.value}s linear 0s 1 reverse both running;`
      }
    }

    // 处理动画cubic拼接
    const FixedPath = computed(() => {
      let result = ''
      cubicPath.value.split('/').map((item) => {
        result += ` all ${time.value}s ${item} ,`
      })
      result = 'transition:' + result
      result = result.slice(0, result.length - 1)

      return result
    })

    return {
      ...toRefs(state),
      handleShow,
      handleRPath,
      handleTime,
      handleKeyframe,
      FixedPath,
      // eslint-disable-next-line vue/no-dupe-keys
      cubicPath,
      loadStyleString,
      ChangeStyleObject,
      handleHistogram
    }
  }
})
</script>

<style lang="less" scoped>
.ad-Controls {
  width: 100%;

  .control-box {
    justify-content: space-between;
    margin: 10px;

    .control-item {
      width: 50%;
      justify-items: flex-start;
    }
  }

  .ad-Controls-title {
    line-height: 32px;
    text-align: center;
    background-image: linear-gradient(-225deg, #94d38d 0%, #6fe1a8 48%, #2ec99b 100%);
    color: #fff;
  }
}

.path-content {
  margin: 10px;

  .path-box {
    width: 100%;
    padding: 0 20px;
  }
}

.effect-box {
  width: 50px;
  height: 50px;
  background: #00a971;
  margin: 30px auto 0;
}

.effect-box.two {
  transform: scale(2);
}
</style>
