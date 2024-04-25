<script setup lang="ts">
import {onMounted,onBeforeUnmount,reactive, ref,nextTick} from 'vue'
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
  rowDrop();
})

/**
 * 页面卸载
 */
onBeforeUnmount(() => {

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

// 行拖拽展示提示
const showHelpTip = ref(false)
// 行拖拽展示控制
const rowDrag = ref(false)

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
      width: 60,
      slots: {
        default: () => {
          return [
            h('span', { class: 'drag-btn' }, [
              h('i', { class: 'fa fa-arrows' })
            ])
          ]
        },
        header: () => {
          return [
            h('vxe-tooltip', { content: "按住后可以上下拖动排序！", enterable: true }, [
              h('i', {
                class: 'vxe-icon-question-circle-fill',
                onClick: () => { showHelpTip.value = !showHelpTip.value }
              })
            ])
          ]
        }
      }
    },
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

/**
 * 表格双击事件
 *
 * @param row
 * @param $rowIndex
 */
const onTableDbClick = ({ row, $rowIndex }: { row: any, $rowIndex: number }) => {
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
  nextTick(() => {
    // let xGrid = this.$refs.xGrid
    // rowDrag.value = Sortable.create(xGrid.$el.querySelector('.body--wrapper>.vxe-table--body tbody'), {
    //   handle: '.drag-btn',
    //   onEnd: ({ newIndex, oldIndex }) => {
    //     const currRow = this.tableData.splice(oldIndex, 1)[0]
    //     this.tableData.splice(newIndex, 0, currRow)
    //   }
    // })
    const xGrid = gridRef.value;
    if (xGrid) {
      rowDrag.value = Sortable.create(xGrid.$el.querySelector('.body--wrapper > .vxe-table--body tbody'), {
        handle: '.drag-btn',
        onEnd: ({ newIndex, oldIndex }: { newIndex: number, oldIndex: number }) => {
          const currRow = gridOptions_select.data.splice(oldIndex, 1)[0];
          gridOptions_select.data.splice(newIndex, 0, currRow);
        }
      });
    }
  })
})

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
                        当前数据表：{{selectTableName}}
                    </div>
                </t-col>
                <t-col :span="5" style="text-align: right">
                  <t-space>
                    <t-input v-model="searchValue" auto-width clearable placeholder="请输入" style="width: 300px;"/>
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
                <vxe-grid ref="gridSelectRef" v-bind="gridOptions_select" round stripe/>
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