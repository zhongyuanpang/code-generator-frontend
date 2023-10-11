<script setup lang="ts">
import {onMounted,reactive, ref,nextTick} from 'vue'
import {connectStore} from "~/store/connecter";
import {getAllTable, getTableColumnInfo} from "~/composables/template";
import {MessagePlugin} from 'tdesign-vue-next';
import MarkdownIt from 'markdown-it';
import Prism from 'prismjs'

// 连接信息
const connection = connectStore();

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
  toolbarConfig: {
    slots: {
      buttons: 'toolbar_buttons'
    }
  },
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
  toolbarConfig: {
    slots: {
      buttons: 'toolbar_buttons'
    }
  },
  data: []
})

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
  toolbarConfig: {
    slots: {
      buttons: 'toolbar_buttons'
    }
  },
  data: []
})

// 生成结果
const result = ref("")

// 搜索
const searchValue = ref("")

// 选择的表
const selectTableName = ref("")

// 选择数据源弹窗展示状态
const selectTableVisible = ref(false)

const gridRef = ref();

/**
 * 获取所有表
 */
const getTable = (()=>{
    selectTableVisible.value = true

    const dataBase = connection.getConnectInfo().dataBase;
    if (dataBase){
        getAllTable(dataBase).then((res:any)=>{
            gridOptions_source.data = res.data
        })
    }
})

/**
 * 单选框选中事件
 */
const selectTable = (({ newValue } : any) => {
  getColumnInfo(newValue.TABLE_NAME)
})

/**
 * 表格双击事件
 */
const onTableDbClick = (({row} : any)=>{
    getColumnInfo(row.TABLE_NAME)
})

/**
 * 根据表名获取字段信息
 * @param value
 */
const getColumnInfo = (value:string) => {
  selectTableName.value = value
  getTableColumnInfo({
    dataBase:connection.getConnectInfo().dataBase,
    tableName:value
  }).then((res:any)=>{
    const {code,data} = res
    if (code === 200 && data && data.length){
      gridOptions.data = res.data
    }
  })
  selectTableVisible.value = false
}

/**
 * 获取选中的列
 */
const selectColumn = () => {
  if (gridRef.value && typeof gridRef.value.getCheckboxRecords === 'function') {
    gridOptions_select.data = gridRef.value.getCheckboxRecords()
  }
}

/**
 * 生成代码
 */
const generate = (async()=>{
  const list = gridOptions_select.data
  if (!list || !list.length) return MessagePlugin.warning('请选择数据');

  let str = ''
  list.forEach(item=>{
    str += `
        {
          field: '${item['COLUMN_NAME']}',
          title: '${item['COLUMN_COMMENT']}',
          width:250,
          sortable: true,
          filters: [{data: {vals: [], sVal: ''}}],
          filterRender: {name: 'FilterContent'},
        },
        `
  })

  const newStr =
`
# vxe-column

\`\`\`js
${str}
\`\`\`
`

  const md = new MarkdownIt();
  result.value = md.render(newStr);
  nextTick(()=>{
    Prism.highlightAll()
  })
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
        <t-divider align="left">字段选择</t-divider>

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

        <t-divider align="left">功能</t-divider>

        <t-button block @click="generate">生成</t-button>

        <t-divider align="left">数据展示</t-divider>

        <!-- 结果展示 -->
        <div class="generate_content typo typo-selection" v-html="result"></div>

        <!-- 连接弹窗 -->
        <client-only>
          <t-dialog
              destroyOnClose
              header="选择数据源"
              width="60%"
              v-model:visible="selectTableVisible">
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

<style scoped lang="scss">

.table-column-select{
  position: relative;
  //box-shadow: $default-box-shadow;
  //border-radius: 10px;

  .menu{
      margin-top: 50px;
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

  .generate_content{
    padding: 20px;
    min-height: 500px;
    border-radius: 15px;
    box-shadow: $default-box-shadow;
  }
}
</style>