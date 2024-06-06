<script setup lang="ts">
// region  《- 引入组件 -》
import TableColumnSelect from "~/components/TableColumnSelect.vue";
import AddField from "~/components/hy/AddField.vue";
import ExcelPaste from "~/components/hy/ExcelPaste.vue";
import ImageUpload from "~/components/hy/ImageUpload.vue";
import FrontendCommonlyUsed from "~/components/hy/FrontendCommonlyUsed.vue";
import FrontEndCommonTool from "~/components/tool/FrontEndCommonTool.vue";
import Result from "~/components/Result.vue";
// endregion

import Prism from 'prismjs'
import {ref,onMounted,nextTick} from 'vue'
import {reactive} from "#imports";
import {templateStore} from "~/store/template";

// 页面缓存信息
const TEMPLATE_STORE = templateStore();

// 抽屉展示状态
const drawerVisible = ref<boolean>(false)

// 生成的结果
const result = ref("")
const resultVisible = ref(false)

// 选择的标签
const selectTagValue = ref("")

// region 《- refs -》

// region < 组件ref >
const addField = ref();
const excelPaste = ref();
const imageUpload = ref();
const frontendCommonlyUsed = ref();
const frontEndCommonTool = ref();
// endregion

// 悬浮菜单
const suspendedMenu = ref();

// endregion

// 标签选择事件
const onChange = (checkedValues : any) => {
  // 清除上一次的结果
  clear()
  // 设置当前选择的标签
  selectTagValue.value = checkedValues || ''
  // 设置选择的标签值
  TEMPLATE_STORE.SET_SELECT_TAG_VALUE(checkedValues)
};

// 模板列表
const templateList = reactive([
  {
    name:"Vxe Grid",
    icon:"",
    url:"",
    collapseList:[
      {
        name:"基本",
        tagList:['column']
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
        tagList:['前端常用功能','EXCEL粘贴','图片上传','主表弹窗选择']
      },
      {
        name:"后端",
        tagList:[]
      },
      {
        name:"前后端",
        tagList:['新增字段']
      },
    ],
  },
  {
    name:"工具",
    icon:"",
    url:"",
    collapseList:[
      {
        name:"前端",
        tagList:['前端通用工具']
      },
    ]
  }
])

onMounted(()=>{
  selectTagValue.value = TEMPLATE_STORE.GET_SELECT_TAG_VALUE()
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
    switch (selectTagValue.value){
      case "新增字段":
        value = addField.value.process()
        break
      case "EXCEL粘贴":
        value = excelPaste.value.process()
        break
      case "图片上传":
        value = imageUpload.value.process()
        break
      case "前端常用功能":
        value = frontendCommonlyUsed.value.process()
        break
      case "前端通用工具":
        value = frontEndCommonTool.value.process()
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
  switch (selectTagValue.value){
    case "新增字段":
      addField.value.refresh()
      break
  }

  result.value = ""
  resultVisible.value = false
  TEMPLATE_STORE.SET_RESULT("")
  TEMPLATE_STORE.SET_RESULT_VISIBLE(false)
})

/**
 * 拖动悬浮菜单
 */
const onMouseDown = ((event:any) => {
  const box = suspendedMenu.value;
  const startX = event.clientX;
  const startY = event.clientY;
  const offsetX = startX - box.offsetLeft;
  const offsetY = startY - box.offsetTop;

  const onMouseMove = (event : any) => {
    const left = event.clientX - offsetX;
    const top = event.clientY - offsetY;
    box.style.left = left + "px";
    box.style.top = top + "px";
  };

  const onMouseUp = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
})
</script>

<template>
    <div class="page">
        <!--region  < 模板展示 > -->
        <TableColumnSelect ref="tableColumnSelect" v-if="selectTagValue === 'column'"/>
        <AddField ref="addField" v-if="selectTagValue === '新增字段'"/>
        <ExcelPaste ref="excelPaste" v-if="selectTagValue === 'EXCEL粘贴'"/>
        <ImageUpload ref="imageUpload" v-if="selectTagValue === '图片上传'"/>
        <FrontendCommonlyUsed ref="frontendCommonlyUsed" v-if="selectTagValue === '前端常用功能'"/>
        <FrontEndCommonTool ref="frontEndCommonTool" v-if="selectTagValue === '前端通用工具'"/>
        <!--endregion  -->

        <!--region 结果展示 -->
        <t-divider align="left" v-if="result"><strong>结果展示</strong></t-divider>
        <div>
          <t-row :gutter="16">
            <t-col :span="3" v-if="resultVisible">
              <t-affix ref="affix" :offset-top="100" :offset-bottom="-250">
                <Result/>
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
                <t-collapse-panel v-for="(itm,idx) in item.collapseList" :key="idx" :value="itm.name" :header="itm.name" >
                  <t-space align="center" v-if="itm.tagList.length">
                    <t-radio-group v-model="selectTagValue" @change="onChange">
                      <t-radio v-for="(tag,i) in itm.tagList" allow-uncheck :key="i" :value="tag">{{tag}}</t-radio>
                    </t-radio-group>
                  </t-space>
                </t-collapse-panel>
              </t-collapse>
          </div>

        </t-drawer>
        </client-only>
        <!--endregion -->

        <!-- 功能菜单 -->
        <div class="sticky-tool" ref="suspendedMenu" @mousedown="onMouseDown">
            <div class="btn-tool" @click="drawerVisible = true"><i class="iconfont icon-moban"/></div>
            <div class="btn-tool" @click="generate"><i class="iconfont icon-shengchengdaima"/></div>
            <div class="btn-tool" @click="clear"><i class="iconfont icon-qingchu"/></div>
            <div class="btn-tool" @click="refresh"><i class="iconfont icon-reset"/></div>
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
      background: rgba(238, 238, 238, .6);
      position: fixed;
      bottom: 55px;
      left: 50%;
      width: 250px;
      padding: 0 30px;
      height: 70px;
      transform: translateX(-50%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      border-radius: 35px;
      user-select: none;
      z-index: 9999 !important;

        & div{
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 17px rgba(0, 0, 0, 0.5);

          & i{
            color: grey;
            font-weight: bolder;
            font-size: 1.2em;
            transition:all .2s;
          }

          &:hover{
            & i{
              color: white;
            }
          }
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


:deep(.divider){
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

:deep(.divider){
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

:deep(.t-radio) {
  background-color: $base-color;
  border-radius: 7px;
  padding: 3px 7px;

  .t-radio__label{
    color: white !important;
    font-size: 0.9em;
  }
}
</style>
