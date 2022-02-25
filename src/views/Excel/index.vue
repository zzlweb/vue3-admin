<template>
  <div class="flex-col export-table">
    <a-button
      class="editable-add-btn"
      style="margin-bottom: 8px"
      @click="handleAdd"
      type="primary"
      >添加</a-button
    >
    <a-table
      class="fill"
      bordered
      :data-source="dataSource"
      :loading="loading"
      :columns="columns"
      :pagination="pagination"
      :row-key="(record) => record.id"
      @change="handleChange"
      :scroll="{ y: 700 }"
    >
      <template #operation="{ record }">
        <a-popconfirm
          v-if="dataSource.length"
          title="确定要删除?"
          okText="确定"
          cancelText="取消"
          @confirm="onDelete(record.id)"
        >
          <a>删除</a>
        </a-popconfirm>
      </template>
    </a-table>
  </div>

  <!-- 右侧抽屉 添加数据 -->
  <add-list :visible="visible"  @closeDraw ="closeDraw"></add-list>
</template>
<script>
import { computed, defineComponent, reactive, ref, onMounted } from "vue";
import { CheckOutlined, EditOutlined } from "@ant-design/icons-vue";
import { cloneDeep } from "lodash-es";
import { getData } from "@/api/Excel";
import AddList from './addList'
// 获取表格数据
const useGetData = function (pageNumber, pageSize) {
  return new Promise((resolve, reject) => {
    getData({ page: pageNumber, limit: pageSize })
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
    AddList
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
    // 数据
    const dataSource = ref([]);
    // 总的数据条数
    const total = ref();
    // 当前展示分页
    const current = ref();
    // 展示的条数
    const limit = ref(12);
    const editableData = reactive({});
    const loading = ref(false);

    // 是否显示抽屉
    const visible = ref(false)

    // 获取数据
    const getDataList = async (current, limit) => {
      loading.value = true;

      const dataList = await useGetData(current, limit);

      dataList.list.forEach((item) => {
        item.sex === 0 ? (item.sex = "女") : (item.sex = "男");
      });

      dataSource.value = dataList.list;
      total.value = dataList.count;
      loading.value = false;
    };

    const edit = (id) => {
      editableData[key] = cloneDeep(
        dataSource.value.filter((item) => id === item.id)[0]
      );
    };

    const save = (id) => {
      Object.assign(
        dataSource.value.filter((item) => id === item.id)[0],
        editableData[id]
      );
      delete editableData[id];
    };

    const onDelete = (id) => {
      dataSource.value = dataSource.value.filter((item) => item.id !== id);
    };

    const handleAdd = () => {
      // 显示抽屉
      visible.value = true
    };

    const closeDraw = () => {
      visible.value = false 
    }

    // 分页设置
    const pagination = computed(() => ({
      total: total.value,
      current: current.value,
      pageSize: limit.value,
    }));

    // 分页、排序、筛选变化时触发
    const handleChange = (pagination) => {
      const { current: pageNumber, pageSize } = pagination;
      current.value = pageNumber;
      getDataList(pageNumber, pageSize);
    };

    onMounted(() => {
      getDataList(current.value, limit.value);
    });

    return {
      columns,
      loading,
      onDelete,
      handleAdd,
      dataSource,
      editableData,
      edit,
      save,
      pagination,
      handleChange,
      visible,
      closeDraw
    };
  },
});
</script>
<style lang="less">

.export-table {
  height: 100%;
  overflow: hidden;
  position: relative;
  width: '100%',
}

.ant-table td {
  white-space: nowrap;
}

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

  .editable-add-btn.ant-btn {
    margin-bottom: 8px;
    width: 100px !important;
  }
}
.editable-add-btn.ant-btn {
  width: 100px !important;
}
.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}
</style>