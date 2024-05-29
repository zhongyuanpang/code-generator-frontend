<script setup lang="ts">
import {ref} from 'vue'
import {MessagePlugin} from 'tdesign-vue-next';
import MarkdownIt from 'markdown-it';
import TableColumnSelect from "~/components/TableColumnSelect.vue";

// 生成结果
const result = ref("")

const tableColumnSelect = ref()

// 启用lombok
const isLombok = ref(false)
// 国际化
const isI18n = ref(false)
// 是否为子表
const isSub = ref(false)
// 子表输入禁用为老版本
const subDisabled = ref(false)

/**
 * 重置数据
 */
const refresh = (()=>{
  tableColumnSelect.value.refresh()
})

/**
 * 处理数据
 */
const process = (() => {
  const list = tableColumnSelect.value.gridOptions_select.data;
  const tableName = tableColumnSelect.value.selectTableName
  if (!list || !list.length) return MessagePlugin.warning('请选择数据');

  let entity = ''
  let create_key = ','
  let create_values = ','
  let update = ','
  let select = ','
  let createInserts_key = ','
  let createInserts_values = ','

  let updateBase = ``
  let mainTable = ``
  let formItem = ``

  let sub_edit = ``
  let sub_modal = ``
  let sub_column = ``
  let listTable = ``

  list.forEach((item: any)=>{
    entity += generate_entity(item)
    create_key += generate_create_key(item)
    create_values += generate_create_values(item)
    update += generate_update(item)
    select += generate_select(item)
    createInserts_key += generate_create_key(item)
    createInserts_values += generate_createInserts_values(item)

    if (isSub.value){
      sub_edit += generate_sub_edit(item)
      sub_column += generate_sub_column(item,tableName)
      sub_modal += generate_sub_modal(item,tableName)
      listTable += generate_mainTable(item,tableName)
    }else {
      updateBase += generate_updateBase(item)
      mainTable += generate_mainTable(item,tableName)
      formItem += generate_formItem(item,tableName)
    }
  })

  // 主表生成代码
  const mainResult = `
## updateBase.js（部分项目为 row and setDefaultData）
\`\`\`js
${updateBase}
\`\`\`

## mainTable.js
\`\`\`js
${mainTable}
\`\`\`

## update.vue
\`\`\`html
${formItem}
\`\`\`
`

  // 子表生成代码
  const subResult = `
## detailTable.vue
### 标签
\`\`\`html
${sub_edit}
\`\`\`

### modal弹窗
\`\`\`js
${sub_modal}
\`\`\`

### column列
\`\`\`js
${sub_column}
\`\`\`

## listTable.js
\`\`\`js
${listTable}
\`\`\`
`

  let newStr =
      `
# 后端
## entity
\`\`\`java
${entity}
\`\`\`

## Mapper
### create-key
\`\`\`xml
${create_key.slice(0,-1)}
\`\`\`
### create-values
\`\`\`xml
${create_values.slice(0,-1)}
\`\`\`
### update
\`\`\`xml
${update.slice(0,-1)}
\`\`\`
### select
\`\`\`xml
${select.slice(0,-1)}
\`\`\`
### createInserts-key
\`\`\`xml
${createInserts_key.slice(0,-1)}
\`\`\`
### createInserts-values
\`\`\`xml
${createInserts_values.slice(0,-1)}
\`\`\`

# 前端

`

  if (isSub.value) newStr += subResult;
  else newStr += mainResult

  const md = new MarkdownIt();

  return md.render(newStr);
})

