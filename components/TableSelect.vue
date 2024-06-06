<script setup lang="ts">
import {reactive, ref} from 'vue'
import {getAllTable} from "~/composables/api/template";
import {connectStore} from "~/store/connecter";

// 连接信息
const connection = connectStore();

// 父组件方法
const getColumnInfoEmit = defineEmits(["getColumnInfo"])

// 资源弹窗配置项
const gridOptions_source = reactive({
  border: true,
  height: 300,
  align: null,
  columnConfig: {
    resizable: true
  },
  columns: [
    {
      type: 'radio',
      width: 50,
      align: 'center',
      fixed: 'left'
    },
    { type: 'seq', width: 50 },
    {
      field: 'TABLE_NAME',
      title: '表名',

      sortable: true,
      filters: [{data: {vals: [], sVal: ''}}],
      filterRender: {name: 'FilterContent'},
    },
    {
      field: 'TABLE_COMMENT',
      title: '注释',
      sortable: true,
      filters: [{data: {vals: [], sVal: ''}}],
      filterRender: {name: 'FilterContent'},
    },
  ],
  data: []
})

// 数据源弹窗展示状态
const selectTableVisible = ref(false)

// 搜索变量
const searchTableValue = ref("")
let tableData = reactive([])

/**
 * 展示弹窗展示方法
 */
const show = (()=>{
  selectTableVisible.value = true
  searchTableValue.value = ""

  const connectInfo = connection.getConnectInfo();
  if (connectInfo){
    getAllTable(connectInfo).then((res:any)=>{
      gridOptions_source.data = res.data
      tableData = res.data
    })
  }
})

/**
 * 搜索过滤表
 */
const search = () => {
  const search = searchTableValue.value
  //获取输入的关键字
  const keyword = `${search}`.trim().toLocaleLowerCase();
  //判断关键字
  if (keyword) {
    const searchProps: any[] = [];

    gridOptions_source.columns.forEach((v) => {
      if (v.field) searchProps.push(v.field);
    });

    const temp_tableData = toRaw(tableData);
    //过滤出的数据
    gridOptions_source.data = temp_tableData.filter((item: { [x: string]: any; }) => {
      return searchProps.some(
          (key) => `${item[key]}`.toLowerCase().indexOf(keyword) > -1
      );
    });
  } else {
    gridOptions_source.data = JSON.parse(JSON.stringify(tableData));
  }
}

/**
 * 单选框选中事件
 */
const selectTable = (({ newValue } : any) => {
  console.log(newValue)
  getColumnInfoEmit('getColumnInfo',newValue.TABLE_NAME,newValue.TABLE_COMMENT)
  selectTableVisible.value = false
})

/**
 * 表格双击事件
 */
const onTableDbClick = (({row} : any)=>{
  getColumnInfoEmit('getColumnInfo',row.TABLE_NAME,row.TABLE_COMMENT)
  selectTableVisible.value = false
})

// 对外暴露属性 | 方法
defineExpose({
  show,
})
</script>

<template>
    <div>
      <client-only>
        <t-dialog
            destroyOnClose
            header="选择数据源"
            width="60%"
            v-model:visible="selectTableVisible">
          <t-input v-model="searchTableValue" auto-width clearable placeholder="请输入查询关键字" @change="search" style="width: 300px;margin-bottom: 10px"/>
          <vxe-grid v-bind="gridOptions_source"
                    round
                    stripe
                    @radio-change="selectTable"
                    @cell-dblclick="onTableDbClick"/>
          <template #footer>
            <span></span>
          </template>
        </t-dialog>
      </client-only>
    </div>
</template>