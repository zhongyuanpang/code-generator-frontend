<script setup>
import {onMounted,onBeforeUnmount,onUnmounted,reactive, ref,nextTick} from 'vue'
import Sortable from "sortablejs";
import {connectStore} from "~/store/connecter";
import {getTableColumnInfo} from "~/composables/api/template";
import TableSelect from "~/components/TableSelect.vue";
import {tableColumnSelectStore} from '~/store/tableColumnSelect'
import {MessagePlugin} from 'tdesign-vue-next';
const emit = defineEmits(['refresh'])

// 连接信息
const connection = connectStore();
// 列缓存
const TABLE_COLUMN_SELECT_STORE = tableColumnSelectStore();

onMounted(()=>{
  gridOptions.data = TABLE_COLUMN_SELECT_STORE.GET_GRID_OPTIONS_DATA()
  gridOptions_select.data = TABLE_COLUMN_SELECT_STORE.GET_GRID_OPTIONS_SELECT_DATA()
  selectTableName.value = TABLE_COLUMN_SELECT_STORE.GET_SELECT_TABLE_NAME()

  // 行拖拽
  rowDrop()
})

/**
 * 页面卸载
 */
onBeforeUnmount(() => {
  if (sortable.value) {
    sortable.value.destroy()
  }
})

// 表格信息展示配置
const gridOptions = reactive({
  border: true,
  height: 500,
  align: null,
  columnConfig: {
    resizable: true
  },
  columns: [
    {
      type: 'checkbox',
      width: 50,
      align: 'center',
      fixed: 'left'
    },
    { type: 'seq',width: 50},
    {
      field: 'COLUMN_NAME',
      title: '字段',
      width:200,
      sortable: true,
      filters: [{data: {vals: [], sVal: ''}}],
      filterRender: {name: 'FilterContent'},
    },
    {
      field: 'COLUMN_COMMENT',
      title: '注释',
      width:160,
      sortable: true,
      filters: [{data: {vals: [], sVal: ''}}],
      filterRender: {name: 'FilterContent'},
    },
    {
      field: 'DATA_TYPE',
      title: '类型',
      width:150,
      sortable: true,
      filters: [{data: {vals: [], sVal: ''}}],
      filterRender: {name: 'FilterContent'},
    },
    {
      field: 'CHARACTER_MAXIMUM_LENGTH',
      title: '长度',
      width:120,
      sortable: true,
      filters: [{data: {vals: [], sVal: ''}}],
      filterRender: {name: 'FilterContent'},
    },
    {
      field: 'COLUMN_DEFAULT',
      title: '默认值',
      width:160,
      sortable: true,
      filters: [{data: {vals: [], sVal: ''}}],
      filterRender: {name: 'FilterContent'},
    },
    {
      field: 'IS_NULLABLE',
      title: '可为空',
      width:160,
      sortable: true,
      filters: [{data: {vals: [], sVal: ''}}],
      filterRender: {name: 'FilterContent'},
    },
    {
      field: 'COLUMN_KEY',
      title: '索引类型',
      width:160,
      sortable: true,
      filters: [{data: {vals: [], sVal: ''}}],
      filterRender: {name: 'FilterContent'},
    },
  ],
  data: [],
  sourceData: []
})

// 行拖拽展示控制
const sortable = ref(false)

// 选中信息展示配置
const gridOptions_select = reactive({
  border: true,
  height: 500,
  align: null,
  columnConfig: {
    resizable: true
  },
  columns: [
    {
      type: 'checkbox',
      width: 50,
      align: 'center',
      fixed: 'left'
    },
    { type: 'seq',width: 50},
    { width: 60, slots: { default: 'dragBtn', header: 'dragTip' } },
    {
      field: 'COLUMN_NAME',
      title: '字段',
      width:200,
      sortable: true,
      filters: [{data: {vals: [], sVal: ''}}],
      filterRender: {name: 'FilterContent'},
    },
    {
      field: 'COLUMN_COMMENT',
      title: '注释',
      width:160,
      sortable: true,
      filters: [{data: {vals: [], sVal: ''}}],
      filterRender: {name: 'FilterContent'},
    },
    {
      field: 'DATA_TYPE',
      title: '类型',
      width:150,
      sortable: true,
      filters: [{data: {vals: [], sVal: ''}}],
      filterRender: {name: 'FilterContent'},
    },
    {
      field: 'CHARACTER_MAXIMUM_LENGTH',
      title: '长度',
      width:120,
      sortable: true,
      filters: [{data: {vals: [], sVal: ''}}],
      filterRender: {name: 'FilterContent'},
    },
    {
      field: 'COLUMN_DEFAULT',
      title: '默认值',
      width:160,
      sortable: true,
      filters: [{data: {vals: [], sVal: ''}}],
      filterRender: {name: 'FilterContent'},
    },
    {
      field: 'IS_NULLABLE',
      title: '可为空',
      width:160,
      sortable: true,
      filters: [{data: {vals: [], sVal: ''}}],
      filterRender: {name: 'FilterContent'},
    },
    {
      field: 'COLUMN_KEY',
      title: '索引类型',
      width:160,
      sortable: true,
      filters: [{data: {vals: [], sVal: ''}}],
      filterRender: {name: 'FilterContent'},
    },
  ],
  data: []
})

// 生成结果
const result = ref("")

// 搜索
const searchValue = ref("")

// 选择的表
const selectTableName = ref("")
const selectTableComment = ref("")

const gridRef = ref();
const gridSelectRef = ref();
const tableSelect = ref();

/**
 * 获取所有表
 */
const getTable = (()=>{
    tableSelect.value.show();
})

/**
 * 根据表名获取字段信息
 * @param TABLE_NAME
 * @param TABLE_COMMENT
 */
