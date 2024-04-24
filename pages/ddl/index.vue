<script setup>
import {reactive, ref} from 'vue'
import TableSelect from "~/components/TableSelect.vue";
import MarkdownIt from 'markdown-it';
import Prism from 'prismjs'
import {MessagePlugin} from 'tdesign-vue-next';
import {getTableColumnInfo} from "~/composables/api/template";

//region  《 变量 、 常量 》

// 选择生成数据库类型
const dataBaseOptions = reactive([
  'MySQL', 'PostgreSQL', 'Oracle', 'SQL Server', 'MongoDB'
])

// 表单校验
const FORM_RULES = {
  tableName: [{ required: true, message: '表名必填' }] ,
  DATA_TYPE: [{ required: true, message: '表名必填' }] ,
};

// 选中的表
const selectTableName = ref("")

// 新增字段表单
const addFieldFormData = reactive({
  tableName: selectTableName,
  fieldList:[]
});

// 生成的结果
const result = ref("")

// tabs默认选择
const value = ref('add');

// 字段类型
const DATA_TYPE_OPTIONS = ["varchar","double","bigint","bit","char","date","datetime","decimal"
  ,"int","text","longtext","tinyint"]

//endregion

//region  《 组件 ref 》

const tableSelect = ref();
//endregion

//region  《 事件 》

const handlePanelChange = (val) => {
  console.log(val);
};

// tabs切换事件
const handlerChange = (newValue) => {
  value.value = newValue;
};

// 生成事件
const generate = (() => {
  switch (value.value){
    case "add":
      generateAdd();
      break
  }
})

const generateAdd = () => {
  const tableName = addFieldFormData.tableName;
  const fieldList = addFieldFormData.fieldList;
  if (!tableName) return MessagePlugin.warning('请先选择数据表！！');
  if (!fieldList || !fieldList.length) return MessagePlugin.warning('请先添加字段！！');

  let str = ``

  fieldList.forEach(item=>{
    const {COLUMN_NAME,COLUMN_COMMENT,DATA_TYPE,CHARACTER_MAXIMUM_LENGTH,COLUMN_DEFAULT,IS_NULLABLE,COLUMN_KEY} = item
    switch (DATA_TYPE) {
      case "date":
      case "datetime":
      case "text":
      case "longtext":
        str +=
            `ALTER TABLE ${tableName} ADD ${COLUMN_NAME} ${DATA_TYPE} COMMENT '${COLUMN_COMMENT}';`
        break
      case "varchar":
        str +=
            `ALTER TABLE ${tableName} ADD ${COLUMN_NAME} ${DATA_TYPE}(${CHARACTER_MAXIMUM_LENGTH}) DEFAULT ${COLUMN_DEFAULT ? `'${COLUMN_DEFAULT}'` : `''`} COMMENT '${COLUMN_COMMENT}';`
        break
      case "double":
      case "bit":
      case "int":
        str +=
            `ALTER TABLE ${tableName} ADD ${COLUMN_NAME} ${DATA_TYPE}(${CHARACTER_MAXIMUM_LENGTH}) DEFAULT ${COLUMN_DEFAULT ? `${COLUMN_DEFAULT}` : 0} COMMENT '${COLUMN_COMMENT}';`
        break
      default:
        str +=
            `ALTER TABLE ${tableName} ADD ${COLUMN_NAME} ${DATA_TYPE}(${CHARACTER_MAXIMUM_LENGTH}) DEFAULT '' COMMENT '${COLUMN_COMMENT}';`
        break
    }
  })


  const mdResult = `
\`\`\`sql
${str}
\`\`\`
`
  const md = new MarkdownIt();

  result.value = md.render(mdResult);
  nextTick(()=>{
    Prism.highlightAll()
  })
}

// 添加字段
const pushField = (() => {
  addFieldFormData.fieldList.push({
    COLUMN_NAME:"",
    COLUMN_COMMENT:"",
    DATA_TYPE:"",
    CHARACTER_MAXIMUM_LENGTH:"",
    IS_NULLABLE:false,
    COLUMN_DEFAULT:"",
    COLUMN_KEY:"",
  })
})

// 获取所有表
const getTable = (()=>{
  tableSelect.value.show();
})

/**
 * 根据表名获取字段信息
 * @param value
 */
const getColumnInfo = (value) => {
  console.log(value)
  selectTableName.value = value
  // selectTableName.value = value
  // TABLE_COLUMN_SELECT_STORE.SET_SELECT_TABLE_NAME(value);
  // gridOptions.data = []
  // gridOptions_select.data = []
  //
  // getTableColumnInfo({
  //   dataBase:connection.getConnectInfo().dataBase,
  //   tableName:value
  // }).then((res:any)=>{
  //   const {code,data} = res
  //   if (code === 200 && data && data.length){
  //     gridOptions.data = res.data
  //     TABLE_COLUMN_SELECT_STORE.SET_GRID_OPTIONS_DATA(res.data)
  //   }
  // })
}

/**
 * 移除字段
 * @param index
 */
const removeField = (index) => {
  addFieldFormData.fieldList.splice(index,1)
}

//endregion
</script>

