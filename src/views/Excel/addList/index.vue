<template>
  <a-drawer
    title="添加一条新数据"
    :width="720"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose"
    :get-container="false"
    :wrap-style="{ position: 'absolute' }"
  >
    <a-form :model="form" :rules="rules" layout="vertical">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="姓名" name="name">
            <a-input
              v-model:value="form.name"
              placeholder="Please enter user name"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="性别" name="owner">
            <a-select
              placeholder="Please a-s an owner"
              v-model:value="form.owner"
            >
              <a-select-option value="xiao">Xiaoxiao Fu</a-select-option>
              <a-select-option value="mao">Maomao Zhou</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="年龄" name="type">
            <a-select
              placeholder="Please choose the type"
              v-model:value="form.type"
            >
              <a-select-option value="private">Private</a-select-option>
              <a-select-option value="public">Public</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="生日" name="dateTime">
            <a-date-picker
              v-model:value="form.dateTime"
              style="width: 100%"
              :get-popup-container="(trigger) => trigger.parentNode"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="地址" name="description">
            <a-textarea
              v-model:value="form.description"
              :rows="4"
              placeholder="please enter url description"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }"
    >
      <a-button style="margin-right: 8px" @click="onClose">Cancel</a-button>
      <a-button type="primary" @click="onClose">Submit</a-button>
    </div>
  </a-drawer>
</template>
<script>
import { PlusOutlined } from "@ant-design/icons-vue";
import { defineComponent, reactive, ref } from "vue";
export default defineComponent({
  components: {
    PlusOutlined,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { emit }) {
    const form = reactive({
      name: "",
      url: "",
      owner: "",
      type: "",
      approver: "",
      dateTime: "",
      description: "",
    });
    const rules = {
      name: [
        {
          required: true,
          message: "Please enter user name",
        },
      ],
      url: [
        {
          required: true,
          message: "please enter url",
        },
      ],
      owner: [
        {
          required: true,
          message: "Please select an owner",
        },
      ],
      type: [
        {
          required: true,
          message: "Please choose the type",
        },
      ],
      approver: [
        {
          required: true,
          message: "Please choose the approver",
        },
      ],
      dateTime: [
        {
          required: true,
          message: "Please choose the dateTime",
          type: "object",
        },
      ],
      description: [
        {
          required: true,
          message: "Please enter url description",
        },
      ],
    };

    const onClose = () => {
      emit("closeDraw");
    };

    return {
      form,
      rules,
      onClose,
    };
  },
});
</script>