// region 《- 生成代码 -》
const generate_entity = ((item:any)=>{
  const {COLUMN_NAME,COLUMN_COMMENT,DATA_TYPE} = item
  let type = ``

  switch (DATA_TYPE) {
    case "varchar":
    case "text":
    case "longtext":
      type = `String`;
      break;
    case "double":
      type = `Double`;
      break
    case "int":
    case "tinyint":
      type = `Integer`;
      break;
    case "bit":
      type = `Boolean`;
      break;
    case "datetime":
      type = `LocalDateTime`;
      break
    case "date":
      type = `LocalDate`;
      break
  }
  let result = ``
//   if (type === `LocalDateTime`) {
//       result += `
// @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone="GMT+8")`
//   }
//   if (type === `LocalDate`) {
//       result += `
// @JsonFormat(pattern="yyyy-MM-dd",timezone="GMT+8")`
//   }
  result += `
@ApiModelProperty("${COLUMN_COMMENT}")
private ${type} ${COLUMN_NAME};
${isLombok.value ? '' : `
@JsonProperty("${COLUMN_NAME}")
public ${type} get${COLUMN_NAME.slice(0, 1).toUpperCase() + COLUMN_NAME.slice(1)}() {
    return this.${COLUMN_NAME};
}

public void set${COLUMN_NAME.slice(0, 1).toUpperCase() + COLUMN_NAME.slice(1)}(${type} value) {
    this.${COLUMN_NAME} = value;
}\n`}`;

  return result
})

const generate_create_key = ((item:any)=>{
  const {COLUMN_NAME} = item
  return `
${COLUMN_NAME},`
})

const generate_create_values = ((item:any)=>{
  const {COLUMN_NAME} = item
  return `
#{${COLUMN_NAME}},`
})

const generate_update = ((item:any)=>{
  const {COLUMN_NAME} = item
  return `
${COLUMN_NAME}=#{${COLUMN_NAME}},`
})

const generate_select = ((item:any)=>{
  const {COLUMN_NAME} = item
  return `
${COLUMN_NAME} AS ${COLUMN_NAME},`
})

const generate_createInserts_values = ((item:any)=>{
  const {COLUMN_NAME} = item
  return `
#{value.${COLUMN_NAME}},`
})

const generate_updateBase = ((item:any)=>{
  const {COLUMN_NAME,DATA_TYPE} = item
  let result = ``

  switch (DATA_TYPE) {
    case "varchar":
    case "text":
      result = `
${COLUMN_NAME} : '',`;
      break;
    case "bit":
      result = `
${COLUMN_NAME} : 0,`;
      break;
    case "double":
    case "int":
    case "tinyint":
      result = `
${COLUMN_NAME} : 0,`;
      break;
    case "datetime":
    case "date":
      result = `
${COLUMN_NAME} : null,`;
      break
  }

  return result
})

const generate_mainTable = ((item:any,tableName:string)=> {
  const {COLUMN_NAME, COLUMN_COMMENT, DATA_TYPE} = item

  let result = ``

  switch (DATA_TYPE){
    case "datetime":
    case "date":
      result = `
{
    title: ${isI18n.value ? `this.$t('${tableName}.${COLUMN_NAME}')` : `'${COLUMN_COMMENT}'`},
    width: 150,
    field: '${COLUMN_NAME}',
    sortable: true,
    filters: [{data: {vals: [], sVal: ''}}],
    filterRender: {name: 'FilterContent'},
    slots: {
        default: ({row,column}) => {
            return XEUtils.toDateString(row[column.field], 'yyyy-MM-dd')
        }
    }
},`
      break
    case "bit":
      result = `
{
    title: ${isI18n.value ? `this.$t('${tableName}.${COLUMN_NAME}')` : `'${COLUMN_COMMENT}'`},
    width: 150,
    field: '${COLUMN_NAME}',
    sortable: true,
    filters: [{data: {vals: [], sVal: ''}}],
    filterRender: {name: 'FilterContent'},
    slots: {
        default: ({row,column}) => {
            return [
                <Checkbox value={row[column.field]} disabled/>
            ]
        }
    }
},`
      break
    default:
      result = `
{
    title: ${isI18n.value ? `this.$t('${tableName}.${COLUMN_NAME}')` : `'${COLUMN_COMMENT}'`},
    width: 150,
    field: '${COLUMN_NAME}',
    sortable: true,
    filters: [{data: {vals: [], sVal: ''}}],
    filterRender: {name: 'FilterContent'},
},`
      break
  }

  return result
})

