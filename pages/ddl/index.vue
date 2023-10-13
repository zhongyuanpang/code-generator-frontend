<script setup lang="ts">
import {reactive, ref} from 'vue'

// 选择生成数据库类型
const dataBaseOptions = reactive<any>([
  'MySQL', 'PostgreSQL', 'Oracle', 'SQL Server', 'MongoDB'
])

// 生成的结果
const result = ref("")

// tabs默认选择
const value = ref('add');


const currentItem = ref([]);
const handlePanelChange = (val: any) => {
  console.log(val);
};

// tabs切换事件
const handlerChange = (newValue: string) => {
  value.value = newValue;
};

// 生成事件
const generate = (() => {

})

// 添加字段
const pushField = (() => {

})
</script>

<template>
  <div class="page">

    <!--region  《 功能区域 》 -->
    <div class="tool">
      <t-row :gutter="16">
        <t-col :span="6">
          <div class="generate_box">
            <t-card title="快速生成SQL语句" hover-shadow :style="{ height: '85vh' }">
              <div class="content">
                <t-tabs :value="value" @change="handlerChange">
                  <t-tab-panel value="add">
                    <template #label>
                      <t-icon name="add" class="tabs-icon-margin"/>
                      新增字段
                    </template>
                    <!--region  《 手风琴 》  -->
<!--                    <t-space direction="vertical">-->
                      <t-collapse v-model="currentItem" expand-mutex @change="handlePanelChange">
                        <t-collapse-panel value="0" header="这是一个折叠标题">
                          这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。
                        </t-collapse-panel>
                      </t-collapse>
<!--                    </t-space>-->
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
  </div>
</template>

<style lang="scss" scoped>
.tabs-icon-margin {
  margin-right: 4px;
}

.page {
  padding: 10px 100px 0 100px;

  .tool {
    min-height: 85vh;

    .generate_box {
      position: relative;

      .content {
      }

      .gen-btn {
        position: absolute;
        bottom: 20px;
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
