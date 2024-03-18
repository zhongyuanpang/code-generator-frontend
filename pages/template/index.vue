<script setup lang="ts">
import TableColumnSelect from "~/components/TableColumnSelect.vue";
import AddField from "~/components/hy/AddField.vue";
import {ref,onMounted,nextTick} from 'vue'
import {reactive} from "#imports";
import Prism from 'prismjs'
import Result from "~/components/Result.vue";
import {templateStore} from "~/store/template";

// 缓存信息
const TEMPLATE_STORE = templateStore();

// 抽屉展示状态
const drawerVisible = ref<boolean>(false)
// 生成的结果
const result = ref("")
const resultVisible = ref(false)
// 选择的标签
const selectTagValue = ref("")
const selectTagRef = ref("")
const addField = ref();

// 标签选择事件
const onChange = ((obj: any)=>{
  selectTagValue.value = obj.name
  selectTagRef.value = obj.ref
  drawerVisible.value = false
  TEMPLATE_STORE.SET_SELECT_TAG_VALUE(obj.name)
  TEMPLATE_STORE.SET_SELECT_TAG_REF(obj.ref)
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

onMounted(()=>{
  selectTagValue.value = TEMPLATE_STORE.GET_SELECT_TAG_VALUE()
  selectTagRef.value = TEMPLATE_STORE.GET_SELECT_TAG_REF()
  result.value = TEMPLATE_STORE.GET_RESULT()


  nextTick(()=>{
    Prism.highlightAll()
    resultVisible.value = TEMPLATE_STORE.GET_RESULT_VISIBLE()
  })
  setTimeout(()=>{
    resultVisible.value = TEMPLATE_STORE.GET_RESULT_VISIBLE()
  },100)
})

// 生成数据
const generate = (()=>{
    let value = null;
    switch (selectTagRef.value){
      case "addField":
        value = addField.value.process()
        break
    }
    if (value instanceof Promise) return

    result.value = value

    nextTick(()=>{
        Prism.highlightAll()
    })

    setTimeout(()=>{
      resultVisible.value = true
      TEMPLATE_STORE.SET_RESULT(result.value)
      TEMPLATE_STORE.SET_RESULT_VISIBLE(true)
    },100)
})

// 清空数据
const clear = (()=>{
  result.value = ""
  resultVisible.value = false
  TEMPLATE_STORE.SET_RESULT("")
  TEMPLATE_STORE.SET_RESULT_VISIBLE(false)
})


// 重置数据
const refresh = (()=>{
  switch (selectTagRef.value){
    case "addField":
      addField.value.refresh()
      break
  }

  result.value = ""
  resultVisible.value = false
  TEMPLATE_STORE.SET_RESULT("")
  TEMPLATE_STORE.SET_RESULT_VISIBLE(false)
})
</script>

<template>
    <div class="page">
        <!--region  < 模板展示 > -->
        <TableColumnSelect ref="tableColumnSelect" v-if="selectTagValue === 'column'"/>
        <AddField ref="addField" v-if="selectTagValue === '新增字段'"/>
        <!--endregion  -->

        <!--region 结果展示 -->
        <t-divider align="left"  v-if="result">结果展示</t-divider>
        <div>
          <t-row :gutter="16">
            <t-col :span="3">
              <t-affix ref="affix" :offset-top="100" :offset-bottom="-250">
                <Result v-if="resultVisible"/>
              </t-affix>
            </t-col>
            <t-col :span="9">
              <div class="generate_content typo typo-selection" v-html="result" v-if="result"></div>
            </t-col>
          </t-row>
        </div>
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
              <div class="divider">{{item.name}}</div>
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
        <div class="sticky-tool">
            <div class="btn-tool" @click="drawerVisible = true">选择模板</div>
            <div class="btn-tool" @click="generate">生成结果</div>
            <div class="btn-tool" @click="clear">清空</div>
            <div class="btn-tool" @click="refresh">重置</div>
        </div>

        <!-- 生成结果展示 -->
    </div>
</template>

<style lang="scss" scoped>
.page{
    padding: 55px 100px 0 100px;

    .generate_content{
        padding: 20px 30px;
        border-radius: 15px;
        box-shadow: $default-box-shadow;
    }

    .sticky-tool{
        width: 100%;
        position: fixed;
        bottom: 55px;
        left: 45%;
        transform: translateX(-45%);
        line-height: 40px;
        padding: 0 40px;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border-radius: 20px;
        user-select: none;
        z-index: 9999 !important;

        & div{
          padding: 0 25px;
          background: $default-background;
          margin-right: 10px;
          border-radius: 20px;
        }

        .btn-tool {
          overflow: hidden;
          position: relative;
          transition: background-color .3s;
        }

        .btn-tool::before {
          content: "";
          position: absolute;
          width: 50px;
          height: 200%;
          background-color: rgba(255, 255, 255, .6);
          transform: skew(45deg) translate3d(-200px,0,0);
        }

        .btn-tool:hover {
          background-color: #2c3e50;
          margin-top: -10px;
          transition:all .5s;
        }

        .btn-tool:hover::before {
          transition: ease-in-out .7s;
          transform: skew(45deg) translate3d(300px,0,0);
        }
    }
}


::v-deep .divider{
  color: $base-color !important;
  font-size: larger;
  font-weight: bolder;
  margin: 20px 0;
  position: relative;
  padding-left: 15px;

  &::before{
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background-color: $base-color;
  }
}
</style>
