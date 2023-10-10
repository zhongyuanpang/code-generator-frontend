<script setup lang="ts">
import TableColumnSelect from "~/components/TableColumnSelect.vue";
import {ref} from 'vue'

// 抽屉展示状态
const drawerVisible = ref<boolean>(false)

const handleOpen = ()=>{
    drawerVisible.value = true
}
</script>

<template>
    <div class="page">
        <!--region  < 模板展示 > -->
        <TableColumnSelect/>
        <!--endregion  -->

        <!--region < 抽屉展示 > -->
        <client-only>
        <t-drawer v-model:visible="drawerVisible"
                  attach="body"
                  mode="push"
                  size="60%"
                  sizeDraggable
                  :footer="false"
                  header="模板选择">


        </t-drawer>
        </client-only>
        <!--endregion -->

        <!-- 侧边栏 -->
        <div class="sticky-tool" @click="handleOpen" v-if="!drawerVisible">
<!--          <CaretRightSmallIcon /> -->
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
        box-shadow: $default-box-shadow;
    }
}
</style>
