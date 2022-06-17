<template>
  <div class="control-item flex-col">
    <label class="control-item-label" v-if="name">{{name}}</label>
    <div v-if="type === 'rang'" class="add-range">
      <a-row :gutter="16" align="middle">
        <a-col :span="14">
          <a-slider :value="value" @change="handleSlider" :min="0" :max="max" />
        </a-col>
        <a-col :span="10">
          <a-input-number :value="value" @change="handleInput" :min="0" :max="max" style="margin-left: 16px" />
        </a-col>
      </a-row>
    </div>

    <div v-if="type==='text'" class="add-text">
      <a-input type="text" :value="value" @change="handleSlider"></a-input>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
const useRange = (emit) => {
  const handleSlider = (value) => {
    emit('update:value', value)
  }
  const handleInput = (value) => {
    if (typeof value === 'number') {
      emit('update:value', value)
    }
  }
  return { handleSlider, handleInput }
}
export default defineComponent({
  props: {
    type: { type: String },
    name: { type: String },
    value: { type: Number },
    max: { type: Number, default: 800 }
  },
  setup (props, { emit }) {
    // 处理调整范围逻辑
    const { handleSlider, handleInput } = useRange(emit)

    return {
      handleSlider,
      handleInput
    }
  }
})
</script>

<style lang="less" scoped>
.add-range,
.add-text {
  padding: 0 8px;
}

.control-item-label {
  line-height: 32px;
  margin-top: 10px;
  padding: 0 10px;
}
</style>
