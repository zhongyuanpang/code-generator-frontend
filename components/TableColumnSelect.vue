<script setup lang="ts">
import { reactive,ref } from 'vue'
import { VxeGridProps } from 'vxe-table'
interface RowVO {
  id: number
  name: string
  nickname: string
  role: string
  sex: string
  age: number
  address: string
}

const gridOptions = reactive<VxeGridProps<RowVO>>({
  border: true,
  height: 500,
  align: null,
  columnConfig: {
    resizable: true
  },
  columns: [
    { type: 'seq', width: 50 },
    {
      field: 'name',
      title: '字段',
      sortable: true,
      filters: [{data: {vals: [], sVal: ''}}],
      filterRender: {name: 'FilterContent'},
    },
    {
      field: 'name',
      title: '注释',
      sortable: true,
      filters: [{data: {vals: [], sVal: ''}}],
      filterRender: {name: 'FilterContent'},
    },
    {
      field: 'name',
      title: '类型',
      sortable: true,
      filters: [{data: {vals: [], sVal: ''}}],
      filterRender: {name: 'FilterContent'},
    },
    {
      field: 'name',
      title: '长度',
      sortable: true,
      filters: [{data: {vals: [], sVal: ''}}],
      filterRender: {name: 'FilterContent'},
    },
    {
      field: 'name',
      title: '默认值',
      sortable: true,
      filters: [{data: {vals: [], sVal: ''}}],
      filterRender: {name: 'FilterContent'},
    },
    {
      field: 'name',
      title: '可为空',
      sortable: true,
      filters: [{data: {vals: [], sVal: ''}}],
      filterRender: {name: 'FilterContent'},
    },
    {
      field: 'name',
      title: '索引类型',
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

const selectValue = ref("")
</script>

<template>
    <div class="table-column-select">
        <div class="menu">
            <t-row>
                <t-col :span="4">
                    <t-button block variant="outline">当前数据源：</t-button>
                </t-col>
                <t-col :span="8" style="text-align: right">
                  <t-space>
                    <t-button theme="primary" variant="base" style="display: block">获取列属性</t-button>
                    <t-input v-model="selectValue" auto-width clearable placeholder="请输入" style="width: 300px;"/>
                    <t-button>确认选择</t-button>
                  </t-space>
                </t-col>
            </t-row>
        </div>
        <t-divider align="left">表选择</t-divider>
        <vxe-grid v-bind="gridOptions"/>
    </div>
</template>

<style scoped lang="scss">
.table-column-select{
  position: relative;
  //box-shadow: $default-box-shadow;
  //border-radius: 10px;

  .menu{
      padding: 20px 0;
  }
}
</style>