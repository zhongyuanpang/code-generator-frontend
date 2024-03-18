<script setup lang="ts">
import {onMounted,reactive, ref,nextTick,defineEmits} from 'vue'
import {connectStore} from "~/store/connecter";
import {getTableColumnInfo} from "~/composables/api/template";
import TableSelect from "~/components/TableSelect.vue";
import {tableColumnSelectStore} from '~/store/tableColumnSelect'
const emit = defineEmits(['refresh'])

// 连接信息
const connection = connectStore();
// 列缓存
const TABLE_COLUMN_SELECT_STORE = tableColumnSelectStore();

onMounted(()=>{
  gridOptions.data = TABLE_COLUMN_SELECT_STORE.GET_GRID_OPTIONS_DATA()
  gridOptions_select.data = TABLE_COLUMN_SELECT_STORE.GET_GRID_OPTIONS_SELECT_DATA()
  selectTableName.value = TABLE_COLUMN_SELECT_STORE.GET_SELECT_TABLE_NAME()
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
      width:250,
      sortable: true,
      filters: [{data: {vals: [], sVal: ''}}],
      filterRender: {name: 'FilterContent'},
    },
    {
      field: 'COLUMN_COMMENT',
      title: '注释',
      width:250,
      sortable: true,
      filters: [{data: {vals: [], sVal: ''}}],
      filterRender: {name: 'FilterContent'},
    },
    {
      field: 'DATA_TYPE',
      title: '类型',
      width:160,
      sortable: true,
      filters: [{data: {vals: [], sVal: ''}}],
      filterRender: {name: 'FilterContent'},
    },
    {
      field: 'CHARACTER_MAXIMUM_LENGTH',
      title: '长度',
      width:160,
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
    {
      field: 'COLUMN_NAME',
      title: '字段',
      width:250,
      sortable: true,
      filters: [{data: {vals: [], sVal: ''}}],
      filterRender: {name: 'FilterContent'},
    },
    {
      field: 'COLUMN_COMMENT',
      title: '注释',
      width:250,
      sortable: true,
      filters: [{data: {vals: [], sVal: ''}}],
      filterRender: {name: 'FilterContent'},
    },
    {
      field: 'DATA_TYPE',
      title: '类型',
      width:160,
      sortable: true,
      filters: [{data: {vals: [], sVal: ''}}],
      filterRender: {name: 'FilterContent'},
    },
    {
      field: 'CHARACTER_MAXIMUM_LENGTH',
      title: '长度',
      width:160,
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

const gridRef = ref();
const tableSelect = ref();

/**
 * 获取所有表
 */
const getTable = (()=>{
    tableSelect.value.show();
})

/**
 * 根据表名获取字段信息
 * @param value
 */
const getColumnInfo = (value:string) => {
  selectTableName.value = value
  TABLE_COLUMN_SELECT_STORE.SET_SELECT_TABLE_NAME(value);
  gridOptions.data = []
  gridOptions_select.data = []

  let connectInfo = connection.getConnectInfo();
  connectInfo.table = value

  getTableColumnInfo(connectInfo).then((res:any)=>{
    const {code,data} = res
    if (code === 200 && data && data.length){
      gridOptions.data = res.data
      TABLE_COLUMN_SELECT_STORE.SET_GRID_OPTIONS_DATA(res.data)
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
  gridOptions_select.data = []
  TABLE_COLUMN_SELECT_STORE.SET_SELECT_TABLE_NAME("");
  TABLE_COLUMN_SELECT_STORE.SET_GRID_OPTIONS_DATA([])
  TABLE_COLUMN_SELECT_STORE.SET_GRID_OPTIONS_SELECT_DATA([])
})

// 对外暴露属性 | 方法
defineExpose({
  gridOptions_select,refresh
})
</script>

<template>
    <div class="table-column-select">
        <div class="menu">
            <t-row>
                <t-col :span="2">
                    <t-button block @click="getTable">选择数据源</t-button>
                </t-col>
                <t-col :span="3">
                    <div class="show_data_info">
                        当前数据表：{{selectTableName}}
                    </div>
                </t-col>
                <t-col :span="7" style="text-align: right">
                  <t-space>
                    <t-input v-model="searchValue" auto-width clearable placeholder="请输入" style="width: 300px;"/>
                    <t-button @click="selectColumn">确认选择</t-button>
                  </t-space>
                </t-col>
            </t-row>
        </div>
        <t-divider align="left"><strong>字段选择</strong></t-divider>

<!--        <vxe-grid ref="gridRef" v-bind="gridOptions" round stripe/>-->

<!--        <t-divider align="left">选择列表</t-divider>-->

<!--        <vxe-grid v-bind="gridOptions_select" round stripe/>-->

        <t-row  :gutter="16">
            <t-col :span="6">
                <vxe-grid ref="gridRef" v-bind="gridOptions" round stripe/>
            </t-col>
            <t-col :span="6">
                <vxe-grid v-bind="gridOptions_select" round stripe/>
            </t-col>
        </t-row>

        <!-- 连接弹窗 -->
        <TableSelect ref="tableSelect" @getColumnInfo="getColumnInfo"/>

<!--        <client-only>-->
<!--          <t-dialog-->
<!--              destroyOnClose-->
<!--              header="选择数据源"-->
<!--              width="60%"-->
<!--              v-model:visible="selectTableVisible">-->
<!--              <t-input v-model="searchTableValue" auto-width clearable placeholder="请输入" @change="search" style="width: 300px;"/>-->
<!--              <vxe-grid v-bind="gridOptions_source"-->
<!--                        round-->
<!--                        stripe-->
<!--                        @radio-change="selectTable"-->
<!--                        @cell-dblclick="onTableDbClick"/>-->
<!--            <template #footer>-->
<!--              <span></span>-->
<!--            </template>-->
<!--          </t-dialog>-->
<!--        </client-only>-->

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