const generate_formItem = ((item:any,tableName:string)=> {
  const {COLUMN_NAME, COLUMN_COMMENT, DATA_TYPE} = item
  let result = ``

  switch (DATA_TYPE){
    case "datetime":
    case "date":
      result = `
<Col :xl="8" :lg="8" :md="12" :sm="24" :xs="24" v-if="flagObj.${COLUMN_NAME}!=1">
  <FormItem key="${COLUMN_NAME}" ${isI18n.value ? `:label="$t('${tableName}.${COLUMN_NAME}')"` : `label="${COLUMN_COMMENT}"`} label-for="${COLUMN_NAME}" prop="${COLUMN_NAME}">
    <DatePicker type="date" :value="row.${COLUMN_NAME}"
                format="yyyy-MM-dd" transfer on-clear
                @on-change="row.${COLUMN_NAME} = $event" v-width="'100%' "
                :disabled="flagObj.${COLUMN_NAME}==2"
                element-id="${COLUMN_NAME}"></DatePicker>
  </FormItem>
</Col>`
      break
    case "varchar":
    case "text":
    case "longtext":
      result = `
<Col :xl="8" :lg="8" :md="12" :sm="24" :xs="24" v-if="flagObj.${COLUMN_NAME}!=1">
  <FormItem key="${COLUMN_NAME}" ${isI18n.value ? `:label="$t('${tableName}.${COLUMN_NAME}')"` : `label="${COLUMN_COMMENT}"`} label-for="${COLUMN_NAME}" prop="${COLUMN_NAME}">
    <Input v-model="row.${COLUMN_NAME}" type="text"
           @on-focus="inputFocus($event)"
           :disabled="flagObj.${COLUMN_NAME}==2"
           element-id="${COLUMN_NAME}"></Input>
  </FormItem>
</Col>`
      break
    case "int":
    case "double":
    case "tinyint":
      result = `
<Col :xl="8" :lg="8" :md="12" :sm="24" :xs="24" v-if="flagObj.${COLUMN_NAME}!=1">
  <FormItem key="${COLUMN_NAME}" ${isI18n.value ? `:label="$t('${tableName}.${COLUMN_NAME}')"` : `label="${COLUMN_COMMENT}"`} label-for="${COLUMN_NAME}" prop="${COLUMN_NAME}">
    <Input v-model="row.${COLUMN_NAME}" type="number"
           @on-focus="inputFocus($event)"
           :disabled="flagObj.${COLUMN_NAME}==2"
           element-id="${COLUMN_NAME}"></Input>
  </FormItem>
</Col>`
      break
    case "bit":
      result = `
<Col :xl="8" :lg="8" :md="12" :sm="24" :xs="24" v-if="flagObj.${COLUMN_NAME}!=1">
  <FormItem key="${COLUMN_NAME}" ${isI18n.value ? `:label="$t('${tableName}.${COLUMN_NAME}')"` : `label="${COLUMN_COMMENT}"`} label-for="${COLUMN_NAME}" prop="${COLUMN_NAME}">
    <Checkbox class="checkrow" v-model="row.${COLUMN_NAME}" border
                              :disabled="flagObj.${COLUMN_NAME}==2"
                              element-id="${COLUMN_NAME}"></Checkbox>
  </FormItem>
</Col>`
      break
  }

  return result
})

