<template>
  <a-drawer title="添加一条新数据" :width="720" :visible="visible" :body-style="{ paddingBottom: '80px' }" @close="onClose" :get-container="false" :wrap-style="{ position: 'absolute' }">
    <a-form :model="form" :rules="rules" layout="vertical" ref="formRef">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="姓名" name="name">
            <a-input v-model:value="form.name" placeholder="请输入用户名" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="性别" name="sex">
            <a-select placeholder="请选择性别" v-model:value="form.sex">
              <a-select-option value="男">男</a-select-option>
              <a-select-option value="女">女</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="年龄" name="age">
            <a-input v-model:value="form.age" placeholder="请输入年龄" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="出生日期" name="birth">
            <a-date-picker v-model:value="form.birth" style="width: 100%" placeholder="选择出生日期" :get-popup-container="(trigger) => trigger.parentNode" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="地址" name="address">
            <a-textarea v-model:value="form.address" :rows="4" placeholder="请输入地址" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }">
      <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
      <a-button type="primary" @click="onSubmit">提交</a-button>
    </div>
  </a-drawer>
</template>
<script>
import moment from 'moment'
import { defineComponent, reactive, ref } from 'vue'
import { addData } from '@/api/Excel'
import { message } from 'ant-design-vue'

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  setup (props, { emit }) {
    const formRef = ref()
    const dateFormat = 'YYYY/MM/DD'
    const form = reactive({
      name: '',
      sex: '',
      age: '',
      birth: '',
      address: ''
    })

    const checkName = async (rule, value) => {
      const reg = /^[\u4e00-\u9fa5]{2,6}$/
      if (value === '') {
        return Promise.reject('请输入用户名')
      } else if (!reg.test(value)) {
        return Promise.reject('请输入2~6位中文')
      } else {
        Promise.resolve()
      }
    }

    const checkAge = async (rule, value) => {
      const reg = /^(?:[1-9][0-9]?|1[01][0-9]|120)$/ // 年龄是1-120之间有效
      if (value === '') {
        return Promise.reject('请输入年龄')
      } else if (!reg.test(value)) {
        return Promise.reject('请输入合法年龄')
      } else {
        Promise.resolve()
      }
    }

    const checkAddress = async (rule, value) => {
      if (value === '') {
        return Promise.reject('请输入地址')
      } else {
        Promise.resolve()
      }
    }

    const rules = {
      name: [
        {
          required: true,
          validator: checkName,
          trigger: 'change'
        }
      ],
      sex: [
        {
          required: true,
          message: '请选择性别'
        }
      ],
      age: [
        {
          required: true,
          validator: checkAge,
          trigger: 'change'
        }
      ],
      birth: [
        {
          required: true,
          message: '选择出生日期'
        }
      ],
      address: [
        {
          required: true,
          validator: checkAddress,
          trigger: 'change',
          message: '请输入地址'
        }
      ]
    }

    const onClose = () => {
      formRef.value.resetFields()
      emit('closeDraw')
    }

    const onSubmit = () => {
      formRef.value
        .validate()
        .then(() => {
          form.birth = moment(form.birth, dateFormat)
          addData(form).then((res) => {
            if (res.code === 200) {
              // 添加成功
              message.destroy()
              message.success('添加成功')
              emit('closeDraw')
            }
          })
        })
        .catch((error) => {
          message.destroy()
          message.error('校验失败')
        })
    }

    return {
      form,
      rules,
      onClose,
      formRef,
      onSubmit
    }
  }
})
</script>

<style lang="less" scoped>
.ant-form-item textarea.ant-input {
  resize: none;
  padding: 8px 10px;
  overflow-y: auto;
}

.ant-btn {
  width: 100px;
}
</style>
