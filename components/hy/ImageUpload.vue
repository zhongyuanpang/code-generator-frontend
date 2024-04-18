<script setup lang="ts">
import MarkdownIt from 'markdown-it';

/**
 * 处理数据
 */
const process = (() => {

  const result = `
## 主表
\`\`\`html
<Col :xl="24" :lg="24" :md="12" :sm="24" :xs="24" v-if="flagObj.photo!=1">
    <FormItem key="photo" label="产品图片" label-for="photo" prop="photo">
        <hyUpload :modules="uploadModelName" :row="row" :fieldName="'photo'" :disabled="flagObj.photo==2"
                  @photoDelUrl="photoDelUrl($event)" :height="270"/>
    </FormItem>
</Col>
\`\`\`

## 子表
\`\`\`html
<template #khcptp_default="{row, column}">
    <hyUpload :modules="uploadModelName" :row="row" :fieldName="'khcptp'" :disable="Boolean(setDisabled(row,column))"
              @photoDelUrl="photoDelUrl(row,$event)" height="45"/>
</template>
<template #khcptp_edit="{row, column}">
    <hyUpload :modules="uploadModelName" :row="row" :fieldName="'khcptp'" :disable="Boolean(setDisabled(row,column))"
              @photoDelUrl="photoDelUrl(row,$event)" height="45"/>
</template>
\`\`\`

\`\`\`js
## 图片删除事件
photoDelUrl(val) {
    this.row[val] = "";
},
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
      <t-card title="图片上传" hover-shadow>
        <h4>说明</h4>
        <p>1.请将模块路径添加到后端配置类 SystemConfig 中（在 addResourceHandlers() 方法中的 registry.addResourceHandler("/static/**") 之后的 addResourceLocations 中添加）；</p>
        <p>2.图片控件可能需要横跨多行，请注意高度设置与页面布局；</p>
        <p>3.通过行数自动生成的高度是一个近似值，需要视情况调整。</p>
      </t-card>
    </div>
</template>