const generate_sub_edit = ((item:any)=>{
  const {COLUMN_NAME,DATA_TYPE} = item
  let result = ``

  switch (DATA_TYPE) {
    case "varchar":
    case "text":
      result =
`
<template #${COLUMN_NAME}_edit="{ row,column }">
  <vxe-input v-model="row.${COLUMN_NAME}" ${subDisabled.value ? `:disabled="main.archived=='1' || (main.processstatus!=1 && main.processstatus!=0) ||
                                 flagObjdata1.${COLUMN_NAME} == 2 || perUpdate == 0"` : `:disabled="Boolean(setDisabled(row,column))"` }
             @focus="inputFocus($event)"></vxe-input>
</template>`;
      break;
    case "double":
    case "int":
    case "tinyint":
      result =
`
<template #${COLUMN_NAME}_edit="{ row,column }">
  <vxe-input v-model.number="row.${COLUMN_NAME}" type="number"  ${subDisabled.value ? `:disabled="main.archived=='1' || (main.processstatus!=1 && main.processstatus!=0) ||
                                 flagObjdata1.${COLUMN_NAME} == 2 || perUpdate == 0"` : `:disabled="Boolean(setDisabled(row,column))"` }
             @focus="inputFocus($event)"></vxe-input>
</template>`;
      break;
    case "datetime":
    case "date":
      result =
`
<template #${COLUMN_NAME}_edit="{ row,column }">
  <vxe-input v-model="row.${COLUMN_NAME}" type="date" transfer  ${subDisabled.value ? `:disabled="main.archived=='1' || (main.processstatus!=1 && main.processstatus!=0) ||
                                 flagObjdata1.${COLUMN_NAME} == 2 || perUpdate == 0"` : `:disabled="Boolean(setDisabled(row,column))"` }
             @focus="inputFocus($event)"></vxe-input>
</template>`;
      break
    case "bit":
        result = `
<template #${COLUMN_NAME}_default="{ row,column }">
  <vxe-checkbox v-model="row.${COLUMN_NAME}"  ${subDisabled.value ? `:disabled="main.archived=='1' || (main.processstatus!=1 && main.processstatus!=0) ||
                                 flagObjdata1.${COLUMN_NAME} == 2 || perUpdate == 0"` : `:disabled="Boolean(setDisabled(row,column))"` }
                @focus="inputFocus($event)"></vxe-checkbox>
</template>
<template #${COLUMN_NAME}_edit="{ row,column }">
  <vxe-checkbox v-model="row.${COLUMN_NAME}"  ${subDisabled.value ? `:disabled="main.archived=='1' || (main.processstatus!=1 && main.processstatus!=0) ||
                                 flagObjdata1.${COLUMN_NAME} == 2 || perUpdate == 0"` : `:disabled="Boolean(setDisabled(row,column))"` }
                @focus="inputFocus($event)"></vxe-checkbox>
</template>`
      break
  }

  return result
})

const generate_sub_column = ((item:any,tableName:string)=>{
  const {COLUMN_NAME,COLUMN_COMMENT,DATA_TYPE} = item
  let result = ``

  switch (DATA_TYPE) {
    case "varchar":
    case "text":
      result =
`
{
    title: ${isI18n.value ? `this.$t('${tableName}.${COLUMN_NAME}')` : `'${COLUMN_COMMENT}'`},
    width: 150,
    field: '${COLUMN_NAME}',
    sortable: true,
    filters: [{data: {vals: [], sVal: ''}}],
    filterRender: {name: 'FilterContent'},
    editRender: {autofocus: '.vxe-input--inner', defaultValue: ''},
    slots: {edit: '${COLUMN_NAME}_edit'},
},`;
      break;
    case "double":
    case "int":
    case "tinyint":
      result =
`
{
    title: ${isI18n.value ? `this.$t('${tableName}.${COLUMN_NAME}')` : `'${COLUMN_COMMENT}'`},
    width: 150,
    field: '${COLUMN_NAME}',
    sortable: true,
    filters: [{data: {vals: [], sVal: ''}}],
    filterRender: {name: 'FilterContent'},
    editRender: {autofocus: '.vxe-input--inner', defaultValue: 0},
    slots: {edit: '${COLUMN_NAME}_edit'},
},`;
      break;
    case "datetime":
    case "date":
      result =
`
{
    title: ${isI18n.value ? `this.$t('${tableName}.${COLUMN_NAME}')` : `'${COLUMN_COMMENT}'`},
    width: 150,
    field: '${COLUMN_NAME}',
    sortable: true,
    filters: [{data: {vals: [], sVal: ''}}],
    filterRender: {name: 'FilterContent'},
    editRender: {autofocus: '.vxe-input--inner', defaultValue: null},
    formatter: formatDate,
    slots: {edit: '${COLUMN_NAME}_edit'},
},`
      break
    case "bit":
      result = `
{
    title: ${isI18n.value ? `this.$t('${tableName}.${COLUMN_NAME}')` : `'${COLUMN_COMMENT}'`},
    width: 150,
    field: '${COLUMN_NAME}',
    sortable: true,
    filters: [{data: {vals: [], sVal: ''}}],
    filterRender: {name: 'FilterContent'},
    editRender: {autofocus: '.vxe-input--inner', defaultValue: false},
    slots: {default: '${COLUMN_NAME}_default', edit: '${COLUMN_NAME}_edit'},
},`
      break
  }

  return result
})

const generate_sub_modal = ((item:any,tableName:string)=>{
  const {COLUMN_NAME,COLUMN_COMMENT,DATA_TYPE} = item
  let result = ``

  switch (DATA_TYPE) {
    case "varchar":
    case "text":
      result =
`
<vxe-form-item field="${COLUMN_NAME}" title="${isI18n.value ? `$t('${tableName}.${COLUMN_NAME}')` : `${COLUMN_COMMENT}`}" :span="8"
               v-if="flagObjdata1.${COLUMN_NAME}!=1 && detailObj.${COLUMN_NAME}!=''">
  <template #default="{ data }">
    <vxe-input :value="data.${COLUMN_NAME}" readonly></vxe-input>
  </template>
</vxe-form-item>`;
      break;
    case "double":
    case "int":
    case "tinyint":
      result =
`
<vxe-form-item field="${COLUMN_NAME}" title="${isI18n.value ? `$t('${tableName}.${COLUMN_NAME}')` : `${COLUMN_COMMENT}`}" :span="8"
               v-if="flagObjdata1.${COLUMN_NAME}!=1 && detailObj.${COLUMN_NAME}!=''">
  <template #default="{ data }">
    <vxe-input :value="data.${COLUMN_NAME}" type="number" readonly></vxe-input>
  </template>
</vxe-form-item>`;
      break;
    case "datetime":
    case "date":
      result =
`
<vxe-form-item field="${COLUMN_NAME}" title="${isI18n.value ? `$t('${tableName}.${COLUMN_NAME}')` : `${COLUMN_COMMENT}`}" :span="8"
               :item-render="{}"
               v-if="flagObjdata1.${COLUMN_NAME}!=1 && detailObj.${COLUMN_NAME}!=''">
  <template #default="{ data }">
    <vxe-input :value="data.${COLUMN_NAME}" type="date"
               readonly></vxe-input>
  </template>
</vxe-form-item>`
      break
    case "bit":
      result = `
<vxe-form-item field="${COLUMN_NAME}" title="${isI18n.value ? `$t('${tableName}.${COLUMN_NAME}')` : `${COLUMN_COMMENT}`}" :span="8"
               v-if="flagObjdata1.${COLUMN_NAME}!=1 && detailObj.${COLUMN_NAME}!=''">
  <template #default="{ data }">
    <vxe-checkbox :value="data.${COLUMN_NAME}" onclick="return false"></vxe-checkbox>
  </template>
</vxe-form-item>`
      break
  }

  return result
})
// endregion

defineExpose({
  process,
  refresh
});
</script>

<template>
    <div>
        <TableColumnSelect ref="tableColumnSelect"/>
        <t-divider align="center"><h3>功能选择</h3></t-divider>
        <t-space>
          <t-checkbox @change="isLombok = !isLombok"><strong>启用lombok</strong><HelpCircleIcon /></t-checkbox>
          <t-checkbox @change="isI18n = !isI18n"><strong>启用国际化</strong></t-checkbox>
          <t-checkbox @change="isSub = !isSub"><strong>是否为子表</strong></t-checkbox>
          <t-checkbox v-if="isSub" @change="subDisabled = !subDisabled"><strong>老版子表disabled</strong></t-checkbox>
        </t-space>
        <t-divider/>
    </div>
</template>