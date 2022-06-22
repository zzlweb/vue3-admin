<template>
  <div class="control-item flex-col">
    <label class="control-item-label" v-if="name">{{ name }}</label>
    <!-- range -->
    <div v-if="type === 'rang'" class="add-range">
      <a-row :gutter="16" :align="middle">
        <a-col :span="14">
          <a-slider :value="value" @change="handleSlider" :min="0" :max="max" />
        </a-col>
        <a-col :span="10">
          <a-input-number :value="value" @change="handleInput" :min="1" :max="max" />
        </a-col>
      </a-row>
    </div>

    <!-- inputNumer -->
    <div v-if="type === 'inputNumber'" class="add-text">
      <a-input-number :min="1" :step="step" :value="value" @change="handleInputBumber"></a-input-number>
    </div>

    <!-- button -->
    <div v-if="type==='button'" class="add-button" @click="handleButton">
      <a-button type="primary" @click="handleButton">{{value}}</a-button>
    </div>

    <!-- checkbox -->
    <div v-if="type === 'checkbox'" class="add-checkbox" style="padding: 0 10px">
      <a-checkbox :checked="value" @change="handleCheck">{{checkboxLabel}}</a-checkbox>
    </div>

    <!-- choice -->
    <div v-if="type === 'radio'" class="add-radio">
      <a-radio-group :value="value" @change="handleRadio">
        <a-radio :value="'Q'">Q</a-radio>
        <a-radio :value="'C'">C</a-radio>
      </a-radio-group>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
// range
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

// inoutNumber 复用 range function
const useInputNumber = (emit) => {
  const handleInputBumber = (value) => {
    if (typeof value === 'number') {
      emit('update:value', value)
    }
  }
  return { handleInputBumber }
}

// button
const useButton = (emit) => {
  const handleButton = () => {
    emit('update:value')
  }

  return { handleButton }
}

// checkbox
const useCheckbox = (emit) => {
  const handleCheck = (e) => {
    emit('update:value', e.target.checked)
  }

  return { handleCheck }
}

// choice
const useRadio = (emit) => {
  const handleRadio = (e) => {
    emit('update:value', e)
  }

  return { handleRadio }
}

export default defineComponent({
  props: {
    type: String,
    name: String,
    value: [String, Number, Boolean],
    max: { type: Number },
    checkboxLabel: [String],
    step: Number
  },
  setup (props, { emit }) {
    // range
    const { handleSlider, handleInput } = useRange(emit)
    // button
    const { handleButton } = useButton(emit)
    // checkbox
    const { handleCheck } = useCheckbox(emit)
    // radio
    const { handleRadio } = useRadio(emit)
    // inputNumber
    const { handleInputBumber } = useInputNumber(emit)
    return {
      handleSlider,
      handleInput,
      handleButton,
      handleCheck,
      handleRadio,
      handleInputBumber
    }
  }
})
</script>

<style lang="less" scoped>
.control-item {
  margin-top: 10px;
}
.add-range,
.add-text,
.add-button,
.add-radio {
  padding: 0 8px;
}

.control-item-label {
  line-height: 32px;
  padding: 0 10px;
}
</style>
