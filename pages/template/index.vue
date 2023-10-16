<script setup lang="ts">
import TableColumnSelect from "~/components/TableColumnSelect.vue";
import AddField from "~/components/hy/AddField.vue";
import {ref} from 'vue'
import {reactive} from "#imports";

// 抽屉展示状态
const drawerVisible = ref<boolean>(false)

const handleOpen = ()=>{
    drawerVisible.value = true
}

// 当前选择的标签
const currentItem = ref([]);

// 选择的标签
const checkTagValue = ref("")

const onChange = ((checkedValues: string)=>{
  checkTagValue.value = checkedValues
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
        tagList:[]
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
])

</script>

<template>
    <div class="page">
        <!--region  < 模板展示 > -->
        <TableColumnSelect v-if="checkTagValue === 'column'"/>
        <AddField v-if="checkTagValue === '新增字段'"/>
        <!--endregion  -->

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
              <t-collapse v-model="currentItem"  expand-icon-placement="right">
                <t-collapse-panel v-for="(itm,idx) in item.collapseList" :key="idx" :value="itm.name" :header="itm.name">
                  <t-space align="center" v-if="itm.tagList.length">
                    <t-radio-group @change="onChange">
                      <t-radio v-for="(name,i) in itm.tagList" :key="i" :value="name">{{name}}</t-radio>
                    </t-radio-group>
                  </t-space>
                </t-collapse-panel>
              </t-collapse>
          </div>

        </t-drawer>
        </client-only>
        <!--endregion -->

        <!-- 侧边栏 -->
        <div class="sticky-tool" @click="handleOpen" v-if="!drawerVisible">
          选择模板
        </div>
    </div>
</template>

<style lang="scss" scoped>
.page{
    padding: 0 100px;
    position: relative;

    .sticky-tool{
        position: fixed;
        bottom: 55px;
        left: 50%;
        transform: translateX(-50%);
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
