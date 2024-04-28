<script setup lang="ts">
import MarkdownIt from 'markdown-it';
/**
 * 处理数据
 */
const process = (() => {
  const result = `
## 动态查询
\`\`\`js
const SQL = {
    hy_1: encrypt.encrypt(\`\`), //查询的字段
    hy_2: encrypt.encrypt(\`\`), //查询表
    hy_3: encrypt.encrypt(\`\`), //where条件
    hy_4: encrypt.encrypt(''), //分组条件
    hy_5: encrypt.encrypt(''), //排序条件
    currentPage:encrypt.encrypt(\`\`),//页码
    pageSize:encrypt.encrypt(\`\`),//页数
    hy_6: encrypt.encrypt(''), //权限
}
this.Http(getDynamicQuery(), SQL).then((res) => {
    const {code,data} = res.data;
    if (code === 200) {
        const records = data.resultList;
        if (records && records.length) {

        }
    }
})
\`\`\`

## API请求
\`\`\`js
this.Http({ url: '/xx/xx', method: 'post' }).then(res => {

})
\`\`\`

## 弹窗提示
\`\`\`js
this.hymessage('warning', '鹤虞软件', \`\`)
\`\`\`

## 用户是否为管理员
\`\`\`js
this.Http({
    url:"/hysysRole/findUserIsAdmin",method: 'get'
}).then((res) => {
    if (res.data.code === 200) {

        const flag = res.data.data
        if (!flag) {
            this.hymessage("error", "鹤虞软件", "你不是管理员不能操作此功能！")
        }
        return
    }
}).catch(e => {
    this.hymessage("error", "鹤虞软件", "权限校验失败")
});
\`\`\`

## 数值组件
\`\`\`html
<InputNumber
             v-width="'100%' " :disabled="flagObj.slhj==2"
             @mousedown.native="cancelSelect"
             v-model.number="row.slhj" :active-change="false" @on-focus="inputFocus($event)"
             :formatter="value => value">
</InputNumber>
\`\`\`

## 固定下拉

### 主表
\`\`\`html
<Select v-model="row.spzl" :disabled="flagObj.spzl==2" clearable transfer>
    <Option v-for="(item,index) in spzlList" :label="item" :value="item" :key="index"/>
</Select>
\`\`\`
### 子表
\`\`\`html
<Select v-model="row.lx" clearable :disabled="Boolean(setDisabled(row,column))" transfer>
    <Option v-for="(item,index) in lxList" :label="item" :value="item" :key="index"/>
</Select>
\`\`\`

## 接口下拉

### 主表
\`\`\`html
<AutoComplete
              v-model="row.exporter"
              @on-focus="findFieldList('chnname','exporterList','dic_consigner')"
              :disabled="flagObj.exporter==2"
              icon="ios-arrow-down"
              transfer
              transfer-class-name="AutoComplete-Transfer-MaxHeight"
              >
    <Option v-for="(item,index) in exporterList" :value="item" :key="index"></Option>
</AutoComplete>
\`\`\`
### 子表
\`\`\`html
<AutoComplete
              v-model="row.exporter"
              @on-focus="findFieldList('chnname','exporterList','dic_consigner')"
              :disabled="Boolean(setDisabled(row,column))"
              icon="ios-arrow-down"
              transfer
              transfer-class-name="AutoComplete-Transfer-MaxHeight"
              >
    <Option v-for="(item,index) in exporterList" :value="item" :key="index"></Option>
</AutoComplete>
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
    <t-card title="常用功能" hover-shadow>
      <h4>说明：</h4>
      <p>1、前端常用功能及组件使用</p>
    </t-card>
  </div>
</template>