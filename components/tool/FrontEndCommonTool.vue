<script setup>
import {ref} from 'vue'
import {MessagePlugin} from 'tdesign-vue-next';
import MarkdownIt from 'markdown-it';
import TableColumnSelect from "~/components/TableColumnSelect.vue";

// 生成结果
const result = ref("")
const javaMap = ref(false)
const jsObj = ref(false)
const jsObj1 = ref(false)
const jsObj2 = ref(false)

const radioList = ref([
    "Java Map",
    "Js Object",
    "Js Object1",
    "Js Object2",
    "Js Object3",
])
const tableColumnSelect = ref()

/**
 * 数据处理
 * @type {process}
 */
const process = (() => {
    const data = tableColumnSelect.value.gridOptions_select.data;
    const tableName = tableColumnSelect.value.selectTableName
    if (!data || !data.length) return MessagePlugin.warning('请选择数据');

    let result = ``

    if (javaMap.value) {
        result = generateJavaMap(data);
    }

    const renderResult =
`
\`\`\`js
${result}
\`\`\`
`

    const md = new MarkdownIt();

    return md.render(renderResult);
})

// region 《- 生成数据方法 -》
const generateJavaMap = ((data) => {
    let result =
`Map<String,Object> map = new HashMap();`
    data.forEach((item) => {
        const {COLUMN_NAME,DATA_TYPE} = item

        switch (DATA_TYPE) {
            case "varchar":
            case "text":
                result += `
map.put("${COLUMN_NAME}", "");`;
                break;
            case "double":
            case "int":
            case "tinyint":
              result += `
map.put("${COLUMN_NAME}", 0);`;
                break;
            case "datetime":
            case "date":
                result += `
map.put("${COLUMN_NAME}", null);`;
                break
            case "bit":
                result += `
map.put("${COLUMN_NAME}", false);`;
                break
        }
    })
    return result
})
// endregion

/**
 * 重置数据
 * @type {refresh}
 */
const refresh = (()=>{
  tableColumnSelect.value.refresh()
})

defineExpose({
  process,
  refresh
});
</script>

<template>
    <div>
        <TableColumnSelect ref="tableColumnSelect"/>
        <t-divider align="center">
            <h3>功能选择</h3>
        </t-divider>
        <t-space>
          <t-radio-group default-value="1">
            <t-radio-button value="1">选项一</t-radio-button>
            <t-radio-button value="2">选项二</t-radio-button>
            <t-radio-button value="3">选项三</t-radio-button>
            <t-radio-button value="4">选项四</t-radio-button>
            <t-radio-button value="5">选项五</t-radio-button>
          </t-radio-group>
        </t-space>
        <t-divider/>
    </div>
</template>

<style scoped lang="scss">

</style>