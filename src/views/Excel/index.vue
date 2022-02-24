<template>
  <a-button
    class="editable-add-btn"
    style="margin-bottom: 8px"
    @click="handleAdd"
    >Add</a-button
  >
  <a-table
    bordered
    :data-source="dataSource"
    :loading="loading"
    :columns="columns"
    :row-key="(record) => record.id"
  >
    <template #operation="{ record }">
      <a-popconfirm
        v-if="dataSource.length"
        title="Sure to delete?"
        @confirm="onDelete(record.id)"
      >
        <a>Delete</a>
      </a-popconfirm>
    </template>
  </a-table>
</template>
<script>
import { computed, defineComponent, reactive, ref, onMounted } from "vue";
import { CheckOutlined, EditOutlined } from "@ant-design/icons-vue";
import { cloneDeep } from "lodash-es";
import { getData } from "@/api/Excel";
// 获取表格数据
const useGetData = function () {
  return new Promise((resolve, reject) => {
    getData({ page: 1, limit: 10 })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export default defineComponent({
  components: {
    CheckOutlined,
    EditOutlined,
  },

  setup() {
    const columns = [
      {
        title: "姓名",
        dataIndex: "name",
      },
      {
        title: "性别",
        dataIndex: "sex",
      },
      {
        title: "年龄",
        width: "10%",
        dataIndex: "age",
      },
      {
        title: "生日",
        dataIndex: "birth",
      },
      {
        title: "地址",
        ellipsis: true,
        width: "30%",
        dataIndex: "address",
      },
      {
        title: "操作",
        width: "15%",
        slots: {
          customRender: "operation",
        },
        dataIndex: "operation",
      },
    ];
    const dataSource = ref([]);
    const editableData = reactive({});
    const loading = ref(false);

    onMounted(async () => {
      loading.value = true;

      const dataList = await useGetData();

      dataList.list.forEach((item) => {
        item.sex === 0 ? (item.sex = "女") : (item.sex = "男");
      });

      dataSource.value = dataList.list;
      loading.value = false;
    });

    const edit = (key) => {
      editableData[key] = cloneDeep(
        dataSource.value.filter((item) => key === item.key)[0]
      );
    };

    const save = (key) => {
      Object.assign(
        dataSource.value.filter((item) => key === item.key)[0],
        editableData[key]
      );
      delete editableData[key];
    };

    const onDelete = (key) => {
      dataSource.value = dataSource.value.filter((item) => item.key !== key);
    };

    const handleAdd = () => {
      console.log("添加");
    };

    return {
      columns,
      loading,
      onDelete,
      handleAdd,
      dataSource,
      editableData,
      edit,
      save,
    };
  },
});
</script>
<style lang="less">
.editable-cell {
  position: relative;
  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    margin-top: 4px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .editable-add-btn {
    margin-bottom: 8px;
  }
}
.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}
</style>