<template>
  <div class="page">

    <!--region  《 功能区域 》 -->
    <div class="tool">
      <t-row :gutter="16">
        <t-col :span="6">
          <div class="generate_box">
            <t-card title="快速生成SQL语句" hover-shadow :style="{ height: '85vh' }">
              <t-button block @click="getTable">选择数据源</t-button>
              <div class="content">
                <t-tabs :value="value" @change="handlerChange">
                  <t-tab-panel value="add" style="padding: 15px 0">
                    <template #label>
                      <t-icon name="add" class="tabs-icon-margin"/>
                      新增字段
                    </template>
                    <!-- region 新增表单 -->
                    <t-form ref="form" :rules="FORM_RULES" label-align="left"  :data="addFieldFormData" :colon="true">
                      <t-form-item label="表名" name="tableName">
                        <t-input v-model="addFieldFormData.tableName" disabled></t-input>
                      </t-form-item>
                      <div style="height: 40vh;overflow: auto;">
                      <t-collapse @change="handlePanelChange" v-if="addFieldFormData.fieldList.length" :expand-on-row-click="false">
                        <t-collapse-panel v-for="(item,index) in addFieldFormData.fieldList" :value="index" :key="index">
                          <template #header>
                            <t-space size="small">
                              <t-input v-model="addFieldFormData.fieldList[index].COLUMN_NAME" placeholder="字段名"></t-input>
                            </t-space>
                          </template>
                          <template #headerRightContent>
                              <t-button shape="circle" theme="danger" @click="removeField(index)">
                                <template #icon><Delete1Icon /></template>
                              </t-button>
                          </template>
                          <t-space>
                            <t-form-item label="字段类型" name="DATA_TYPE">
                              <t-select v-model="addFieldFormData.fieldList[index].DATA_TYPE" placeholder="请选择字段类型" clearable>
                                <t-option v-for="item in DATA_TYPE_OPTIONS" :key="item" :value="item" :label="item"></t-option>
                              </t-select>
                            </t-form-item>
                            <t-form-item label="默认值" name="COLUMN_DEFAULT">
                              <t-input v-model="addFieldFormData.fieldList[index].COLUMN_DEFAULT"/>
                            </t-form-item>
                          </t-space>
                          <div style="height: 10px;"></div>
                          <t-space>
                            <t-form-item label="注释" name="COLUMN_COMMENT">
                              <t-input v-model="addFieldFormData.fieldList[index].COLUMN_COMMENT"/>
                            </t-form-item>
                            <t-form-item label="非空" name="IS_NULLABLE">
                              <t-checkbox v-model="addFieldFormData.fieldList[index].IS_NULLABLE"/>
                            </t-form-item>
                          </t-space>
                          <div style="height: 10px;"></div>
                          <t-space>
                            <t-form-item label="长度" name="CHARACTER_MAXIMUM_LENGTH">
                              <t-input v-model="addFieldFormData.fieldList[index].CHARACTER_MAXIMUM_LENGTH" type="number"/>
                            </t-form-item>
                            <t-form-item label="主键" name="IS_NULLABLE">
                              <t-checkbox v-model="addFieldFormData.fieldList[index].IS_NULLABLE"/>
                            </t-form-item>
                          </t-space>
                        </t-collapse-panel>
                      </t-collapse>
                      </div>
                    </t-form>

                    <!--endregion -->
                    <t-divider />
                    <t-button block size="medium" variant="dashed" @click="pushField">
                      <template #icon>
                        <AddIcon/>
                      </template>
                      添加字段
                    </t-button>
                  </t-tab-panel>
                  <t-tab-panel value="edit">
                    <template #label>
                      <t-icon name="edit" class="tabs-icon-margin"/>
                      修改字段
                    </template>
                    <p style="padding: 25px">
                      {{ `选项卡2内容` }}
                    </p>
                  </t-tab-panel>
                  <t-tab-panel value="dataBase">
                    <template #label>
                      <t-icon name="data-base" class="tabs-icon-margin"/>
                      创建表
                    </template>
                    <p style="padding: 25px">
                      {{ `选项卡2内容` }}
                    </p>
                  </t-tab-panel>
                </t-tabs>
              </div>

              <template #actions>
                <t-select clearable>
                  <t-option v-for="(item,index) in dataBaseOptions" :key="index" :value="item" :label="item"></t-option>
                </t-select>
              </template>
            </t-card>

            <!-- 生成按钮 -->
            <div class="gen-btn">
              <div>
                <t-button block @click="generate">
                  <template #icon>
                    <SystemCodeIcon/>
                  </template>
                  生成
                </t-button>
              </div>
              <div>
                <t-button theme="default" @click="generate">
                  <template #icon>
                    <RefreshIcon/>
                  </template>
                  重置
                </t-button>
              </div>
            </div>
          </div>
        </t-col>
        <t-col :span="6">
          <div class="result_box">
            <t-card title="生成结果" hover-shadow header-bordered :style="{ height: '85vh' }">
              <div class="typo typo-selection" v-html="result"></div>
            </t-card>
          </div>
        </t-col>
      </t-row>
    </div>
    <!--endregion -->

    <!--组件 -->
    <TableSelect ref="tableSelect" @getColumnInfo="getColumnInfo"/>
  </div>
</template>

<style lang="scss" scoped>
/* 隐藏滚动条 */
::-webkit-scrollbar {
  width: 10px; /* 设置滚动条宽度 */
}

::-webkit-scrollbar-thumb {
  background-color: gray; /* 设置滚动条滑块颜色 */
  border-radius: 20px;
}

.tabs-icon-margin {
  margin-right: 4px;
}

.page {
  padding: 65px 100px 0 100px;
  position: relative;

  .tool {
    min-height: 85vh;

    .generate_box {
      position: relative;

      .content {
      }

      .gen-btn {
        position: absolute;
        bottom: 10px;
        width: 100%;
        display: flex;

        & div:nth-child(1) {
          padding: 0 20px;
          flex: 2;
        }

        & div:nth-child(2) {
          flex: 2;
        }
      }

    }

    .result_box {

    }

  }
}
</style>