const getColumnInfo = (TABLE_NAME,TABLE_COMMENT) => {
  selectTableName.value = TABLE_NAME
  selectTableComment.value = TABLE_COMMENT
  TABLE_COLUMN_SELECT_STORE.SET_SELECT_TABLE_NAME(TABLE_NAME);
  gridOptions.data = []
  gridOptions.sourceData = []
  gridOptions_select.data = []

  let connectInfo = connection.getConnectInfo();
  connectInfo.table = TABLE_NAME

  getTableColumnInfo(connectInfo).then((res)=>{
    const {code,data} = res
    if (code === 200 && data && data.length){
      gridOptions.data = data
      gridOptions.sourceData = data
      TABLE_COLUMN_SELECT_STORE.SET_GRID_OPTIONS_DATA(data)
    }
  })
}

/**
 * 获取选中的列
 */
const selectColumn = () => {
  if (gridRef.value && typeof gridRef.value.getCheckboxRecords === 'function') {
    const records = gridRef.value.getCheckboxRecords()
    gridOptions_select.data = records
    TABLE_COLUMN_SELECT_STORE.SET_GRID_OPTIONS_SELECT_DATA(records)
  }
}

// 重置
const refresh = (()=>{
  selectTableName.value = ""
  gridOptions.data = []
  gridOptions.sourceData = []
  gridOptions_select.data = []
  TABLE_COLUMN_SELECT_STORE.SET_SELECT_TABLE_NAME("");
  TABLE_COLUMN_SELECT_STORE.SET_GRID_OPTIONS_DATA([])
  TABLE_COLUMN_SELECT_STORE.SET_GRID_OPTIONS_SELECT_DATA([])
})

/**
 * 表格双击事件
 *
 * @param row
 * @param $rowIndex
 */
const onTableDbClick = ({ row, $rowIndex }) => {
  // 校验是否重复选择字段
  const exists = gridOptions_select.data.some(item => item.COLUMN_NAME === row.COLUMN_NAME);
  if (exists) {
    return MessagePlugin.warning(`${row.COLUMN_NAME} 已存在`);
  }

  gridOptions_select.data.push(row);
  TABLE_COLUMN_SELECT_STORE.SET_GRID_OPTIONS_SELECT_DATA(gridOptions_select.data)
};

/** 行拖拽 */
const rowDrop = (() => {
    const xGrid = gridSelectRef.value;
    if (xGrid) {
      sortable.value = Sortable.create(xGrid.$el.querySelector('.body--wrapper > .vxe-table--body tbody'), {
        handle: '.drag-btn',
        onEnd: ({ newIndex, oldIndex }) => {
          const currRow = gridOptions_select.data.splice(oldIndex, 1)[0];
          gridOptions_select.data.splice(newIndex, 0, currRow);
        }
      });
    }
})

/**
 * 搜索过滤表
 */
const search = () => {
  const search = searchValue.value
  //获取输入的关键字
  const keyword = `${search}`.trim().toLocaleLowerCase();
  //判断关键字
  if (keyword) {
    const searchProps = [];

    gridOptions.columns.forEach((v) => {
      if (v.field) searchProps.push(v.field);
    });

    const temp_tableData = toRaw(gridOptions.sourceData);
    //过滤出的数据
    gridOptions.data = temp_tableData.filter((item) => {
      return searchProps.some(
          (key) => `${item[key]}`.toLowerCase().indexOf(keyword) > -1
      );
    });
  } else {
    gridOptions.data = JSON.parse(JSON.stringify(gridOptions.sourceData));
  }
}

// 对外暴露属性 | 方法
defineExpose({
  gridOptions_select,refresh,selectTableName
})
</script>

<template>
    <div class="table-column-select">
        <div class="menu">
            <t-row>
                <t-col :span="2">
                    <t-button block @click="getTable">选择数据源</t-button>
                </t-col>
                <t-col :span="5">
                    <div class="show_data_info">
                        当前数据表：{{selectTableName}} ————————  {{selectTableComment}}
                    </div>
                </t-col>
                <t-col :span="5" style="text-align: right">
                  <t-space>
                    <t-input v-model="searchValue" @change="search" auto-width clearable placeholder="请输入查询关键字" style="width: 300px;"/>
                    <t-button @click="selectColumn">确认选择</t-button>
                  </t-space>
                </t-col>
            </t-row>
        </div>

        <t-divider align="left"><strong>字段选择</strong></t-divider>

        <t-row  :gutter="16">
            <t-col :span="6">
                <vxe-grid ref="gridRef" v-bind="gridOptions" @cell-dblclick="onTableDbClick" round stripe/>
            </t-col>
            <t-col :span="6">
              <vxe-grid ref="gridSelectRef" v-bind="gridOptions_select" round stripe>
                <template #dragBtn>
                  <span class="drag-btn">
                    <Move1Icon />
                  </span>
                </template>
                <template #dragTip>
                  <vxe-tooltip content="按住后可以上下拖动排序！" enterable>
                    <i class="vxe-icon-question-circle-fill"></i>
                  </vxe-tooltip>
                </template>
              </vxe-grid>
            </t-col>
        </t-row>

        <!-- 连接弹窗 -->
        <TableSelect ref="tableSelect" @getColumnInfo="getColumnInfo"/>
    </div>
</template>

<style scoped lang="scss">
.table-column-select{

  .menu{
      padding: 15px;
      border-radius: 7px;
      box-shadow: $default-box-shadow;

      .show_data_info{
        border: 1px dashed $default-color;
        color: $default-color;
        line-height: 30px;
        padding: 0 20px;
        margin: 0 20px;
        font-weight: bold;
        font-size: 1.1em;
      }
  }
}
</style>