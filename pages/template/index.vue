<script setup lang="ts">
import TableColumnSelect from "~/components/TableColumnSelect.vue";
import AddField from "~/components/hy/AddField.vue";
import {ref,onMounted,nextTick} from 'vue'
import {reactive} from "#imports";
import Prism from 'prismjs'
import Result from "~/components/Result.vue";

// 抽屉展示状态
const drawerVisible = ref<boolean>(false)

// 生成的结果
const result = ref("")

const resultVisible = ref(false)

// 标签选择事件
const onChange = ((obj: any)=>{
  checkTagValue.value = obj.name
  checkTagRef.value = obj.ref
  drawerVisible.value = false
})

// 模板列表
const templateList = reactive([
  {
    name:"Vxe Grid",
    icon:"",
    url:"",
    collapseList:[
      {
        name:"基本",
        tagList:[
          {
            name:'column',
            ref:'tableColumnSelect'
          }
        ]
      },
    ],
  },
  {
    name:"鹤虞",
    icon:"",
    url:"",
    collapseList:[
      {
        name:"前端",
        tagList:[]
      },
      {
        name:"后端",
        tagList:[]
      },
      {
        name:"前后端",
        tagList:[
          {
            name:'新增字段',
            ref:'addField'
          }
        ]
      },
    ],

  },
])

// 选择的标签
const checkTagValue = ref("")
const checkTagRef = ref("")

const addField = ref();

// 生成数据
const generate = (()=>{
    switch (checkTagRef.value){
      case "addField":
        result.value = addField.value.process()
        break
    }
    nextTick(()=>{
        Prism.highlightAll()
    })

    setTimeout(()=>{
      resultVisible.value = true
    },100)
})
</script>

<template>
    <div class="page">
        <!--region  < 模板展示 > -->
        <TableColumnSelect ref="tableColumnSelect" v-if="checkTagValue === 'column'"/>
        <AddField ref="addField" v-if="checkTagValue === '新增字段'"/>
        <!--endregion  -->

        <!--region 结果展示 -->
<!--          <t-divider align="left"  v-if="result">结果展示</t-divider>-->
          <t-row :gutter="16">
            <t-col :span="3">
              <t-affix ref="affix" :offset-top="100" :offset-bottom="-140">
                <Result v-if="resultVisible"/>
              </t-affix>
            </t-col>
            <t-col :span="9">
              <div class="generate_content typo typo-selection" v-html="result" v-if="result"></div>
            </t-col>
          </t-row>
        <!--endregion -->

        <!--region < 抽屉展示 > -->
        <client-only>
        <t-drawer v-model:visible="drawerVisible"
                  attach="body"
                  mode="overlay"
                  size="60%"
                  sizeDraggable
                  :footer="false"
                  header="模板选择">

          <div v-for="(item,index) in templateList" :key="index">
              <t-divider>
                <t-avatar image="~/assets/images/template/hy.jpg" v-if="item.url" /> {{item.name}}
              </t-divider>
              <t-collapse expand-icon-placement="right">
                <t-collapse-panel v-for="(itm,idx) in item.collapseList" :key="idx" :value="itm.name" :header="itm.name">
                  <t-space align="center" v-if="itm.tagList.length">
                    <t-radio-group>
                      <t-radio v-for="(tag,i) in itm.tagList" :key="i" :value="tag.name" @click="onChange(tag)">{{tag.name}}</t-radio>
                    </t-radio-group>
                  </t-space>
                </t-collapse-panel>
              </t-collapse>
          </div>
        </t-drawer>
        </client-only>
        <!--endregion -->

        <!-- 侧边栏 -->
        <div class="sticky-tool" @click="drawerVisible = true">
          选择模板
        </div>

        <div class="sticky-generate" @click="generate">
          生成结果
        </div>

        <!-- 生成结果展示 -->
    </div>
</template>

<style lang="scss" scoped>
.page{
    padding: 0 100px;
    position: relative;


    .generate_content{
        padding: 20px 30px;
        min-height: 500px;
        border-radius: 15px;
        box-shadow: $default-box-shadow;
    }

    .sticky-tool{
        position: fixed;
        bottom: 55px;
        left: 45%;
        transform: translateX(-45%);
        line-height: 40px;
        padding: 0 40px;
        background: $default-background;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border-radius: 20px;
        user-select: none;
        box-shadow: 0 0 20px $default-background;
        z-index: 9999 !important;
    }

    .sticky-generate{
        position: fixed;
        bottom: 55px;
        left: 55%;
        transform: translateX(-55%);
        line-height: 40px;
        padding: 0 40px;
        background: $default-background;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border-radius: 20px;
        user-select: none;
        box-shadow: 0 0 20px $default-background;
        z-index: 9999 !important;
    }
}
</style>
