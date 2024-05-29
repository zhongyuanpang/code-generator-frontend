<script setup lang="ts">
import MarkdownIt from 'markdown-it';

/**
 * 处理数据
 */
const process = (() => {

  const result = `
## 定义参数
\`\`\`js
//region  《扩展列表选项》
extendList:[
   {Tname:'从Excel粘贴'}
],
//endregion

//region excel数据导入弹窗
excelModal: false,
// 表格粘贴绑定参数
inputProps: {
    rows: 10,
    placeholder: '尝试从Excel复制一段表格数据,粘贴在这里'
},
copyColumns: [],
copyData: [],
value: '',
//endregion
\`\`\`

## 定义粘贴处理方法
\`\`\`js
//region  《--excel数据粘贴--》
TablePasteOK() {
    const processedRecords = this.copyData.map(i => {
        const processedItem = { ...i, id: -1 };
        // 或者公式计算等
        this.calculate(processedItem);
        return processedItem;
    });

    this.gridOptions.data.push(...processedRecords);
    this.$refs.tablePaste.content = ""
},
//表格粘贴数据成功
handleSuccess(tableData) {
    const copyColumns = []; // 复制数据的表头
    const copyData = [];  // 复制表格的数据
    const tableColumns = this.gridOptions.columns;

    tableData.columns.forEach(item => {
        if (item.title !== undefined) {
            const matchedColumn = tableColumns.find(column => {
                return column.title !== undefined && item.title.replace(/\\s/g, '') === column.title.replace(/\\s/g, '');
            });
            if (matchedColumn) {
                item.field = matchedColumn.field;
                copyColumns.push(item);
            }
        }
    });

    tableData.data.forEach(row => {
        const rowData = {};
        for (const [key, value] of Object.entries(row)) {
            const matchedColumn = tableData.columns.find(column => column.key === key);
            if (matchedColumn) {
                rowData[matchedColumn.field] = value;
            }
        }
        copyData.push(rowData);
    });

    this.copyColumns = copyColumns;
    this.copyData = copyData;
},
handleError(tableData, errorIndex) {
    this.$Message.error('表格数据有误❌');
},
//endregion
\`\`\`

## 修改子表扩展事件
\`\`\`js
 //扩展子组件事件
extendClick(i) {
    switch(i.Tname){
        case "从Excel粘贴":
          this.excelModal = true;
          break
    }
},
\`\`\`

## 定义弹窗组件
\`\`\`html
<!-- excel数据粘贴 -->
<Modal v-model="excelModal" draggable scrollable :mask="false" width="800" title="Excel数据粘贴"
       @on-ok="TablePasteOK">
    <TablePaste hide-table :input-props="inputProps" ref="tablePaste" :value="value" @on-success="handleSuccess"
                @on-error="handleError"/>
    <p><strong>注意:</strong><span style='color:red'>表头位置排列顺序必须与模版一致，表头文字不要换行。</span></p>
</Modal>
\`\`\`
  `
  const md = new MarkdownIt();

  return md.render(result);
})

defineExpose({
  process
});
</script>

<template>
    <div>
        <t-card title="Excel粘贴" hover-shadow>
            <h4>说明</h4>
        </t-card>
    </div>
</template>

<style scoped lang="scss">

</style>